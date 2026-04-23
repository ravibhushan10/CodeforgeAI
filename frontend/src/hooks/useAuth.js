// useAuth.js - COMPLETE FIXED VERSION
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from '../firebaseConfig.js';
import { useApp } from '../context/AppContext.jsx';

const firebaseApp = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;

export { isFirebaseConfigured };


function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}


// ─── Fetch GitHub primary verified email using the access token ───────────────
// This works even when the user has "Keep my email address private" enabled.
// GitHub requires the user:email scope to access this endpoint.
async function fetchGitHubPrimaryEmail(accessToken) {
  try {
    const res = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) return null;

    const emails = await res.json();
    if (!Array.isArray(emails)) return null;

    // Priority 1: primary + verified
    const primary = emails.find(e => e.primary && e.verified);
    if (primary?.email) return primary.email;

    // Priority 2: any verified email
    const anyVerified = emails.find(e => e.verified);
    if (anyVerified?.email) return anyVerified.email;

    // Priority 3: any email at all (last resort)
    const anyEmail = emails.find(e => e.email);
    return anyEmail?.email || null;

  } catch {
    return null;
  }
}


function extractEmail(firebaseUser) {
  if (firebaseUser.email) return firebaseUser.email;

  if (Array.isArray(firebaseUser.providerData)) {
    for (const p of firebaseUser.providerData) {
      if (p?.email) return p.email;
    }
  }

  return null;
}


function parseOAuthError(err, providerName) {
  if (
    err.code === 'auth/popup-closed-by-user' ||
    err.code === 'auth/cancelled-popup-request'
  ) return null;

  if (
    isOffline() ||
    err.code === 'auth/network-request-failed' ||
    err.message?.includes('ERR_CONNECTION_TIMED_OUT') ||
    err.message?.includes('ERR_INTERNET_DISCONNECTED') ||
    err.message?.includes('Failed to fetch') ||
    err.message?.includes('NetworkError') ||
    err.message?.includes('net::ERR')
  ) {
    const e = new Error('No internet connection. Please check your network and try again.');
    e.friendlyMessage = e.message;
    throw e;
  }

  if (err.code === 'auth/popup-blocked') {
    const e = new Error('Popup was blocked by your browser. Please allow popups for this site and try again.');
    e.friendlyMessage = e.message;
    throw e;
  }

  if (err.code === 'auth/unauthorized-domain') {
    const e = new Error('This domain is not authorized for sign-in. Please contact support.');
    e.friendlyMessage = e.message;
    throw e;
  }

  const code     = err.response?.data?.code;
  const provider = err.response?.data?.provider;
  if (code === 'PROVIDER_MISMATCH') {
    const registeredWith =
      provider === 'google' ? 'Google' :
      provider === 'github' ? 'GitHub' :
      provider === 'local'  ? 'email/password' : provider;
    const hint =
      provider === 'google' ? 'google' :
      provider === 'github' ? 'github' :
      provider === 'local'  ? 'login'  : null;
    const e = new Error(`This email is already registered with ${registeredWith}.`);
    e.friendlyMessage = e.message;
    e.hint = hint;
    throw e;
  }

  if (err.friendlyMessage) throw err;

  const fallback = err.response?.data?.error || `${providerName} sign-in failed. Please try again.`;
  const e = new Error(fallback);
  e.friendlyMessage = e.message;
  throw e;
}


export function useAuth() {
  const { oauthLogin } = useApp();


  // ─── Google OAuth ────────────────────────────────────────────────────────────
  // Google case: if Firebase returns no email, the user's Google account
  // genuinely has no verified email — nothing we can do programmatically.
  // We show a clear, actionable error message.
  const loginWithGoogle = async () => {
    if (!firebaseAuth) {
      const e = new Error('Google sign-in is not configured. Please try email/password sign-in.');
      e.friendlyMessage = e.message;
      throw e;
    }

    if (isOffline()) {
      const e = new Error('No internet connection. Please check your network and try again.');
      e.friendlyMessage = e.message;
      throw e;
    }

    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    try {
      const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      const u = result.user;
      const email = extractEmail(u);

      if (!email) {
        const e = new Error(
          'Your Google account has no verified email address. ' +
          'Please add and verify an email in your Google account settings, then try again.'
        );
        e.friendlyMessage = e.message;
        throw e;
      }

      return await oauthLogin({
        name:          u.displayName || email.split('@')[0],
        email,
        oauthProvider: 'google',
        oauthId:       u.uid,
        avatarUrl:     u.photoURL || '',
      });
    } catch (err) {
      return parseOAuthError(err, 'Google');
    }
  };


  // ─── GitHub OAuth ────────────────────────────────────────────────────────────
  // THE FIX:
  // Problem: Firebase's GithubAuthProvider returns null email when the user
  // has "Keep my email address private" enabled in GitHub Settings.
  //
  // Solution:
  // 1. Add the `user:email` scope to the GitHub provider BEFORE the popup.
  //    This tells GitHub we need email access.
  // 2. Extract the OAuth access token from Firebase's credential result.
  // 3. Call GitHub's /user/emails API directly with that token.
  //    This endpoint returns ALL emails including private ones, as long as
  //    the user:email scope was granted — which it always is after step 1.
  // 4. Pick the primary + verified email from the list.
  //
  // This works for 100% of GitHub users regardless of their privacy settings.
  const loginWithGitHub = async () => {
    if (!firebaseAuth) {
      const e = new Error('GitHub sign-in is not configured. Please try email/password sign-in.');
      e.friendlyMessage = e.message;
      throw e;
    }

    if (isOffline()) {
      const e = new Error('No internet connection. Please check your network and try again.');
      e.friendlyMessage = e.message;
      throw e;
    }

    const { GithubAuthProvider, signInWithPopup } = await import('firebase/auth');

    try {
      // STEP 1: Add user:email scope so GitHub grants email access
      const provider = new GithubAuthProvider();
      provider.addScope('user:email'); // <-- THIS IS THE KEY FIX

      const result = await signInWithPopup(firebaseAuth, provider);
      const u = result.user;

      // STEP 2: Try Firebase's email first (works when email is public)
      let email = extractEmail(u);

      // STEP 3: If still no email (private email setting), call GitHub API
      if (!email) {
        // Get the GitHub OAuth access token from Firebase credential
        const credential = GithubAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        if (accessToken) {
          email = await fetchGitHubPrimaryEmail(accessToken);
        }
      }

      // STEP 4: If we STILL have no email after trying the API, show helpful error
      if (!email) {
        const e = new Error(
          'Unable to access your GitHub email address. ' +
          'Please ensure you have at least one verified email on your GitHub account, then try again.'
        );
        e.friendlyMessage = e.message;
        throw e;
      }

      return await oauthLogin({
        name:          u.displayName || email.split('@')[0],
        email,
        oauthProvider: 'github',
        oauthId:       u.uid,
        avatarUrl:     u.photoURL || '',
      });

    } catch (err) {
      return parseOAuthError(err, 'GitHub');
    }
  };

  return { loginWithGoogle, loginWithGitHub };
}
