import express from 'express';
import fetch from 'node-fetch';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const LANG_MAP = {
  cpp:        { language: 'c++',        version: '10.2.0'  },
  python:     { language: 'python',     version: '3.10.0'  },
  java:       { language: 'java',       version: '15.0.2'  },
  c:          { language: 'c',          version: '10.2.0'  },
  javascript: { language: 'javascript', version: '18.15.0' },
};

const JUDGE0_BATCH_URL = 'https://judge0-ce.p.rapidapi.com/submissions/batch';
const JUDGE0_LANG = { cpp: 54, python: 71, java: 62, c: 50, javascript: 63 };

const judge0Headers = () => ({
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
});

const fixInput = s => s.replace(/\\n/g, '\n');




const applyWrapper = (userCode, wrapper) => {
  if (!wrapper || !wrapper.trim()) return userCode;
  return wrapper.replace('__USER_CODE__', userCode);
};

async function runBatch(code, lang, inputs) {
  try {
    const start = Date.now();
    const langKey = lang.language === 'c++' ? 'cpp' : lang.language;
    const langId = JUDGE0_LANG[langKey];

    const createResp = await fetch(`${JUDGE0_BATCH_URL}?base64_encoded=false`, {
      method: 'POST',
      headers: judge0Headers(),
      body: JSON.stringify({
        submissions: inputs.map(stdin => ({
          source_code: code,
          language_id: langId,
          stdin,
          cpu_time_limit: 5,
          wall_time_limit: 10,
        })),
      }),
    });

    const tokens = await createResp.json();
    if (!Array.isArray(tokens)) {
      console.error('Judge0 batch create error:', tokens);
      return inputs.map(() => ({ stdout: '', stderr: 'Judge0 error: ' + JSON.stringify(tokens), exitCode: 1, runtime: 'N/A', runtimeMs: 0 }));
    }

    const tokenList = tokens.map(t => t.token).join(',');

    let results = null;
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const getResp = await fetch(
        `${JUDGE0_BATCH_URL}?tokens=${tokenList}&base64_encoded=false&fields=stdout,stderr,compile_output,status`,
        { headers: judge0Headers() }
      );
      const data = await getResp.json();
      const allDone = data.submissions?.every(s => s.status?.id >= 3);
      if (allDone) { results = data.submissions; break; }
    }

    if (!results) return inputs.map(() => ({ stdout: '', stderr: 'Execution timed out', exitCode: 1, statusLabel: 'Time Limit Exceeded', runtime: 'N/A', runtimeMs: 0 }));

    const elapsed = Date.now() - start;
    return results.map(s => {
      const id = s.status?.id;
      const statusLabel =
        id === 3  ? 'Accepted' :
        id === 4  ? 'Wrong Answer' :
        id === 5  ? 'Time Limit Exceeded' :
        id === 6  ? 'Compilation Error' :
        id >= 7 && id <= 12 ? 'Runtime Error' :
        id === 13 ? 'Internal Error' :
        'Runtime Error';
      return {
        stdout:      (s.stdout || '').trim(),
        stderr:      (s.stderr || s.compile_output || '').trim(),
        exitCode:    id === 3 ? 0 : 1,
        statusLabel,
        runtime:     `${elapsed}ms`,
        runtimeMs:   elapsed,
      };
    });
  } catch (err) {
    return inputs.map(() => ({ stdout: '', stderr: 'Execution service unavailable', exitCode: 1, runtime: 'N/A', runtimeMs: 0 }));
  }
}


