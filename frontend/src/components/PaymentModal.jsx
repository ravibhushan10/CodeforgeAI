import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import WelcomePro from './WelcomePro.jsx';
import axios from 'axios';
import styles from './PaymentModal.module.css';

const FEATURES = [
  'All 160+ problems',
  'Unlimited AI Tutor sessions',
  'Company-specific problem filters',
  'Advanced analytics dashboard',
  'Priority support',
];

const PLANS = [
  {
    id: 'monthly',
    label: '1 Month',
    display: '₹10',
    per: '/month',
    badge: null,
    description: 'Billed monthly',
    price: 10,
  },
  {
    id: 'yearly',
    label: '1 Year',
    display: '₹50',
    per: '/year',
    badge: 'Best Value',
    description: '~₹4/mo · Save 33%',
    price: 50,
  },
];

export default function PaymentModal({ show, onClose }) {
  const { user, updateUserLocal, refreshUser, toast } = useApp();
  const [step,         setStep]         = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading,      setLoading]      = useState(false);
  const [showWelcome,  setShowWelcome]  = useState(false);

  if (showWelcome) {
    return <WelcomePro onClose={() => { setShowWelcome(false); onClose(); }} />;
  }

  if (!show) return null;

  if (user?.plan === 'pro') {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal" style={{ textAlign: 'center' }}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}></div>
          <h2>You're on Pro!</h2>
          <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>All features are already unlocked.</p>
          <button className="btn btn-primary" style={{ marginTop: 24, justifyContent: 'center' }} onClick={onClose}>Awesome!</button>
        </div>
      </div>
    );
  }

  const activePlan     = PLANS.find(p => p.id === selectedPlan);
  const gatewayFee     = Math.round(activePlan.price * 0.02);
  const gstOnFee       = Math.round(gatewayFee * 0.18);
  const convenienceFee = gatewayFee + gstOnFee;
  const total          = activePlan.price + convenienceFee;

  const handleContinueToPay = async () => {
    setLoading(true);
    try {
      const { data: order } = await axios.post('/api/payments/order', {
        plan: selectedPlan,
      });

      const options = {
        key:         order.keyId,
        amount:      order.amount,
        currency:    order.currency,
        name:        order.name,
        description: order.description,
        order_id:    order.orderId,
        prefill: {
          name:  order.userName,
          email: order.userEmail,
        },
        theme: { color: '#00d084' },
        handler: async (response) => {
          try {
            const { data } = await axios.post('/api/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan:                selectedPlan,
            });
            updateUserLocal({ plan: data.plan });
            await refreshUser();
            toast('Welcome to Pro! All features unlocked.', 'success');
            setShowWelcome(true);
          } catch {
            toast('Payment verification failed. Contact support.', 'error');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast(`Payment failed: ${response.error.description}`, 'error');
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      toast(err.response?.data?.error || 'Failed to initiate payment', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.modal}`}>
        <button className="modal-close" onClick={onClose}>✕</button>


        {step === 1 && (
          <>
            <div className={styles.header}>
              <h2>Upgrade to Pro</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', marginTop: 4 }}>
                Unlock everything.
              </p>
            </div>

            <div className={styles.planSelector}>
              {PLANS.map(plan => (
                <button
                  key={plan.id}
                  className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planCardActive : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.badge && <div className={styles.planBadge}>{plan.badge}</div>}
                  <div className={styles.planLabel}>{plan.label}</div>
                  <div className={styles.planPrice}>
                    <span className={styles.planAmount}>{plan.display}</span>
                    <span className={styles.planPer}>{plan.per}</span>
                  </div>
                  <div className={styles.planDesc}>{plan.description}</div>
                </button>
              ))}
            </div>

            <div className={styles.features}>
              {FEATURES.map(f => (
                <div key={f} className={styles.feat}>
                  <span className={styles.featCheck}>✓</span>{f}
                </div>
              ))}
            </div>

 <button
  className={`btn btn-primary w-full ${styles.actionBtn}`}
  onClick={() => setStep(2)}
>
  {`Continue with ₹${activePlan.price}/${activePlan.id === 'monthly' ? 'month' : 'year'}`}
</button>


              <div className={styles.orderRow}>
              </div>
          </>
        )}


        {step === 2 && (
          <>
            <div className={styles.header}>
              <button className={styles.backBtn} onClick={() => setStep(1)}> Back</button>
              <h2>Order Details</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', marginTop: 4 }}>
                Review your order before payment
              </p>
            </div>


            <div className={styles.orderSection}>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Name</span>
                <span className={styles.orderVal}>{user?.name}</span>
              </div>
              <div className={styles.orderDivider} />
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Email</span>
                <span className={styles.orderVal}>{user?.email}</span>
              </div>
            </div>


            <div className={styles.orderSection} style={{ marginTop: 12 }}>


              <div className={styles.orderRow}>
                <div>
                  <div className={styles.orderVal} style={{ fontWeight: 600 }}>Pro Plan</div>
                  <div className={styles.orderLabel}>{activePlan.label === '1 Month' ? 'Monthly' : 'Annually'}</div>
                </div>
                <span className={styles.orderVal}>₹{activePlan.price}</span>
              </div>
              <div className={styles.orderDivider} />


              <div className={styles.orderDivider} />


              <div className={styles.orderRow}>
                <div>
                  <div className={styles.orderLabel}>Payment gateway fee</div>
                  <div className={styles.orderSubLabel}>2% charged by Razorpay</div>
                </div>
                <span className={styles.orderLabel}>₹{gatewayFee}</span>
              </div>
              <div className={styles.orderDivider} />


              <div className={styles.orderRow}>
                <div>
                  <div className={styles.orderLabel}>GST on gateway fee</div>
                  <div className={styles.orderSubLabel}>18% on gateway fee</div>
                </div>
                <span className={styles.orderLabel}>₹{gstOnFee}</span>
              </div>
              <div className={styles.orderDivider} />


              <div className={styles.orderRow}>
                <span className={styles.orderVal} style={{ fontWeight: 700 }}>Total</span>
                <span className={styles.totalAmt}>₹{total}</span>
              </div>

            </div>

            <div className={styles.secureNote}>
              Secured by Razorpay · Pay via Card, UPI, NetBanking & more
            </div>

            <button
              className={`btn btn-primary w-full ${styles.actionBtn}`}
              onClick={handleContinueToPay}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Opening Razorpay…</>
                : `Continue to Pay ₹${total}`}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
