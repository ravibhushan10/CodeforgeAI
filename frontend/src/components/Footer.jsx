import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.logo}>CodeForge</span>
          <span className={styles.tagline}>Master coding interviews with AI by your side</span>
        </div>

        <div className={styles.links}>
          <Link to="/help">Help & Support</Link>
        </div>

        <div className={styles.right}>
          © {new Date().getFullYear()} CodeForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
