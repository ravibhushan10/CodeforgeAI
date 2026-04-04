export default function Sidebar({ activeTab, onNav, admin, onLogout, isOpen }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-logo">CodeForge Admin</div>
      <nav className="sidebar-nav">
        {[
          { key: 'problems',  label: 'Problems' },
          { key: 'users',     label: 'Users' },
          { key: 'stats',     label: 'Stats' },
        ].map(({ key,  label }) => (
          <button
            key={key}
            className={`nav-btn${activeTab === key ? ' active' : ''}`}
            onClick={() => onNav(key)}
          >
             {label}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="admin-name">{admin?.name}</div>
        <button className="btn btn-ghost btn-sm w-full" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
