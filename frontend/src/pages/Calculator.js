import React, { useState } from 'react';
import { fundsAPI } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Calculator() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [form, setForm] = useState({ type: 'SIP', amount: '', years: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fundsAPI.search(query);
      setSearchResults(res.data.slice(0, 6));
    } catch {} finally { setSearching(false); }
  };

  const selectFund = (fund) => {
    setSelectedFund(fund);
    setSearchResults([]);
    setQuery('');
    setResult(null);
  };

  const calculate = async () => {
    if (!selectedFund || !form.amount || !form.years) return;
    setLoading(true);
    try {
      const res = await fundsAPI.calculate({
        schemeCode: selectedFund.schemeCode,
        type: form.type,
        amount: parseFloat(form.amount),
        years: parseInt(form.years),
      });
      setResult(res.data);
    } catch {} finally { setLoading(false); }
  };

  const chartData = result ? [
    { name: 'Invested', value: parseFloat(result.investedAmount) },
    { name: 'Gains', value: parseFloat(result.totalGains) },
  ] : [];

  const COLORS = ['var(--accent)', 'var(--green)'];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: 'var(--text2)', marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: 'var(--text)', fontWeight: 700 }}>₹{parseFloat(payload[0].value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div className="fade-in">
          <h1 style={styles.title}>Investment Calculator</h1>
          <p style={styles.sub}>Simulate SIP or Lumpsum investments and see projected returns</p>
        </div>

        <div style={styles.layout}>
          {/* Left: Form */}
          <div style={styles.formSection}>
            {/* Fund Picker */}
            <div className="card fade-in">
              <p style={styles.fieldLabel}>Select Fund</p>
              {selectedFund ? (
                <div style={styles.selectedFund}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{selectedFund.fundName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text3)' }}>{selectedFund.amcName}</p>
                  </div>
                  <button onClick={() => setSelectedFund(null)} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>Change</button>
                </div>
              ) : (
                <>
                  <form onSubmit={search} style={{ display: 'flex', gap: 10 }}>
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search fund..." />
                    <button type="submit" className="btn btn-primary" disabled={searching}>{searching ? '...' : 'Find'}</button>
                  </form>
                  {searchResults.length > 0 && (
                    <div style={styles.dropdown}>
                      {searchResults.map(f => (
                        <button key={f.schemeCode} onClick={() => selectFund(f)} style={styles.dropdownItem}>
                          <p style={{ fontWeight: 600, fontSize: 14, textAlign: 'left', color: 'var(--text)' }}>{f.fundName}</p>
                          <p style={{ fontSize: 12, color: 'var(--text3)' }}>{f.amcName}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Investment Type */}
            <div className="card fade-in">
              <p style={styles.fieldLabel}>Investment Type</p>
              <div style={styles.typeToggle}>
                {['SIP', 'LUMPSUM'].map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                    style={{ ...styles.typeBtn, ...(form.type === t ? styles.typeBtnActive : {}) }}>
                    <span style={{ fontSize: 20 }}>{t === 'SIP' ? '📅' : '💰'}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{t}</p>
                      <p style={{ fontSize: 12, color: 'var(--text3)' }}>{t === 'SIP' ? 'Monthly investment' : 'One-time investment'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount & Duration */}
            <div className="card fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={styles.fieldLabel}>{form.type === 'SIP' ? 'Monthly Amount (₹)' : 'Lumpsum Amount (₹)'}</p>
                  <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder={form.type === 'SIP' ? 'e.g. 5000' : 'e.g. 100000'} min={0} />
                </div>
                <div>
                  <p style={styles.fieldLabel}>Investment Duration (Years)</p>
                  <input type="number" value={form.years} onChange={e => setForm(p => ({ ...p, years: e.target.value }))} placeholder="e.g. 5" min={1} max={30} />
                  {/* Quick years */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {[1, 3, 5, 10, 20].map(y => (
                      <button key={y} onClick={() => setForm(p => ({ ...p, years: String(y) }))} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: 13, ...(form.years === String(y) ? { background: 'var(--accent-glow)', borderColor: 'var(--accent)', color: 'var(--accent2)' } : {}) }}>{y}Y</button>
                    ))}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={calculate} disabled={loading || !selectedFund} style={{ padding: '12px', justifyContent: 'center', fontSize: 15 }}>
                  {loading ? 'Calculating...' : 'Calculate Returns →'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div style={styles.resultSection}>
            {result ? (
              <div className="fade-in">
                <div className="card" style={{ marginBottom: 16 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{result.fundName}</h2>
                  <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 24 }}>{result.type} · {form.years} Year{form.years > 1 ? 's' : ''}</p>
                  <div style={styles.resultGrid}>
                    <div style={styles.resultItem}>
                      <p style={styles.resultLabel}>Invested Amount</p>
                      <p style={styles.resultValue}>₹{parseFloat(result.investedAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div style={{ ...styles.resultItem, background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <p style={styles.resultLabel}>Expected Value</p>
                      <p style={{ ...styles.resultValue, color: 'var(--accent2)' }}>₹{parseFloat(result.expectedValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div style={{ ...styles.resultItem, background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.3)', gridColumn: 'span 2' }}>
                      <p style={styles.resultLabel}>Total Gains</p>
                      <p style={{ ...styles.resultValue, color: 'var(--green)', fontSize: 32 }}>₹{parseFloat(result.totalGains).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                </div>

                {/* Pie chart */}
                <div className="card">
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16 }}>Portfolio Breakdown</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend formatter={(value) => <span style={{ color: 'var(--text2)', fontSize: 13 }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, marginTop: 8 }}>
                    Returns multiplied by {result.investedAmount ? (parseFloat(result.expectedValue) / parseFloat(result.investedAmount)).toFixed(2) : '—'}x
                  </p>
                </div>
              </div>
            ) : (
              <div style={styles.emptyResult} className="fade-in">
                <span style={{ fontSize: 64 }}>📊</span>
                <p style={{ color: 'var(--text2)', marginTop: 16, fontSize: 16 }}>Your projection will appear here</p>
                <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 6 }}>Select a fund and enter your investment details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 24px', minHeight: 'calc(100vh - 64px)' },
  inner: { maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 8 },
  sub: { color: 'var(--text2)', fontSize: 16 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' },
  formSection: { display: 'flex', flexDirection: 'column', gap: 16 },
  resultSection: { position: 'sticky', top: 80 },
  fieldLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  selectedFund: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  dropdown: { marginTop: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' },
  dropdownItem: { width: '100%', display: 'block', padding: '12px 16px', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid var(--border)', textAlign: 'left', transition: 'background 0.15s' },
  typeToggle: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  typeBtn: {
    display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.15s',
  },
  typeBtnActive: { background: 'var(--accent-glow)', border: '1px solid var(--accent)' },
  resultGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  resultItem: { padding: '16px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' },
  resultLabel: { fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 },
  resultValue: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text)' },
  emptyResult: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '80px 40px', textAlign: 'center' },
};
