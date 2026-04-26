import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fundsAPI } from '../services/api';

const RANGES = ['1Y', '3Y', '5Y'];

export default function FundDetails() {
  const { schemeCode } = useParams();
  const [details, setDetails] = useState(null);
  const [returns, setReturns] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [risk, setRisk] = useState(null);
  const [sharpe, setSharpe] = useState(null);
  const [range, setRange] = useState('1Y');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcForm, setCalcForm] = useState({ type: 'SIP', amount: '', years: '' });
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fundsAPI.getDetails(schemeCode),
      fundsAPI.getReturns(schemeCode),
    ]).then(([d, r]) => {
      setDetails(d.data);
      setReturns(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [schemeCode]);

  useEffect(() => {
    setChartLoading(true);
    Promise.all([
      fundsAPI.getNavChart(schemeCode, range),
      fundsAPI.getRisk(schemeCode, range),
      fundsAPI.getSharpe(schemeCode, range),
    ]).then(([c, ri, sh]) => {
      setChartData(c.data.map(p => ({ date: p.date, nav: parseFloat(p.nav) })));
      setRisk(ri.data);
      setSharpe(sh.data);
    }).catch(() => {}).finally(() => setChartLoading(false));
  }, [schemeCode, range]);

  const calculate = async () => {
    try {
      const res = await fundsAPI.calculate({ schemeCode, type: calcForm.type, amount: parseFloat(calcForm.amount), years: parseInt(calcForm.years) });
      setCalcResult(res.data);
    } catch {}
  };

  const riskBadge = (r) => {
    if (!r) return 'badge-moderate';
    const v = r.toUpperCase();
    if (v === 'LOW') return 'badge-low';
    if (v === 'HIGH') return 'badge-high';
    return 'badge-moderate';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--accent2)', fontWeight: 700 }}>₹{payload[0].value?.toFixed(4)}</p>
      </div>
    );
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div className="spinner" /></div>;
  if (!details) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text2)' }}>Fund not found.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Header */}
        <div className="fade-in">
          <Link to="/search" style={{ color: 'var(--text3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>← Back to Search</Link>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <span className="tag">{details.category}</span>
                <span className="tag">{details.schemeType}</span>
                <span className={`badge ${riskBadge(details.riskLevel)}`}>{details.riskLevel}</span>
              </div>
              <h1 style={styles.fundTitle}>{details.fundName}</h1>
              <p style={{ color: 'var(--text3)', fontSize: 14 }}>{details.amcName} · #{schemeCode}</p>
            </div>
            <div style={styles.navBox}>
              <p style={styles.navLabel}>Latest NAV</p>
              <p style={styles.navValue}>₹{details.latestNav?.toFixed(4)}</p>
              <p style={styles.navDate}>{details.latestNavDate}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid-4 fade-in">
          {[
            { label: '1Y CAGR', value: details.cagr1y ? `${details.cagr1y.toFixed(2)}%` : '—', positive: details.cagr1y > 0 },
            { label: '3Y CAGR', value: details.cagr3y ? `${details.cagr3y.toFixed(2)}%` : '—', positive: details.cagr3y > 0 },
            { label: '5Y CAGR', value: details.cagr5y ? `${details.cagr5y.toFixed(2)}%` : '—', positive: details.cagr5y > 0 },
            { label: 'Fund Score', value: details.fundScore || '—', badge: true },
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{m.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: m.positive === false ? 'var(--red)' : m.positive ? 'var(--green)' : 'var(--text)' }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* NAV Chart */}
        <div className="card fade-in">
          <div style={styles.chartHeader}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>NAV History</h2>
            <div style={styles.rangeButtons}>
              {RANGES.map(r => (
                <button key={r} onClick={() => setRange(r)} className="btn" style={{ ...styles.rangeBtn, ...(range === r ? styles.rangeBtnActive : {}) }}>{r}</button>
              ))}
            </div>
          </div>
          {chartLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v.toFixed(0)}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="nav" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>No chart data available.</p>
          )}
        </div>

        {/* Risk & Sharpe */}
        <div className="grid-2 fade-in">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Risk Analysis ({range})</h3>
            {risk ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text2)', fontSize: 14 }}>Volatility</span>
                  <span style={{ fontWeight: 700 }}>{risk.volatility?.toFixed(2)}%</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <span className={`badge ${riskBadge(risk.riskLevel)}`}>{risk.riskLevel} RISK</span>
                </div>
              </>
            ) : <p style={{ color: 'var(--text3)' }}>Not available</p>}
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Sharpe Ratio ({range})</h3>
            {sharpe ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text2)', fontSize: 14 }}>Sharpe Ratio</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 22 }}>{sharpe.sharpeRatio?.toFixed(3)}</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <span className="badge badge-blue">{sharpe.performance}</span>
                </div>
              </>
            ) : <p style={{ color: 'var(--text3)' }}>Not available</p>}
          </div>
        </div>

        {/* Explanation */}
        {details.explanation && (
          <div className="card fade-in" style={{ borderLeft: '3px solid var(--accent)', background: 'var(--bg2)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 10 }}>Fund Analysis</h3>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8 }}>{details.explanation}</p>
          </div>
        )}

        {/* Investment Calculator */}
        <div className="card fade-in">
          <div style={styles.calcHeader} onClick={() => setCalcOpen(o => !o)}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>📊 Investment Calculator</h3>
            <span style={{ color: 'var(--text3)', fontSize: 20 }}>{calcOpen ? '−' : '+'}</span>
          </div>
          {calcOpen && (
            <div style={{ marginTop: 20 }}>
              <div style={styles.calcForm}>
                <div>
                  <label style={styles.label}>Type</label>
                  <select value={calcForm.type} onChange={e => setCalcForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="SIP">SIP (Monthly)</option>
                    <option value="LUMPSUM">Lumpsum</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Amount (₹)</label>
                  <input type="number" value={calcForm.amount} onChange={e => setCalcForm(p => ({ ...p, amount: e.target.value }))} placeholder={calcForm.type === 'SIP' ? 'Monthly amount' : 'Total amount'} />
                </div>
                <div>
                  <label style={styles.label}>Duration (years)</label>
                  <input type="number" value={calcForm.years} onChange={e => setCalcForm(p => ({ ...p, years: e.target.value }))} placeholder="e.g. 5" min={1} max={30} />
                </div>
                <button className="btn btn-primary" onClick={calculate} style={{ alignSelf: 'flex-end', padding: '10px 24px' }}>Calculate</button>
              </div>
              {calcResult && (
                <div style={styles.calcResult}>
                  {[
                    { label: 'Invested Amount', value: `₹${calcResult.investedAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                    { label: 'Expected Value', value: `₹${calcResult.expectedValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, highlight: true },
                    { label: 'Total Gains', value: `₹${calcResult.totalGains?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, positive: true },
                  ].map(r => (
                    <div key={r.label} style={styles.calcRow}>
                      <span style={{ color: 'var(--text2)' }}>{r.label}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: r.highlight ? 'var(--accent2)' : r.positive ? 'var(--green)' : 'var(--text)' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 24px', minHeight: 'calc(100vh - 64px)' },
  inner: { maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' },
  headerLeft: { flex: 1 },
  fundTitle: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, lineHeight: 1.3, color: 'var(--text)', marginBottom: 6 },
  navBox: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', textAlign: 'right', flexShrink: 0 },
  navLabel: { fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 },
  navValue: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent2)' },
  navDate: { fontSize: 12, color: 'var(--text3)', marginTop: 4 },
  chartHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  rangeButtons: { display: 'flex', gap: 6 },
  rangeBtn: { padding: '5px 14px', fontSize: 13, fontWeight: 600, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text2)', background: 'transparent' },
  rangeBtnActive: { background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff' },
  calcHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  calcForm: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  calcResult: { marginTop: 20, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 },
  calcRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};
