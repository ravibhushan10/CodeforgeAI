import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import UserAvatar from '../components/UserAvatar.jsx';
import AuthModals from './AuthModals.jsx';
import PaymentModal from './PaymentModal.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const {
    user, logout, toast,
    showLogin,    setShowLogin,
    showRegister, setShowRegister,
    showPayment,  setShowPayment,
  } = useApp();

  const location  = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    if (!dropOpen) return;

    const handleOutside = (e) => {

      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };

    const handleScroll = () => setDropOpen(false);

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dropOpen]);

  const nav = [
    { to: '/problems',    label: 'Problems'    },
    { to: '/dashboard',   label: 'Dashboard'   },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  const isActive        = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isHomepage      = location.pathname === '/';
  const isProfile       = location.pathname === '/profile';
  const showNavLinks    = user || !isHomepage;
  const logoIsClickable = !(isHomepage && !user) && !isProfile;

  const handleLogout = () => {
    logout();
    toast('Signed out successfully', 'info');
    navigate('/');
    setDropOpen(false);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.inner}>


          {logoIsClickable ? (
            <Link to="/profile" className={styles.logo}>
              <span className={styles.logoText}>Code<span className={styles.logoAccent}>Forge</span></span>
            </Link>
          ) : (
            <span className={styles.logo}>
              <span className={styles.logoText}>Code<span className={styles.logoAccent}>Forge</span></span>
            </span>
          )}


          <div className={styles.links}>
            {showNavLinks && nav.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`${styles.link} ${isActive(n.to) ? styles.active : ''}`}
              >
                {n.label}
                {isActive(n.to) && <span className={styles.activeDot} />}
              </Link>
            ))}
          </div>


          <div className={styles.right}>
            {user ? (
              <>
                {user.plan !== 'pro' && (
                  <button className={`btn btn-sm ${styles.proBtn}`} onClick={() => setShowPayment(true)}>
                    Pro
                  </button>
                )}
                {user.plan === 'pro' && (
                  <span className={`badge badge-pro ${styles.proBadge}`}>PRO</span>
                )}


                <div className={styles.avatarWrap} ref={dropRef}>
                  <button
                    className={`${styles.avatar} ${dropOpen ? styles.avatarOpen : ''}`}
                    onClick={() => setDropOpen(p => !p)}
                  >
                    <UserAvatar avatarUrl={user.avatarUrl} name={user.name} size={34} />
                  </button>

                  {dropOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropHeader}>
                        <UserAvatar avatarUrl={user.avatarUrl} name={user.name} size={36} />
                        <div className={styles.dropInfo}>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                      <div className={styles.dropDivider} />
                      <button onClick={() => { navigate('/profile');   setDropOpen(false); }}>
                        Profile
                      </button>
                      <button onClick={() => { navigate('/dashboard'); setDropOpen(false); }}>
                        Dashboard
                      </button>
                      {user.plan !== 'pro' && (
                        <button onClick={() => { setShowPayment(true); setDropOpen(false); }}>
                           Upgrade to Pro
                        </button>
                      )}
                      <button onClick={() => { navigate('/help'); setDropOpen(false); }}>
                        Help & Support
                      </button>
                      <div className={styles.dropDivider} />
                      <button onClick={handleLogout} className={styles.logoutBtn}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowLogin(true)}>
                  Sign In
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setShowRegister(true)}>
                  Get Started
                </button>
              </>
            )}


            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>


        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
          {showNavLinks && nav.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`${styles.mobileLink} ${isActive(n.to) ? styles.mobileLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/help"
            className={`${styles.mobileLink} ${isActive('/help') ? styles.mobileLinkActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Help & Support
          </Link>
          {!user && (
            <div className={styles.mobileCtas}>
              <button
                className="btn btn-ghost w-full"
                onClick={() => { setShowLogin(true); setMenuOpen(false); }}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary w-full"
                onClick={() => { setShowRegister(true); setMenuOpen(false); }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModals
        showLogin={showLogin}       onCloseLogin={() => setShowLogin(false)}
        showRegister={showRegister} onCloseRegister={() => setShowRegister(false)}
        onSwitchToRegister={() => { setShowLogin(false);    setShowRegister(true); }}
        onSwitchToLogin={()    => { setShowRegister(false); setShowLogin(true);    }}
      />
      <PaymentModal show={showPayment} onClose={() => setShowPayment(false)} />
    </>
  );
}
