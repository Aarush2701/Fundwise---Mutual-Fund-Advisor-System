import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fundsAPI } from '../services/api';

// Backend risk levels for generic recommendations endpoint
const RISK_LEVELS = ['LOW', 'MODERATE', 'HIGH'];
const RANGES = ['1Y', '3Y', '5Y'];

export default function Recommendations() {
  const [risk, setRisk] = useState('MODERATE');
  const [range, setRange] = useState('3Y');
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchRecs = async () => {
    setLoading(true); setFetched(true);
    try {
      const res = await fundsAPI.getRecommendations(risk, range);
      setFunds(res.data);
    } catch { setFunds([]); }
    finally { setLoading(false); }
  };

  const riskColor = (r) => {
    if (!r) return 'var(--text2)';
    const v = r.toUpperCase();
    if (v === 'LOW') return 'var(--green)';
    if (v === 'HIGH') return 'var(--red)';
    return 'var(--yellow)';
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div className="fade-in">
          <h1 style={styles.title}>Fund Recommendations</h1>
          <p style={styles.sub}>Filter by risk appetite and time horizon to discover the best funds</p>
        </div>

        <div className="card fade-in" style={{ padding: '24px 28px' }}>
          <div style={styles.filterGrid}>
            <div>
              <p style={styles.filterLabel}>Risk Appetite</p>
              <div style={styles.btnGroup}>
                {RISK_LEVELS.map(r => (
                  <button key={r} onClick={() => setRisk(r)} className="btn" style={{
                    ...styles.filterBtn,
                    ...(risk === r ? {
                      background: r === 'LOW' ? 'var(--green-dim)' : r === 'HIGH' ? 'var(--red-dim)' : 'rgba(245,158,11,0.12)',
                      borderColor: r === 'LOW' ? 'var(--green)' : r === 'HIGH' ? 'var(--red)' : 'var(--yellow)',
                      color: r === 'LOW' ? 'var(--green)' : r === 'HIGH' ? 'var(--red)' : 'var(--yellow)',
                    } : {})
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={styles.filterLabel}>Time Range</p>
              <div style={styles.btnGroup}>
                {RANGES.map(r => (
                  <button key={r} onClick={() => setRange(r)} className="btn" style={{
                    ...styles.filterBtn,
                    ...(range === r ? { background: 'var(--accent-glow)', borderColor: 'var(--accent)', color: 'var(--accent2)' } : {})
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={fetchRecs} disabled={loading}
              style={{ alignSelf: 'flex-end', padding: '10px 28px' }}>
              {loading ? 'Loading...' : 'Get Recommendations →'}
            </button>
          </div>
        </div>

        {loading && <div style={styles.center}><div className="spinner" /></div>}

        {!loading && fetched && funds.length === 0 && (
          <div style={styles.empty} className="fade-in">
            <span style={{ fontSize: 48 }}>◎</span>
            <p style={{ color: 'var(--text2)', marginTop: 12 }}>
              No funds found for <strong>{risk}</strong> risk with <strong>{range}</strong> data.
            </p>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 6 }}>
              Analytics scheduler may still be computing — try a different combination.
            </p>
          </div>
        )}

        {!loading && funds.length > 0 && (
          <div className="fade-in">
            <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 16 }}>
              {funds.length} fund{funds.length !== 1 ? 's' : ''} for&nbsp;
              <strong style={{ color: 'var(--text)' }}>{risk}</strong> risk over&nbsp;
              <strong style={{ color: 'var(--text)' }}>{range}</strong>
            </p>
            <div style={styles.grid}>
              {funds.map((fund, i) => (
                <Link key={fund.schemeCode} to={`/funds/${fund.schemeCode}`} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.rank}>#{i + 1}</div>
                    {fund.fundScore && <span className="badge badge-blue">Score {fund.fundScore}</span>}
                  </div>
                  <p style={styles.fundName}>{fund.fundName}</p>
                  <p style={styles.fundAmc}>{fund.amcName}</p>
                  <span className="tag" style={{ marginBottom: 16, display: 'inline-block' }}>{fund.category}</span>
                  <div style={styles.metrics}>
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
                      <p style={{ ...styles.metricVal, color: riskColor(fund.riskLevel) }}>{fund.riskLevel || '—'}</p>
                      <p style={styles.metricLabel}>Risk</p>
                    </div>
                    <div>
                      <p style={styles.metricVal}>{fund.volatility ? `${fund.volatility.toFixed(1)}%` : '—'}</p>
                      <p style={styles.metricLabel}>Volatility</p>
                    </div>
                  </div>
                  {fund.explanation && (
                    <p style={styles.explanation}>
                      {fund.explanation.slice(0, 110)}{fund.explanation.length > 110 ? '…' : ''}
                    </p>
                  )}
                  <div style={styles.viewMore}>View Details →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 24px', minHeight: 'calc(100vh - 64px)' },
  inner: { maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 8 },
  sub: { color: 'var(--text2)', fontSize: 16 },
  filterGrid: { display: 'flex', gap: 28, alignItems: 'flex-end', flexWrap: 'wrap' },
  filterLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  btnGroup: { display: 'flex', gap: 8 },
  filterBtn: { padding: '8px 18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text2)', background: 'transparent', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' },
  center: { display: 'flex', justifyContent: 'center', padding: 60 },
  empty: { textAlign: 'center', padding: 60, color: 'var(--text3)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  card: {
    display: 'flex', flexDirection: 'column',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px 22px',
    transition: 'border-color 0.2s',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rank: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text3)' },
  fundName: { fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 },
  fundAmc: { fontSize: 13, color: 'var(--text3)', marginBottom: 10 },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 },
  metricVal: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' },
  metricLabel: { fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 },
  explanation: { fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14, flex: 1 },
  viewMore: { fontSize: 13, color: 'var(--accent2)', fontWeight: 600, marginTop: 'auto' },
};
