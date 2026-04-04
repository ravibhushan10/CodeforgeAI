import styles from './WeaknessRadar.module.css';

export default function WeaknessRadar({ data = [] }) {
  if (!data.length) return null;

  const SIZE    = 260;
  const CENTER  = SIZE / 2;
  const RADIUS  = 95;
  const LEVELS  = 4;
  const N       = data.length;

  const polar = (angle, r) => ({
    x: CENTER + r * Math.cos(angle - Math.PI / 2),
    y: CENTER + r * Math.sin(angle - Math.PI / 2),
  });

  const angles = data.map((_, i) => (2 * Math.PI * i) / N);

  const gridPolygons = Array.from({ length: LEVELS }, (_, lvl) => {
    const r = (RADIUS * (lvl + 1)) / LEVELS;
    return angles.map(a => polar(a, r)).map(p => `${p.x},${p.y}`).join(' ');
  });

  const dataPoints = data.map((d, i) => {
    const r = (d.accuracy / 100) * RADIUS;
    return polar(angles[i], Math.max(r, 4));
  });
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg}>

        {gridPolygons.map((pts, i) => (
          <polygon key={i} points={pts}
            fill="none"
            stroke="var(--border)"
            strokeWidth={i === LEVELS - 1 ? 1.5 : 0.8}
          />
        ))}


        {angles.map((a, i) => {
          const end = polar(a, RADIUS);
          return <line key={i} x1={CENTER} y1={CENTER} x2={end.x} y2={end.y} stroke="var(--border)" strokeWidth="0.8" />;
        })}


        <polygon
          points={dataPolygon}
          fill="rgba(0,208,132,0.15)"
          stroke="var(--green)"
          strokeWidth="2"
          strokeLinejoin="round"
        />


        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4"
            fill="var(--green)" stroke="var(--bg-card)" strokeWidth="2"
          />
        ))}


        {data.map((d, i) => {
          const labelR = RADIUS + 20;
          const pos    = polar(angles[i], labelR);
          const anchor = pos.x < CENTER - 5 ? 'end' : pos.x > CENTER + 5 ? 'start' : 'middle';
          const isWeak = d.accuracy < 50;
          return (
            <g key={i}>
              <text
                x={pos.x} y={pos.y + 4}
                textAnchor={anchor}
                fontSize="9"
                fill={isWeak ? 'var(--red)' : 'var(--text-secondary)'}
                fontFamily="var(--font-sans)"
                fontWeight={isWeak ? '600' : '400'}
              >
                {d.tag.length > 10 ? d.tag.slice(0, 9) + '…' : d.tag}
              </text>
              <text
                x={pos.x} y={pos.y + 14}
                textAnchor={anchor}
                fontSize="8"
                fill={isWeak ? 'var(--red)' : 'var(--green)'}
                fontFamily="var(--font-mono)"
              >
                {d.accuracy}%
              </text>
            </g>
          );
        })}


        <text x={CENTER} y={CENTER + 4} textAnchor="middle" fontSize="10"
          fill="var(--text-muted)" fontFamily="var(--font-sans)">
          Skill
        </text>
      </svg>


      <div className={styles.legend}>
        {data.map(d => (
          <div key={d.tag} className={styles.legendItem}>
            <div className={styles.legendDot} style={{
              background: d.accuracy >= 70 ? 'var(--green)' : d.accuracy >= 40 ? 'var(--orange)' : 'var(--red)'
            }} />
            <span className={styles.legendTag}>{d.tag}</span>
            <span className={styles.legendPct} style={{
              color: d.accuracy >= 70 ? 'var(--green)' : d.accuracy >= 40 ? 'var(--orange)' : 'var(--red)'
            }}>{d.accuracy}%</span>
            {d.accuracy < 50 && <span className={styles.weakLabel}>Weak</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
