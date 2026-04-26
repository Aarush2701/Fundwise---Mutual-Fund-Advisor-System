import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Account', 'Profile', 'Preferences'];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', monthlyIncome: '',
    investmentHorizon: '', investmentGoal: 'WEALTH', marketExperience: '3',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const next = (e) => { e.preventDefault(); setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // Backend calculates riskScore & investorType from these fields
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        age: parseInt(form.age),
        monthlyIncome: parseFloat(form.monthlyIncome),
        investmentHorizon: parseInt(form.investmentHorizon),
        investmentGoal: form.investmentGoal,
        marketExperience: parseInt(form.marketExperience),
      };
      const res = await authAPI.signup(payload);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setStep(0);
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <div style={styles.header}>
          <span style={styles.icon}>◈</span>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Join MF Advisor for personalized fund recommendations</p>
        </div>

        {/* Stepper */}
        <div style={styles.stepper}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={styles.stepItem}>
                <div style={{ ...styles.stepDot, ...(i <= step ? styles.stepDotActive : {}) }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ ...styles.stepLabel, ...(i === step ? styles.stepLabelActive : {}) }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ ...styles.stepLine, ...(i < step ? styles.stepLineActive : {}) }} />}
            </React.Fragment>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Step 0: Account */}
        {step === 0 && (
          <form onSubmit={next} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>Next →</button>
          </form>
        )}

        {/* Step 1: Profile */}
        {step === 1 && (
          <form onSubmit={next} style={styles.form}>
            <div style={styles.infoBox}>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                🧠 Your risk profile is <strong style={{ color: 'var(--accent2)' }}>automatically calculated</strong> by
                our system based on your age, income, and investment preferences — just like real platforms do.
              </p>
            </div>
            <div className="grid-2">
              <div style={styles.field}>
                <label style={styles.label}>Age</label>
                <input name="age" type="number" value={form.age} onChange={handle} placeholder="e.g. 22" required min={18} max={80} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Monthly Income (₹)</label>
                <input name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={handle} placeholder="e.g. 50000" required min={0} />
              </div>
            </div>
            <div style={styles.btnRow}>
              <button type="button" className="btn btn-ghost" onClick={back}>← Back</button>
              <button type="submit" className="btn btn-primary">Next →</button>
            </div>
          </form>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <form onSubmit={submit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Investment Horizon (years)</label>
              <input name="investmentHorizon" type="number" value={form.investmentHorizon} onChange={handle} placeholder="e.g. 5" required min={1} max={30} />
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>How many years do you plan to stay invested?</p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Investment Goal</label>
              <select name="investmentGoal" value={form.investmentGoal} onChange={handle}>
                <option value="WEALTH">Wealth Creation</option>
                <option value="RETIREMENT">Retirement Planning</option>
                <option value="SAVINGS">Savings</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Market Experience</label>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>1 = Beginner &nbsp;·&nbsp; 5 = Expert</p>
              <div style={styles.sliderRow}>
                {[1,2,3,4,5].map(v => (
                  <button
                    type="button" key={v}
                    onClick={() => setForm(p => ({ ...p, marketExperience: String(v) }))}
                    style={{ ...styles.expBtn, ...(form.marketExperience === String(v) ? styles.expBtnActive : {}) }}
                  >{v}</button>
                ))}
              </div>
            </div>
            <div style={styles.btnRow}>
              <button type="button" className="btn btn-ghost" onClick={back}>← Back</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160 }}>
                {loading ? 'Creating Account...' : 'Create Account ✓'}
              </button>
            </div>
          </form>
        )}

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '40px 36px', width: '100%', maxWidth: 480,
  },
  header: { textAlign: 'center', marginBottom: 28 },
  icon: { fontSize: 36, color: 'var(--accent)', display: 'block', marginBottom: 16 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 },
  sub: { color: 'var(--text2)', fontSize: 14 },
  stepper: { display: 'flex', alignItems: 'center', marginBottom: 28 },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  stepDot: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--bg3)', border: '2px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: 'var(--text3)', transition: 'all 0.2s',
  },
  stepDotActive: { background: 'var(--accent)', border: '2px solid var(--accent)', color: '#fff' },
  stepLabel: { fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  stepLabelActive: { color: 'var(--accent2)' },
  stepLine: { flex: 1, height: 2, background: 'var(--border)', margin: '0 8px', marginBottom: 20 },
  stepLineActive: { background: 'var(--accent)' },
  infoBox: {
    background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.25)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 },
  btnRow: { display: 'flex', gap: 12, justifyContent: 'space-between' },
  sliderRow: { display: 'flex', gap: 10 },
  expBtn: {
    flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.15s',
  },
  expBtnActive: { background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff' },
  error: { background: 'var(--red-dim)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--red)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 14, marginBottom: 8 },
  footer: { textAlign: 'center', marginTop: 24, color: 'var(--text2)', fontSize: 14 },
  link: { color: 'var(--accent2)', fontWeight: 600 },
};
