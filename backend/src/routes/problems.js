import express from 'express';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();




router.get('/', async (req, res) => {
  try {
    const { difficulty, tag, search, premium, page = 1, limit = 500 } = req.query;


    const token = req.headers.authorization?.split(' ')[1];
    let isPro   = false;
    let isAdmin = false;
    if (token) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        const freshUser = await User.findById(decoded.id).select('plan isAdmin');
        if (freshUser) {
          isPro   = freshUser.plan === 'pro' || freshUser.isAdmin;
          isAdmin = freshUser.isAdmin;
        }
      } catch {}
    }


    if (isAdmin) {
      const query = { hidden: false };
      if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
      if (tag  && tag  !== 'all') query.tags = { $in: [new RegExp(tag, 'i')] };
      if (search) query.title = { $regex: search, $options: 'i' };
      if (premium === 'true') query.premium = true;

      const problems = await Problem.find(query)
        .select('-testCases -starter -hints')
        .sort({ number: 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await Problem.countDocuments(query);
      return res.json({ problems, total, page: parseInt(page) });
    }


    if (isPro) {
      const query = { hidden: false };
      if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
      if (tag  && tag  !== 'all') query.tags = { $in: [new RegExp(tag, 'i')] };
      if (search) query.title = { $regex: search, $options: 'i' };

      const problems = await Problem.find(query)
        .select('-testCases -starter -hints')
        .sort({ number: 1 })
        .limit(parseInt(limit));

      const total = await Problem.countDocuments(query);
      return res.json({ problems, total, page: parseInt(page) });
    }



const baseQuery = { hidden: false, number: { $lte: 40 } };
if (tag       && tag       !== 'all') baseQuery.tags       = { $in: [new RegExp(tag, 'i')] };
if (search)                           baseQuery.title      = { $regex: search, $options: 'i' };
if (difficulty && difficulty !== 'all') baseQuery.difficulty = difficulty;

const problems = await Problem.find(baseQuery)
  .select('-testCases -starter -hints')
  .sort({ number: 1 });

return res.json({ problems, total: problems.length, page: 1 });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/tags', async (req, res) => {
  try {
    const tags = await Problem.distinct('tags', { hidden: false });
    res.json(tags.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/counts', async (req, res) => {
  try {
    const [easy, medium, hard] = await Promise.all([
      Problem.countDocuments({ hidden: false, difficulty: 'Easy' }),
      Problem.countDocuments({ hidden: false, difficulty: 'Medium' }),
      Problem.countDocuments({ hidden: false, difficulty: 'Hard' }),
    ]);
    res.json({ Easy: easy, Medium: medium, Hard: hard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const total = await Problem.countDocuments({ hidden: false });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, hidden: false });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const token = req.headers.authorization?.split(' ')[1];
    if (problem.premium) {
      if (!token) {
        const safe = problem.toObject();
        safe.testCases = []; safe.hints = []; safe.starter = {}; safe.locked = true;
        return res.json(safe);
      }
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        const freshUser = await User.findById(decoded.id).select('plan isAdmin');
        if (!freshUser || (freshUser.plan !== 'pro' && !freshUser.isAdmin)) {
          const safe = problem.toObject();
          safe.testCases = []; safe.hints = []; safe.starter = {}; safe.locked = true;
          return res.json(safe);
        }
      } catch {
        const safe = problem.toObject();
        safe.locked = true;
        return res.json(safe);
      }
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/', adminMiddleware, async (req, res) => {
  try {
    const lastProblem = await Problem.findOne().sort({ number: -1 });
    const number = (lastProblem?.number || 0) + 1;
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const problem = new Problem({ ...req.body, number, slug });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/bulk', adminMiddleware, async (req, res) => {
  try {
    const { problems } = req.body;
    if (!Array.isArray(problems)) return res.status(400).json({ error: 'Expected array of problems' });

    const lastProblem = await Problem.findOne().sort({ number: -1 });
    let nextNumber = (lastProblem?.number || 0) + 1;

    const results = [];
    for (const p of problems) {
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const existing = await Problem.findOne({ slug });
      if (existing) {
        results.push({ title: p.title, status: 'skipped', reason: 'Already exists' });
        continue;
      }
      const problem = new Problem({ ...p, number: nextNumber++, slug });
      await problem.save();
      results.push({ title: p.title, status: 'added', number: problem.number });
    }
    res.json({ results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/number/:num', adminMiddleware, async (req, res) => {
  try {
    const num = parseInt(req.params.num);
    const deleted = await Problem.findOneAndDelete({ number: num });
    if (!deleted) return res.status(404).json({ error: `Problem #${num} not found` });
    await Problem.updateMany({ number: { $gt: num } }, { $inc: { number: -1 } });
    res.json({ message: `Problem #${num} "${deleted.title}" deleted. Remaining problems renumbered.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Problem not found' });
    await Problem.updateMany({ number: { $gt: deleted.number } }, { $inc: { number: -1 } });
    res.json({ message: `"${deleted.title}" deleted. Problems renumbered.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/toggle-premium', adminMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    problem.premium = !problem.premium;
    await problem.save();
    res.json({ premium: problem.premium });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
