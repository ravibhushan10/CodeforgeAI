import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // WHY this range logic: GFG-style pagers don't show all 50 pages —
  // they show first, last, a window around current, and "…" for gaps.
  const getPageNumbers = () => {
    const delta = 2; // how many pages to show on each side of current
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let prev;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) rangeWithDots.push(prev + 1);
        else if (i - prev > 2) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }
    return rangeWithDots;
  };

  return (
    <div className={styles.pager}>
      <button
        className={styles.navBtn}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹ Prev
      </button>

      {getPageNumbers().map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className={styles.dots}>…</span>
        ) : (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={styles.navBtn}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next ›
      </button>
    </div>
  );
}