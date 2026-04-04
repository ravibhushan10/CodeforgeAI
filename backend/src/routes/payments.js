import express      from 'express';
import crypto       from 'crypto';
import Razorpay     from 'razorpay';
import User         from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



const calcTotal = (baseRupees) => {
  const gateway = Math.round(baseRupees * 0.02);
  const gst     = Math.round(gateway * 0.18);
  return (baseRupees + gateway + gst) * 100;
};


const PLANS = {
  monthly: {
    amount:      calcTotal(10),
    currency:    'INR',
    name:        'CodeForge Pro',
    description: 'Monthly Pro — unlimited problems, AI tutor, priority support',
  },
  yearly: {
    amount:      calcTotal(50),
    currency:    'INR',
    name:        'CodeForge Pro',
    description: 'Yearly Pro — unlimited problems, AI tutor, priority support',
  },
};




router.post('/order', authMiddleware, async (req, res) => {
  try {
    const { plan = 'monthly' } = req.body;

    const planConfig = PLANS[plan];
    if (!planConfig) return res.status(400).json({ error: 'Invalid plan' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.plan === 'pro') return res.status(400).json({ error: 'Already on Pro plan' });

    const order = await razorpay.orders.create({
      amount:   planConfig.amount,
      currency: planConfig.currency,
      receipt:  `cf_${Date.now()}`,
      notes: {
        userId:    req.user.id.toString(),
        plan,
        userEmail: user.email,
      },
    });

    res.json({
      orderId:     order.id,
      amount:      order.amount,
      currency:    order.currency,
      keyId:       process.env.RAZORPAY_KEY_ID,
      name:        planConfig.name,
      description: planConfig.description,
      userEmail:   user.email,
      userName:    user.name,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});




router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = 'monthly',
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }


    const body     = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      console.warn('Signature mismatch for user', req.user.id);
      return res.status(400).json({ error: 'Payment verification failed — invalid signature' });
    }


    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        plan:          'pro',
        proSince:      new Date(),
        lastPaymentId: razorpay_payment_id,
        lastOrderId:   razorpay_order_id,
      },
      { new: true }
    ).select('-passwordHash -oauthId');

    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log(`Payment verified — ${user.email} upgraded to pro (${plan} plan)`);
    res.json({ success: true, plan: user.plan, user });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});




router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret    = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!secret || !signature) {
      return res.status(400).json({ error: 'Missing webhook secret or signature' });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    if (expected !== signature) {
      console.warn('Webhook signature mismatch');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event   = JSON.parse(req.body.toString());
    const payload = event.payload;

    console.log(`Webhook: ${event.event}`);

    switch (event.event) {

      case 'payment.authorized':
      case 'payment.captured': {
        const payment = payload.payment?.entity;
        if (!payment) break;
        const userId = payment.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            plan:          'pro',
            proSince:      new Date(),
            lastPaymentId: payment.id,
          });
          console.log(`${event.event} → user ${userId} is now pro`);
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payment?.entity;
        console.warn(`payment.failed — id: ${payment?.id}, reason: ${payment?.error_description}`);
        break;
      }

      case 'subscription.activated':
      case 'subscription.charged': {
        const sub    = payload.subscription?.entity;
        const userId = sub?.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, { plan: 'pro', proSince: new Date() });
          console.log(`${event.event} → user ${userId} Pro kept`);
        }
        break;
      }

      case 'subscription.halted': {
        const sub = payload.subscription?.entity;
        console.warn(`subscription.halted — id: ${sub?.id}`);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.completed': {
        const sub    = payload.subscription?.entity;
        const userId = sub?.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, { plan: 'free' });
          console.log(`${event.event} → user ${userId} downgraded to free`);
        }
        break;
      }

      case 'subscription.paused': {
        const sub    = payload.subscription?.entity;
        const userId = sub?.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, { plan: 'free' });
          console.log(`subscription.paused → user ${userId} → free`);
        }
        break;
      }

      case 'subscription.resumed': {
        const sub    = payload.subscription?.entity;
        const userId = sub?.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, { plan: 'pro' });
          console.log(`subscription.resumed → user ${userId} → pro`);
        }
        break;
      }

      case 'refund.processed': {
        const refund    = payload.refund?.entity;
        const paymentId = refund?.payment_id;
        if (paymentId) {
          const user = await User.findOneAndUpdate(
            { lastPaymentId: paymentId },
            { plan: 'free' },
            { new: true }
          );
          if (user) console.log(`refund.processed → user ${user.email} → free`);
        }
        break;
      }

      case 'refund.failed': {
        const refund = payload.refund?.entity;
        console.warn(`refund.failed — id: ${refund?.id}`);
        break;
      }

      case 'order.paid': {
        const order  = payload.order?.entity;
        const userId = order?.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, { plan: 'pro', proSince: new Date() });
          console.log(`order.paid → user ${userId} → pro`);
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});




router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('plan proSince lastPaymentId');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      plan:          user.plan,
      isPro:         user.plan === 'pro',
      proSince:      user.proSince,
      lastPaymentId: user.lastPaymentId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
