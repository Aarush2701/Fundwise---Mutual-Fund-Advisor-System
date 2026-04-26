import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    userAPI.getProfile().then(res => {
      setProfile(res.data);
      setForm({
        name: res.data.name || '',
        age: res.data.age || '',
        monthlyIncome: res.data.monthlyIncome || '',
        investmentHorizon: 5,
        marketExperience: 3,
        investmentGoal: 'WEALTH',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      // Backend recalculates riskScore & investorType from these fields
      const res = await userAPI.updateProfile({
        name: form.name,
        age: parseInt(form.age),
        monthlyIncome: parseFloat(form.monthlyIncome),
        investmentHorizon: parseInt(form.investmentHorizon),
        marketExperience: parseInt(form.marketExperience),
        investmentGoal: form.investmentGoal,
      });
      setProfile(res.data);
      setEditMode(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {} finally { setSaving(false); }
  };

  const deleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      logout();
      navigate('/');
    } catch {}
  };

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // investorType: CONSERVATIVE | MODERATE | AGGRESSIVE
  const investorColor = (t) => {
    if (!t) return 'var(--text2)';
    const v = t.toUpperCase();
    if (v === 'CONSERVATIVE') return 'var(--green)';
    if (v === 'AGGRESSIVE') return 'var(--red)';
    return 'var(--yellow)';
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {success && <div style={styles.successBox} className="fade-in">✓ Profile updated. Risk score has been recalculated.</div>}

        {/* Header card */}
        <div style={styles.headerCard} className="fade-in">
          <div style={styles.avatarLg}>{profile?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ flex: 1 }}>
            <h1 style={styles.name}>{profile?.name}</h1>
            <p style={styles.email}>{profile?.email}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="tag">Age {profile?.age}</span>
              <span className="tag">₹{profile?.monthlyIncome?.toLocaleString('en-IN')}/mo</span>
              {profile?.investorType && (
                <span style={{ ...styles.investorBadge, color: investorColor(profile.investorType), borderColor: investorColor(profile.investorType) }}>
                  {profile.investorType}
                </span>
              )}
            </div>
          </div>
          <div>
            {editMode ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setEditMode(false)} className="btn btn-ghost">Cancel</button>
                <button onClick={save} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            ) : (
              <button onClick={() => setEditMode(true)} className="btn btn-ghost">Edit Profile</button>
            )}
          </div>
        </div>

        <div className="grid-2">
          {/* Personal Info */}
          <div className="card fade-in">
            <h2 style={styles.sectionTitle}>Personal Information</h2>
            {editMode ? (
              <div style={styles.editForm}>
                <div style={styles.field}><label style={styles.label}>Full Name</label><input name="name" value={form.name} onChange={handle} /></div>
                <div style={styles.field}><label style={styles.label}>Age</label><input name="age" type="number" value={form.age} onChange={handle} min={18} max={80} /></div>
                <div style={styles.field}><label style={styles.label}>Monthly Income (₹)</label><input name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={handle} /></div>
              </div>
            ) : (
              <div style={styles.infoList}>
                {[
                  { label: 'Name', value: profile?.name },
                  { label: 'Email', value: profile?.email },
                  { label: 'Age', value: `${profile?.age} years` },
                  { label: 'Monthly Income', value: `₹${profile?.monthlyIncome?.toLocaleString('en-IN')}` },
                ].map(item => (
                  <div key={item.label} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{item.label}</span>
                    <span style={styles.infoValue}>{item.value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk Profile */}
          <div className="card fade-in">
            <h2 style={styles.sectionTitle}>Risk Profile</h2>
            {editMode ? (
              <div style={styles.editForm}>
                <div style={styles.field}>
                  <label style={styles.label}>Investment Horizon (years)</label>
                  <input name="investmentHorizon" type="number" value={form.investmentHorizon} onChange={handle} min={1} max={30} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Investment Goal</label>
                  <select name="investmentGoal" value={form.investmentGoal} onChange={handle}>
                    <option value="WEALTH">Wealth Creation</option>
                    <option value="RETIREMENT">Retirement</option>
                    <option value="SAVINGS">Savings</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Market Experience (1–5)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1,2,3,4,5].map(v => (
                      <button key={v} type="button"
                        onClick={() => setForm(p => ({ ...p, marketExperience: v }))}
                        style={{
                          flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                          background: form.marketExperience === v ? 'var(--accent)' : 'var(--bg3)',
                          border: `1px solid ${form.marketExperience === v ? 'var(--accent)' : 'var(--border)'}`,
                          color: form.marketExperience === v ? '#fff' : 'var(--text2)',
                        }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 12, color: 'var(--text2)' }}>
                  Saving will recalculate your risk score and investor type automatically.
                </div>
              </div>
            ) : (
              <div style={styles.infoList}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Risk Score</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: investorColor(profile?.investorType) }}>
                    {profile?.riskScore}<span style={{ fontSize: 14, color: 'var(--text3)' }}>/100</span>
                  </span>
                </div>
                <div style={{ margin: '8px 0 12px' }}>
                  <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${profile?.riskScore}%`, background: investorColor(profile?.investorType), transition: 'width 0.5s' }} />
                  </div>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Investor Type</span>
                  <span style={{ fontWeight: 700, color: investorColor(profile?.investorType) }}>{profile?.investorType || '—'}</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text3)' }}>
                  Calculated automatically from your age, income, investment horizon, and market experience.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card fade-in" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
          <h2 style={{ ...styles.sectionTitle, color: 'var(--red)' }}>Danger Zone</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 16 }}>Deleting your account is permanent and cannot be undone.</p>
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <p style={{ color: 'var(--text2)', fontSize: 14 }}>Are you absolutely sure?</p>
              <button onClick={deleteAccount} className="btn btn-danger">Yes, Delete My Account</button>
              <button onClick={() => setConfirmDelete(false)} className="btn btn-ghost">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="btn btn-ghost"
              style={{ borderColor: 'rgba(244,63,94,0.4)', color: 'var(--red)' }}>
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 24px', minHeight: 'calc(100vh - 64px)' },
  inner: { maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 },
  successBox: { background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--green)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 14 },
  headerCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  avatarLg: { width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, flexShrink: 0 },
  name: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 2 },
  email: { color: 'var(--text3)', fontSize: 14 },
  investorBadge: { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid', background: 'transparent' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid var(--border)' },
  editForm: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoList: { display: 'flex', flexDirection: 'column', gap: 14 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { color: 'var(--text3)', fontSize: 14 },
  infoValue: { color: 'var(--text)', fontWeight: 600, fontSize: 14 },
};