router.post('/run', authMiddleware, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    const lang = LANG_MAP[language];
    if (!lang) return res.status(400).json({ error: 'Unsupported language' });

    if (!problemId) {
      const { stdin = '' } = req.body;
      const [result] = await runBatch(code, lang, [fixInput(stdin)]);
      return res.json({ results: [{ input: stdin, expected: '', actual: result.stdout, passed: result.exitCode === 0, stderr: result.stderr }] });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });


    const wrapper = problem.codeWrapper?.[language] || '';
    const finalCode = applyWrapper(code, wrapper);


    const testCases = problem.testCases.filter(tc => !tc.hidden);
    if (testCases.length === 0) return res.json({ results: [] });

    const inputs = testCases.map(tc => fixInput(tc.input));
    const batchResults = await runBatch(finalCode, lang, inputs);

    const results = testCases.map((tc, i) => {
      const r = batchResults[i];
      const actual = r.stdout;
      const expected = tc.expected.trim();
      return {
        input:       tc.input,
        expected,
        actual:      r.exitCode !== 0 ? (r.stderr || 'Runtime Error') : actual,
        passed:      r.exitCode === 0 && actual === expected,
        stderr:      r.stderr,
        statusLabel: r.statusLabel,
      };
    });

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    const lang = LANG_MAP[language];
    if (!lang) return res.status(400).json({ error: 'Unsupported language' });

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });


    const wrapper = problem.codeWrapper?.[language] || '';
    const finalCode = applyWrapper(code, wrapper);


    const testCases = problem.testCases;
    if (testCases.length === 0) {
      const [result] = await runBatch(finalCode, lang, ['']);
      const verdict = result.exitCode === 0 ? 'Accepted' : 'Runtime Error';
      const sub = new Submission({
        user: req.user.id, problem: problemId, language, code,
        verdict, runtime: result.runtime,
        testsPassed: result.exitCode === 0 ? 1 : 0, testsTotal: 1,
        output: result.stdout, stderr: result.stderr,
      });
      await sub.save();
      await updateUserStats(req.user.id, problem, verdict === 'Accepted');
      return res.json({ ...sub.toObject(), beats: null, failCase: null });
    }

    const inputs = testCases.map(tc => fixInput(tc.input));
    const batchResults = await runBatch(finalCode, lang, inputs);

    let passed = 0, firstFail = null, totalRuntime = 0;
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const r = batchResults[i];
      totalRuntime += r.runtimeMs || 0;
      const actual = r.stdout;
      const expected = tc.expected.trim();

      if (r.exitCode !== 0) {
        if (!firstFail) firstFail = {
          input:    tc.input,
          expected,
          actual:   r.stderr || 'Runtime Error',
          stderr:   r.stderr,
          isHidden: tc.hidden,
        };
        break;
      }
      if (actual === expected) {
        passed++;
      } else if (!firstFail) {
        firstFail = {
          input:    tc.hidden ? '(hidden)' : tc.input,
          expected: tc.hidden ? '(hidden)' : expected,
          actual:   tc.hidden ? '(hidden)' : actual,
          isHidden: tc.hidden,
        };
      }
    }

    const verdict =
      passed === testCases.length ? 'Accepted' :
      firstFail?.stderr ? 'Runtime Error' :
      'Wrong Answer';

    const sub = new Submission({
      user:        req.user.id,
      problem:     problemId,
      language,
      code,
      verdict,
      runtime:     `${Math.round(totalRuntime / testCases.length)}ms`,
      testsPassed: passed,
      testsTotal:  testCases.length,
      output:      firstFail ? JSON.stringify(firstFail) : '',
      stderr:      firstFail?.stderr || '',
    });
    await sub.save();
    await updateUserStats(req.user.id, problem, verdict === 'Accepted');

    res.json({
      ...sub.toObject(),
      beats:    verdict === 'Accepted' ? Math.floor(Math.random() * 30 + 65) : null,
      failCase: firstFail,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { problemId, limit = 20 } = req.query;
    const query = { user: req.user.id };
    if (problemId) query.problem = problemId;
    const subs = await Submission.find(query)
      .populate('problem', 'title number slug difficulty')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


async function updateUserStats(userId, problem, accepted) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    const pid = problem._id.toString();
    const alreadySolved = user.solved.map(s => s.toString()).includes(pid);
    if (!user.attempted.map(a => a.toString()).includes(pid)) user.attempted.push(problem._id);
    if (accepted && !alreadySolved) {
      user.solved.push(problem._id);
      user.rating += (problem.points || 0);
      user.ratingTitle = getRatingTitle(user.rating);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (user.streakLast === today) {}
      else if (user.streakLast === yesterday) { user.streak += 1; }
      else { user.streak = 1; }
      user.streakLast = today;
    }
    await user.save();
  } catch (err) { console.error('updateUserStats error:', err); }
}

function getRatingTitle(r) {
 if (r < 400)  return 'Beginner';
    if (r < 800)  return 'Coder';
    if (r < 1200) return 'Problem Solver';
    if (r < 1600) return 'Algorithmist';
    if (r < 2000) return 'Code Expert';
    if (r < 2400) return 'Senior Algorithmist';
    if (r < 2800) return 'Elite Programmer';
    return 'Legendary Coder';
}

export default router;
