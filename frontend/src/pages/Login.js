import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('google')) {
        setError('This account uses Google Sign-In. Please click "Continue with Google" below.');
      } else {
        setError('Invalid email or password');
      }
    } finally { setLoading(false); }
  };

  const googleLogin = () => {
    window.location.href = 'https://fundwise-mutual-fund-advisor-system-8w4f.onrender.com/oauth2/authorization/google';
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <div style={styles.header}>
          <span style={styles.icon}>◈</span>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.sub}>Sign in to your MF Advisor account</p>
        </div>

        {/* Google Login */}
        <button onClick={googleLogin} style={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </button>

        <div style={styles.divider}><span>or sign in with email</span></div>

        <form onSubmit={submit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <Link to="/signup" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 24,
    background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)',
  },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '40px 36px', width: '100%', maxWidth: 420 },
  header: { textAlign: 'center', marginBottom: 28 },
  icon: { fontSize: 36, color: 'var(--accent)', display: 'block', marginBottom: 16 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 },
  sub: { color: 'var(--text2)', fontSize: 14 },
  googleBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '11px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    background: '#fff', border: '1px solid #e0e0e0', color: '#333',
    transition: 'box-shadow 0.2s', marginBottom: 20,
  },
  divider: {
    textAlign: 'center', position: 'relative', marginBottom: 20,
    '&::before': { content: '""', position: 'absolute' },
    color: 'var(--text3)', fontSize: 12,
    display: 'flex', alignItems: 'center', gap: 12,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 },
  error: { background: 'var(--red-dim)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--red)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 14 },
  footer: { textAlign: 'center', marginTop: 24, color: 'var(--text2)', fontSize: 14 },
  link: { color: 'var(--accent2)', fontWeight: 600 },
};
