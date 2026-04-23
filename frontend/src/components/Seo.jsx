import { Helmet } from 'react-helmet-async';

const BASE_URL  = 'https://codeforgeai.in';
const OG_IMAGE  = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'CodeForge';

/**
 * Usage:
 * <Seo
 *   title="Problems"
 *   description="Browse 160+ DSA problems..."
 *   path="/problems"
 * />
 */
export default function Seo({ title, description, path = '/', noindex = false }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Master Coding Interviews with AI`;
  const url       = `${BASE_URL}${path}`;
  const desc      = description || 'AI-powered competitive coding platform with real code execution, smart recommendations, contests and leaderboard.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description"        content={desc} />
      <link rel="canonical"           href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url"         content={url} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:site_name"   content={SITE_NAME} />

      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={OG_IMAGE} />
    </Helmet>
  );
}
