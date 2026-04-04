import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomePro.module.css';

const BENEFITS = [
  { icon: '🔓', title: 'All 150+ Problems',        desc: 'Every premium problem is now unlocked.' },
  { icon: '🤖', title: 'Unlimited AI Tutor',         desc: 'No daily limit. Ask anything, anytime.' },
  { icon: '📊', title: 'Weakness Radar Chart',       desc: 'See exactly which topics to improve.' },
  { icon: '🎯', title: 'Interview Readiness Score',  desc: 'Know how prepared you are per company.' },
  { icon: '💡', title: 'Smart Recommendations',      desc: 'ML picks the perfect next problem for you.' },
  { icon: '🎤', title: 'Mock Interview Mode',        desc: 'Timed sessions that simulate real interviews.' },
  { icon: '🔍', title: 'AI Code Review',             desc: 'Get feedback on your accepted solutions.' },
];

export default function WelcomePro({ onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cf_pro_welcomed', '1');
  }, []);

  const goToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Pro!</h1>
          <p className={styles.sub}>You've unlocked the full CodeForge experience.</p>
        </div>


        <div className={styles.grid}>
          {BENEFITS.map(b => (
            <div key={b.title} className={styles.benefit}>
              <div>
                <div className={styles.benefitTitle}>{b.title}</div>
                <div className={styles.benefitDesc}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>


        <div className={styles.actions}>
          <button className="btn btn-primary btn-lg" onClick={goToDashboard} style={{ justifyContent: 'center' }}>
             Go to My Dashboard
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            I'll explore later
          </button>
        </div>
      </div>
    </div>
  );
}
