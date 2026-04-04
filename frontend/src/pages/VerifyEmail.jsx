import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './VerifyEmail.module.css';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status,        setStatus]        = useState('verifying');
  const [email,         setEmail]         = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone,    setResendDone]    = useState(false);
  const [resendError,   setResendError]   = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }

    axios.get(`/api/users/verify-email?token=${token}`)
      .then(({ data }) => {
        if (data.code === 'ALREADY_VERIFIED') { setStatus('already'); return; }
        setStatus('success');
      })
      .catch(err => {
        const code = err.response?.data?.code;
        const em   = err.response?.data?.email || '';
        if (code === 'TOKEN_EXPIRED') { setStatus('expired'); setEmail(em); }
        else setStatus('error');
      });
  }, []);

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true); setResendError('');
    try {
      await axios.post('/api/users/resend-verification', { email });
      setResendDone(true);
    } catch (err) {
      setResendError(err.response?.data?.error || 'Failed to resend. Please try again.');
    } finally { setResendLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.logo}>CodeForge</div>


      {status === 'verifying' && (
        <div className={styles.card}>
          <div className={styles.spinner} />
          <h2>Verifying…</h2>
          <p>Please wait a moment.</p>
        </div>
      )}


      {status === 'success' && (
        <div className={styles.card}>
          <div className={styles.iconSuccess}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>Email verified!</h2>
          <p className={styles.sub}>Thank you. You can now close this tab.</p>
        </div>
      )}


      {status === 'already' && (
        <div className={styles.card}>
          <div className={styles.iconSuccess}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>Already verified</h2>
          <p className={styles.sub}>Your email is already verified. You can close this tab.</p>
        </div>
      )}


      {status === 'expired' && (
        <div className={styles.card}>
          <h2>Link expired</h2>
          <p style={{ marginBottom: 20, color: '#888', fontSize: '.9rem' }}>
            This link has expired.
            {email && <> Send a new one to <strong style={{ color: '#ccc' }}>{email}</strong>?</>}
          </p>
          {!resendDone ? (
            <>
              {resendError && <div className={styles.errorBanner}>{resendError}</div>}
              <button className={styles.btn} onClick={handleResend} disabled={resendLoading || !email}>
                {resendLoading ? 'Sending…' : 'Send new verification link'}
              </button>
            </>
          ) : (
            <div className={styles.successBanner}>✓ New link sent to <strong>{email}</strong>. Check your inbox.</div>
          )}
          <button className={styles.closeBtn} onClick={() => window.close()}>Close this tab</button>
        </div>
      )}


      {status === 'error' && (
        <div className={styles.card}>
          <div className={styles.iconError}>✕</div>
          <h2>Verification failed</h2>
          <p className={styles.sub}>This link is invalid or has already been used.</p>
          <p className={styles.tryAgain}>Please go back and try again.</p>
          <button className={styles.closeBtn} onClick={() => window.close()}>Close this tab</button>
        </div>
      )}
    </div>
  );
}
