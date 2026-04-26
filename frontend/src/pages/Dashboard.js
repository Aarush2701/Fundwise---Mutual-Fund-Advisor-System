import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userAPI.getProfile(),
      userAPI.getMyRecommendations(),
    ]).then(([p, r]) => {
      setProfile(p.data);
      setRecs(r.data.slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // investorType: CONSERVATIVE | MODERATE | AGGRESSIVE
  const investorColor = (t) => {
    if (!t) return 'var(--text2)';
    const v = t.toUpperCase();
    if (v === 'CONSERVATIVE') return 'var(--green)';
    if (v === 'AGGRESSIVE') return 'var(--red)';
    return 'var(--yellow)';
  };

  const riskColor = (r) => {
    if (!r) return 'var(--text2)';
    const v = r.toUpperCase();
    if (v === 'LOW') return 'var(--green)';
    if (v === 'HIGH') return 'var(--red)';
    return 'var(--yellow)';
  };

  const quickLinks = [
    { to: '/search', icon: '⬡', label: 'Search Funds', sub: 'Find any fund by name or AMC' },
    { to: '/recommendations', icon: '◎', label: 'Explore Funds', sub: 'Browse by risk category' },
    { to: '/compare', icon: '⬦', label: 'Compare Funds', sub: 'Side-by-side comparison (max 3)' },
    { to: '/calculator', icon: '◈', label: 'Calculator', sub: 'Simulate SIP & lumpsum returns' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Welcome */}
        <div style={styles.welcome} className="fade-in">
          <div>
            <p style={styles.welcomeSub}>Good to see you,</p>
            <h1 style={styles.welcomeTitle}>{profile?.name || user?.name} 👋</h1>
          </div>
          <Link to="/profile" className="btn btn-ghost">Edit Profile</Link>
        </div>

        {/* Profile Stats */}
        {profile && (
          <div style={styles.profileGrid} className="fade-in">
            {[
              { label: 'Risk Score', value: `${profile.riskScore}`, suffix: '/100' },
              { label: 'Investor Type', value: profile.investorType || '—', color: investorColor(profile.investorType) },
              { label: 'Monthly Income', value: `₹${profile.monthlyIncome?.toLocaleString('en-IN')}` },
              { label: 'Age', value: `${profile.age} yrs` },
            ].map(s => (
              <div key={s.label} className="card" style={styles.statCard}>
                <p style={styles.statLabel}>{s.label}</p>
                <p style={{ ...styles.statValue, ...(s.color ? { color: s.color } : {}) }}>
                  {s.value}
                  {s.suffix && <span style={styles.statSuffix}>{s.suffix}</span>}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div style={styles.quickLinks}>
          {quickLinks.map(q => (
            <Link key={q.to} to={q.to} style={styles.quickLink} className="fade-in">
              <span style={styles.quickIcon}>{q.icon}</span>
              <div>
                <p style={styles.quickLabel}>{q.label}</p>
                <p style={styles.quickSub}>{q.sub}</p>
              </div>
              <span style={styles.quickArrow}>→</span>
            </Link>
          ))}
        </div>

        {/* Personalized Recommendations */}
        {recs.length > 0 && (
          <div className="fade-in">
            <div style={styles.sectionHeader}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Your Personalized Picks</h2>
              <Link to="/recommendations" style={{ color: 'var(--accent2)', fontSize: 14, fontWeight: 600 }}>Explore More →</Link>
            </div>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4, marginBottom: 16 }}>
              Based on your <strong style={{ color: investorColor(profile?.investorType) }}>{profile?.investorType}</strong> risk profile
            </p>
            <div className="grid-2">
              {recs.map(fund => (
                <Link key={fund.schemeCode} to={`/funds/${fund.schemeCode}`} style={styles.fundCard}>
                  <div style={styles.fundTop}>
                    <span className="tag">{fund.category}</span>
                    {fund.fundScore && <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green)' }}>Score {fund.fundScore}</span>}
                  </div>
                  <p style={styles.fundName}>{fund.fundName}</p>
                  <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 14 }}>{fund.amcName}</p>
                  <div style={styles.fundMetrics}>
                    <div>
                      <p style={{ ...styles.metricVal, color: fund.cagr > 0 ? 'var(--green)' : 'var(--red)' }}>
                        {fund.cagr ? `${fund.cagr.toFixed(2)}%` : '—'}
                      </p>
                      <p style={styles.metricLabel}>3Y CAGR</p>
                    </div>
                    <div>
                      <p style={styles.metricVal}>{fund.sharpeRatio ? fund.sharpeRatio.toFixed(2) : '—'}</p>
                      <p style={styles.metricLabel}>Sharpe</p>
                    </div>
                    <div>
                      <p style={{ ...styles.metricVal, color: riskColor(fund.riskLevel) }}>{fund.riskLevel}</p>
                      <p style={styles.metricLabel}>Risk</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recs.length === 0 && !loading && (
          <div className="card fade-in" style={{ textAlign: 'center', padding: '40px', background: 'var(--bg2)' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>⬡</p>
            <p style={{ color: 'var(--text2)', marginBottom: 8 }}>Personalized recommendations are being prepared</p>
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>The analytics engine runs nightly to compute fund scores.</p>
            <Link to="/recommendations" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Explore All Funds →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 24px', minHeight: 'calc(100vh - 64px)' },
  inner: { maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 },
  welcome: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  welcomeSub: { color: 'var(--text3)', fontSize: 14, marginBottom: 4 },
  welcomeTitle: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)' },
  profileGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 },
  statCard: { padding: '20px' },
  statLabel: { fontSize: 12, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 },
  statValue: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text)' },
  statSuffix: { fontSize: 14, color: 'var(--text3)', fontWeight: 400 },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 },
  quickLink: {
    display: 'flex', alignItems: 'center', gap: 16,
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px 24px', transition: 'border-color 0.2s',
  },
  quickIcon: { fontSize: 28, color: 'var(--accent)', flexShrink: 0 },
  quickLabel: { fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 2 },
  quickSub: { fontSize: 13, color: 'var(--text3)' },
  quickArrow: { marginLeft: 'auto', color: 'var(--text3)', fontSize: 18, flexShrink: 0 },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  fundCard: {
    display: 'block', background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px 24px', transition: 'border-color 0.2s',
  },
  fundTop: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 },
  fundName: { fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 },
  fundMetrics: { display: 'flex', gap: 24 },
  metricVal: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)' },
  metricLabel: { fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 },
};
