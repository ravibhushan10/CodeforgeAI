import express from 'express';
import fetch from 'node-fetch';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();




router.post('/hint', authMiddleware, async (req, res) => {
  try {
    const { message, problemContext, history = [] } = req.body;
    const key = process.env.GROQ_API_KEY;

    if (!key || key === 'your_groq_api_key_here') {
      return res.json({ reply: `I'm having trouble connecting right now. Please try again in a moment!` });
    }


    const problemTitle = problemContext?.split(' — ')[0]?.trim() || problemContext || 'this problem';

    const systemPrompt = `You are CodeForge AI Tutor — a focused coding interview coach embedded inside a coding platform.

The user is currently solving: "${problemContext}"

YOUR RULES:
1. You only help with the current problem above. If the user asks anything unrelated to coding or this problem (e.g. jokes, weather, general chat, other topics), politely decline in one short sentence and redirect them. Example: "I'm not able to help with that! But if you have questions about ${problemTitle} or any DSA/coding concept related to it — hints, approach, complexity, debugging — I'm all yours!"

2. You CAN answer general coding/DSA questions if they are relevant to solving this problem (e.g. "what is a hash map", "how does BFS work").

3. NEVER give the full solution unless the user explicitly asks with clear intent like "give me the full solution", "show me the complete code", or "I give up, show the answer". If they just ask for "help" or seem stuck, guide them with hints instead.

4. When giving hints — guide their thinking, don't hand them the answer. Ask leading questions, point out what to observe in the examples, suggest what data structure or pattern might help without naming it directly if possible.

5. Keep responses concise and focused. Use markdown formatting — **bold** for key terms, \`inline code\` for variable names, code blocks for any code snippets.

6. Be encouraging and friendly. The user is learning — celebrate small progress and be patient.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6),
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.5,
      }),
    });

    const data = await response.json();



    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.json({ reply: `API error: ${data?.error?.message || 'Unknown error from Groq'}` });
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      console.error('Empty reply from Groq. Full response:', JSON.stringify(data));
      return res.json({ reply: "I'm having trouble responding right now. Please try again!" });
    }

    res.json({ reply });

  } catch (err) {
    console.error('AI tutor error:', err.message);
    res.json({ reply: "I'm having trouble connecting right now. Please try again in a moment!" });
  }
});




router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { code, language = 'python', problemContext } = req.body;
    const key = process.env.GROQ_API_KEY;

    if (!code) return res.status(400).json({ error: 'No code provided' });

    if (!key || key === 'your_groq_api_key_here') {
      return res.json({ reply: 'Code review is unavailable right now. Please try again later.' });
    }

    const systemPrompt = `You are CodeForge AI Tutor doing a code review for the problem: "${problemContext}".

Review the submitted ${language} code and respond in this structure:

**What's Right**
[What the student got correct — be specific]

**Issue(s) Found**
[Exact bug or logical error — trace through an example to show where it breaks]

**Complexity**
Time: O(...) — reason
Space: O(...) — reason

 **One Improvement**
[The single most impactful change — don't rewrite their full solution]

Be precise and encouraging. Under 150 words.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is my ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`` },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();


    res.json({ reply: data.choices?.[0]?.message?.content || 'Could not analyze code at this time.' });

  } catch (err) {
    console.error('AI analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

export default router;
