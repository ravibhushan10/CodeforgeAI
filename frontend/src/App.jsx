import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useApp } from './context/AppContext.jsx';
import Navbar       from './components/Navbar.jsx';
import Footer       from './components/Footer.jsx';
import Home         from './pages/Home.jsx';
import Problems     from './pages/Problems.jsx';
import Solve        from './pages/Solve.jsx';
import Profile      from './pages/Profile.jsx';
import Leaderboard  from './pages/Leaderboard.jsx';
import Dashboard    from './pages/Dashboard.jsx';
import VerifyEmail  from './pages/VerifyEmail.jsx';
import Help         from './pages/Help.jsx';
import styles       from './App.module.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useApp();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function RouteProgressBar() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [width, setWidth]   = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setActive(true);
    setWidth(0);
    clearTimeout(timerRef.current);
    requestAnimationFrame(() => { requestAnimationFrame(() => setWidth(72)); });
    timerRef.current = setTimeout(() => {
      setWidth(100);
      setTimeout(() => { setActive(false); setWidth(0); }, 280);
    }, 240);
    return () => clearTimeout(timerRef.current);
  }, [location.pathname]);

  if (!active && width === 0) return null;
  return (
    <div className={styles.progressBar} style={{ width: `${width}%`, opacity: width === 100 ? 0 : 1 }} />
  );
}

function PageWrapper({ children }) {
  const location = useLocation();
  const [key, setKey]       = useState(location.pathname);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => { setKey(location.pathname); setVisible(true); }, 80);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div key={key} className={visible ? styles.pageVisible : styles.pageHidden}>
      {children}
    </div>
  );
}

function App() {
  const { loading } = useApp();
  const location    = useLocation();
  const noLayout    = location.pathname.startsWith('/problems/');

  if (location.pathname === '/verify-email') return <VerifyEmail />;
  if (loading) return <AppLoader />;

  return (
    <div className={styles.app}>
      <RouteProgressBar />
      {!noLayout && <Navbar />}
      <main className={noLayout ? styles.mainFull : styles.main}>
        <PageWrapper>
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/verify-email"   element={<VerifyEmail />} />
            <Route path="/help"           element={<Help />} />
            <Route path="/problems"       element={<ProtectedRoute><Problems /></ProtectedRoute>} />
            <Route path="/problems/:slug" element={<ProtectedRoute><Solve /></ProtectedRoute>} />
            <Route path="/leaderboard"    element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </main>
      {!noLayout && <Footer />}
    </div>
  );
}

function AppLoader() {
  const [dots, setDots]   = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.appLoader}>
      <div className={styles.loaderGrid} />
      <div className={styles.loaderOrb1} />
      <div className={styles.loaderOrb2} />
      <div className={styles.loaderContent}>
        <div className={`${styles.loaderLogo} ${phase >= 0 ? styles.loaderLogoVisible : ''}`}>
          <div className={styles.loaderLogoIcon}>⟨/⟩</div>
          <span className={styles.loaderBrand}>
            Code<span style={{ color: 'var(--green)' }}>Forge</span>
          </span>
        </div>
        <div className={`${styles.loaderSpinnerWrap} ${phase >= 1 ? styles.loaderSpinnerVisible : ''}`}>
          <div className={styles.loaderSpinner}>
            <div className={styles.loaderRingOuter} />
            <div className={styles.loaderRingInner} />
            <div className={styles.loaderRingDot} />
          </div>
        </div>
        <div className={`${styles.loaderStatus} ${phase >= 2 ? styles.loaderStatusVisible : ''}`}>
          Loading{'.'.repeat(dots)}
        </div>
        <div className={`${styles.loaderBar} ${phase >= 2 ? styles.loaderBarVisible : ''}`}>
          <div className={styles.loaderBarFill} />
        </div>
      </div>
    </div>
  );
}

export default App;
