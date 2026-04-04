import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import axios from 'axios';
import styles from './MockInterview.module.css';

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Random'];
const DURATIONS  = [
  { label: '45 min', value: 45  },
  { label: '90 min', value: 90  },
  { label: '2 hrs',  value: 120 },
];

export default function MockInterview() {
  const { toast } = useApp();

  const [phase,    setPhase]    = useState('setup');
  const [company,  setCompany]  = useState('Google');
  const [duration, setDuration] = useState(90);
  const [problems, setProblems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [solved,   setSolved]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const timerRef = useRef(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pct     = problems.length ? (solved.length / problems.length) * 100 : 0;
  const urgent  = timeLeft > 0 && timeLeft < 300;

  const start = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/problems', { params: { limit: 200 } });
      let pool = data.problems || [];

      if (company !== 'Random') {
        const byCompany = pool.filter(p =>
          (p.companies || []).some(c => c.toLowerCase() === company.toLowerCase())
        );
        if (byCompany.length >= 3) pool = byCompany;
      }

      const free = pool.filter(p => !p.premium);
      if (free.length >= 3) pool = free;

      const easy   = pool.filter(p => p.difficulty === 'Easy');
      const medium = pool.filter(p => p.difficulty === 'Medium');
      const hard   = pool.filter(p => p.difficulty === 'Hard');
      const pick   = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const selected = [
        easy.length   ? pick(easy)   : null,
        medium.length ? pick(medium) : null,
        hard.length   ? pick(hard)   : null,
      ].filter(Boolean).slice(0, 3);

      if (!selected.length) {
        toast('No problems found. Try a different company or check your connection.', 'error');
        return;
      }

      setProblems(selected);
      setSolved([]);
      setTimeLeft(duration * 60);
      setPhase('active');
    } catch (e) {
      toast(e.response?.data?.error || 'Could not load problems. Check your connection.', 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('result'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const markSolved = (id) => {
    setSolved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const endEarly = () => {
    clearInterval(timerRef.current);
    setPhase('result');
  };

  const score = solved.reduce((acc, id) => {
    const p = problems.find(x => x._id === id);
    return acc + (p?.difficulty === 'Easy' ? 20 : p?.difficulty === 'Medium' ? 35 : 45);
  }, 0);

  const maxScore = problems.reduce((acc, p) =>
    acc + (p.difficulty === 'Easy' ? 20 : p.difficulty === 'Medium' ? 35 : 45), 0);

  const grade = score >= maxScore * .85 ? { label: 'Excellent',       color: 'var(--green)'  }
              : score >= maxScore * .60 ? { label: 'Good',            color: 'var(--blue)'   }
              : score >= maxScore * .35 ? { label: 'Fair',            color: 'var(--orange)' }
              : { label: 'Keep Practicing', color: 'var(--red)' };

  if (phase === 'setup') {
    return (
      <div className={styles.setup}>
        <h3 className={styles.setupTitle}>Mock Interview</h3>
        <p className={styles.setupSub}>Simulate a real interview. No hints. Timed pressure.</p>

        <div className={styles.setupSection}>
          <div className={styles.setupLabel}>Target Company</div>
          <div className={styles.chips}>
            {COMPANIES.map(c => (
              <button key={c}
                className={`${styles.chip} ${company === c ? styles.chipActive : ''}`}
                onClick={() => setCompany(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.setupSection}>
          <div className={styles.setupLabel}>Duration</div>
          <div className={styles.chips}>
            {DURATIONS.map(d => (
              <button key={d.value}
                className={`${styles.chip} ${duration === d.value ? styles.chipActive : ''}`}
                onClick={() => setDuration(d.value)}>
                {d.label}
              </button>
            ))}
          </div>
        </div>


        <button className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}
          onClick={start} disabled={loading}>
          {loading ? <><span className="spinner" /> Loading problems…</> : 'Start Interview'}
        </button>
      </div>
    );
  }

  if (phase === 'active') {
    return (
      <div className={styles.active}>


        <div className={`${styles.timer} ${urgent ? styles.timerUrgent : ''}`}>
          <div className={styles.timerLabel}>Time Remaining</div>
          <div className={styles.timerValue}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {urgent && <div className={styles.timerWarn}>Hurry up!</div>}
        </div>


        <div className={styles.progress}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>Solved {solved.length} / {problems.length}</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--green)' }} />
          </div>
        </div>


        <div className={styles.problemList}>
          {problems.map((p, i) => {
            const isSolved = solved.includes(p._id);
            return (
              <div key={p._id} className={`${styles.problemRow} ${isSolved ? styles.problemSolved : ''}`}>
                <div className={styles.problemLeft}>
                  <span className={styles.problemNum}>{i + 1}</span>
                  <div>
                    <div className={styles.problemTitle}>{p.title}</div>
                    <span className={`badge badge-${p.difficulty.toLowerCase()}`} style={{ fontSize: '.65rem' }}>{p.difficulty}</span>
                  </div>
                </div>
                <div className={styles.problemRight}>
                  <Link to={`/problems/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm">
                    Open
                  </Link>
                  <button
                    className={`btn btn-sm ${isSolved ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => markSolved(p._id)}>
                    {isSolved ? '✓ Solved' : 'Mark Solved'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={endEarly}>
          End Interview Early
        </button>
      </div>
    );
  }

  return (
    <div className={styles.result}>
      <div className={styles.resultGrade} style={{ color: grade.color }}>
        {grade.label}
      </div>
      <div className={styles.resultScore}>
        {score}<span>/{maxScore}</span>
      </div>
      <div className={styles.resultSub}>
        {solved.length} of {problems.length} problems solved
      </div>

      <div className={styles.resultProblems}>
        {problems.map(p => {
          const ok = solved.includes(p._id);
          return (
            <div key={p._id} className={styles.resultRow}>
              <span className={ok ? styles.tick : styles.cross}>{ok ? '✓' : '✕'}</span>
              <span className={styles.resultTitle}>{p.title}</span>
              <span className={`badge badge-${p.difficulty.toLowerCase()}`} style={{ fontSize: '.62rem' }}>{p.difficulty}</span>
              <span className={styles.resultPts}>
                +{ok ? (p.difficulty === 'Easy' ? 20 : p.difficulty === 'Medium' ? 35 : 45) : 0}pts
              </span>
            </div>
          );
        })}
      </div>

      <button className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}
        onClick={() => setPhase('setup')}>
        Try Again
      </button>
    </div>
  );
}
