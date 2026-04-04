import styles from './ReadinessScore.module.css';

const COMPANY_COLORS = {
  Google:    '#4285F4',
  Amazon:    '#ff9f43',
  Microsoft: '#00d084',
  Facebook:  '#1877F2',
  Apple:     '#aaaaaa',
};

const SCORE_LABEL = (s) => {
  if (s >= 80) return { label: 'Ready', color: 'var(--green)' };
  if (s >= 55) return { label: 'Almost', color: 'var(--orange)' };
  if (s >= 30) return { label: 'In Progress', color: 'var(--blue)' };
  return { label: 'Just Starting', color: 'var(--text-muted)' };
};

export default function ReadinessScore({ data = [] }) {
  if (!data.length) return null;

  const top = [...data].sort((a, b) => b.score - a.score)[0];

  return (
    <div className={styles.wrap}>

      <div className={styles.topCard}>
        <div className={styles.topLabel}>Strongest For</div>
        <div className={styles.topCompany} style={{ color: COMPANY_COLORS[top.company] || 'var(--green)' }}>
          {top.company}
        </div>
        <div className={styles.topScore}>{top.score}<span>%</span></div>
        <div className={styles.topProblems}>{top.problemsSolved} company problems solved</div>
      </div>


      <div className={styles.list}>
        {data.map(d => {
          const { label, color } = SCORE_LABEL(d.score);
          return (
            <div key={d.company} className={styles.row}>
              <div className={styles.rowLeft}>
                <div className={styles.dot} style={{ background: COMPANY_COLORS[d.company] || 'var(--purple)' }} />
                <span className={styles.company}>{d.company}</span>
              </div>
              <div className={styles.rowRight}>
                <span className={styles.statusLabel} style={{ color }}>{label}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${d.score}%`,
                      background: COMPANY_COLORS[d.company] || 'var(--green)',
                    }}
                  />
                </div>
                <span className={styles.pct}>{d.score}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className={styles.hint}>
         Solve more company-tagged problems to boost your score
      </p>
    </div>
  );
}
