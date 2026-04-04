import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Help.module.css';
import Seo from '../components/Seo.jsx';

const FAQS = [
  {
    q: "Why can't I access premium problems?",
    a: 'Premium problems require a Pro plan. Upgrade to unlock all 160+ problems including premium ones.',
  },
  {
    q: 'My code is correct but showing wrong answer',
    a: 'Check edge cases and output format carefully. Use the AI Tutor tab for hints without spoiling the solution.',
  },
  {
    q: 'How does the AI Tutor work?',
    a: "It's powered by Groq AI and gives hints, approach strategies and complexity analysis — without revealing the full solution.",
  },
  {
    q: 'How do I cancel my Pro subscription or get a refund?',
    a: "Contact us using the form below with your registered email and we'll process your request within 24 hours.",
  },
  {
    q: "My submission isn't being judged",
    a: 'This is usually a temporary issue with our Judge0 engine. Wait 30 seconds and try submitting again.',
  },
  {
    q: 'How does the rating system work?',
    a: 'Solving Easy problems gives +100 points, Medium +200, and Hard +400. Your rating title updates automatically as you progress.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Click "Sign In" then "Forgot password" to receive a reset code on your registered email address.',
  },
];

const CATEGORIES = [
  'Billing & payments',
  'Bug report',
  'Feature request',
  'Account issue',
  'Premium / Pro plan',
  'Other',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Help() {
  const [form, setForm] = useState({
    name: '', email: '', category: CATEGORIES[0], subject: '', message: '',
  });
  const [errors,      setErrors]      = useState({});
  const [status,      setStatus]      = useState('idle');
  const [serverError, setServerError] = useState('');
  const [openFaq,     setOpenFaq]     = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    else if (form.subject.trim().length < 5) errs.subject = 'Subject must be at least 5 characters.';
    if (!form.message.trim()) errs.message = 'Message is required.';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstField = Object.keys(newErrors)[0];
      document.querySelector(`[name="${firstField}"]`)?.focus();
      return;
    }
    setStatus('loading');
    try {
      await axios.post('/api/users/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', category: CATEGORIES[0], subject: '', message: '' });
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to send message. Please try again or email us directly.');
      setStatus('idle');
    }
  };

  const firstError = Object.keys(errors)[0];

  return (
    <>
    <Seo title="Help & Support" description="Get answers to common questions about CodeForge." path="/help" />
    <div className={`${styles.page} page-animate`}>
      <div className={styles.inner}>


        <div className={styles.hero}>
          <h1 className={styles.title}>Help &amp; Support</h1>
          <p className={styles.sub}>Get answers to common questions or send us a message</p>
        </div>

        <div className={styles.grid}>


          <div className={styles.leftCol}>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Frequently asked questions</h2>
              <div className={styles.faqList}>
                {FAQS.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <button
                      className={`${styles.faqQ} ${openFaq === i ? styles.faqQOpen : ''}`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <span className={`${styles.faqArrow} ${openFaq === i ? styles.faqArrowOpen : ''}`}>▾</span>
                    </button>
                    {openFaq === i && (
                      <div className={styles.faqA}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Contact info</h2>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <div className={styles.infoIcon}>✉</div>
                  <div>
                    <div className={styles.infoLabel}>Email</div>
                    <a href="mailto:codeforge.coder.support@gmail.com" className={styles.infoVal}>
                      codeforge.coder.support@gmail.com
                    </a>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoIcon}>⏱</div>
                  <div>
                    <div className={styles.infoLabel}>Response time</div>
                    <div className={styles.infoVal1}>
                      Within 24 hours
                      <span className={styles.fastBadge}>Usually faster</span>
                    </div>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoIcon}>🔗</div>
                  <div>
                    <div className={styles.infoLabel}>Quick links</div>
                    <div className={styles.quickLinks}>
                      <Link to="/problems" className={styles.quickLink}>Problems</Link>
                      <Link to="/dashboard" className={styles.quickLink}>Dashboard</Link>
                      <Link to="/leaderboard" className={styles.quickLink}>Leaderboard</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Send us a message</h2>

            {status === 'success' ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStatus('idle')}
                  style={{ marginTop: 16 }}
                  >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>

                {serverError && (
                  <div className={styles.errorBanner}>{serverError}</div>
                )}

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Your name <span className={styles.required}>*</span>
                    </label>
                    <input
                      className={`input ${firstError === 'name' ? styles.inputError : ''}`}
                      name="name"
                      placeholder="Ravibhushan Kumar"
                      value={form.name}
                      onChange={handleChange}
                      />
                    {firstError === 'name' && (
                      <span className={styles.fieldError}>{errors.name}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      Email address <span className={styles.required}>*</span>
                    </label>
                    <input
                      className={`input ${firstError === 'email' ? styles.inputError : ''}`}
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      />
                    {firstError === 'email' && (
                      <span className={styles.fieldError}>{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select
                    className="input"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Subject <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={`input ${firstError === 'subject' ? styles.inputError : ''}`}
                    name="subject"
                    placeholder="Brief description of your issue"
                    value={form.subject}
                    onChange={handleChange}
                    />
                  {firstError === 'subject' && (
                    <span className={styles.fieldError}>{errors.subject}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Message <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={`input ${firstError === 'message' ? styles.inputError : ''}`}
                    name="message"
                    placeholder="Describe your issue in detail…"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    style={{ resize: 'vertical', minHeight: 120 }}
                    />
                  {firstError === 'message' && (
                    <span className={styles.fieldError}>{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={status === 'loading'}
                  style={{ justifyContent: 'center', marginTop: 4 }}
                  >
                  {status === 'loading'
                    ? <><span className="spinner" /> Sending…</>
                    : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
            </>
  );
}
