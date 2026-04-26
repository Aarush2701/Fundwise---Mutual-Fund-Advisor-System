import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Search Funds' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/compare', label: 'Compare' },
  { to: '/calculator', label: 'Calculator' },
];

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to={isLoggedIn ? '/dashboard' : '/'} style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>MF<span style={styles.logoAccent}>Advisor</span></span>
        </Link>

        {isLoggedIn && (
          <div style={styles.links}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  ...styles.link,
                  ...(location.pathname === l.to ? styles.linkActive : {})
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        <div style={styles.right}>
          {isLoggedIn ? (
            <>
              <Link to="/profile" style={styles.userBtn}>
                <span style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                <span style={{color: 'var(--text2)', fontSize: 14}}>{user?.name}</span>
              </Link>
              <button className="btn btn-ghost" onClick={handleLogout} style={{padding: '8px 16px'}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'rgba(5,8,15,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  logoIcon: { color: 'var(--accent)', fontSize: 22 },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text)' },
  logoAccent: { color: 'var(--accent)' },
  links: { display: 'flex', gap: 4, flex: 1 },
  link: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text2)',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  linkActive: {
    color: 'var(--accent2)',
    background: 'var(--accent-glow)',
  },
  right: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' },
  userBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 'var(--radius-sm)', transition: 'background 0.15s' },
  avatar: {
    width: 30, height: 30,
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13,
    flexShrink: 0,
  },
};
