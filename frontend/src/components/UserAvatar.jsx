export default function UserAvatar({ avatarUrl, name, size = 98, fontSize }) {
  const initials = name
    ? name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
    : '?';

  const computedFontSize = fontSize || Math.max(10, Math.round(size * 0.36));

  const base = {
    width: size, height: size, borderRadius: '50%',
    flexShrink: 0, display: 'block',
  };

  const fallback = (
    <div style={{
      ...base, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1f14, #018252)',
      fontSize: computedFontSize, fontWeight: 800, color: '#fff',
      letterSpacing: size > 50 ? '3px' : '1px',
      userSelect: 'none', fontFamily: 'var(--font-sans)',
    }}>
      {initials}
    </div>
  );

  if (!avatarUrl || avatarUrl.trim() === '') return fallback;

  return (
    <img
      src={avatarUrl}
      alt={name || 'User'}
      style={{ ...base, objectFit: 'cover' }}
      onError={e => {

        e.target.style.display = 'none';
        e.target.insertAdjacentHTML('afterend',
          `<div style="width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0d1f14,#018252);font-size:${computedFontSize}px;font-weight:800;color:#fff;letter-spacing:${size > 50 ? '3px' : '1px'};user-select:none;flex-shrink:0">${initials}</div>`
        );
      }}
    />
  );
}
