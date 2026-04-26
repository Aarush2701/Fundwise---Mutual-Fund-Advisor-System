import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fundsAPI } from '../services/api';

export default function Compare() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fundsAPI.search(query);
      setSearchResults(res.data.slice(0, 8));
    } catch {} finally { setLoading(false); }
  };

  const addFund = (fund) => {
    // Backend enforces 2-3 funds only
    if (selected.length >= 3) {
      setError('Maximum 3 funds can be compared at once.');
      return;
    }
    if (selected.find(f => f.schemeCode === fund.schemeCode)) return;
    setSelected(p => [...p, fund]);
    setSearchResults([]);
    setQuery('');
    setComparison(null);
    setError('');
  };

  const removeFund = (code) => {
    setSelected(p => p.filter(f => f.schemeCode !== code));
    setComparison(null);
    setError('');
  };

  const compare = async () => {
    if (selected.length < 2) {
      setError('Please add at least 2 funds to compare.');
      return;
    }
    setComparing(true); setError('');
    try {
      const res = await fundsAPI.compareFunds(selected.map(f => f.schemeCode));
      setComparison(res.data.funds);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparison failed. Funds may not have enough data.');
    } finally { setComparing(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div className="fade-in">
          <h1 style={styles.title}>Compare Funds</h1>
          <p style={styles.sub}>Add 2 or 3 funds to compare side-by-side</p>
        </div>

        {error && <div style={styles.errorBox} className="fade-in">{error}</div>}

        <div className="card fade-in">
          <p style={styles.filterLabel}>Add Funds ({selected.length}/3)</p>
          <form onSubmit={search} style={styles.searchBox}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search fund name..."
              style={{ flex: 1 }} disabled={selected.length >= 3} />
            <button type="submit" className="btn btn-primary" disabled={loading || selected.length >= 3}>
              {loading ? '...' : 'Search'}
            </button>
          </form>
          {searchResults.length > 0 && (
            <div style={styles.dropdown}>
              {searchResults.map(f => (
                <button key={f.schemeCode} onClick={() => addFund(f)} style={styles.dropdownItem}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', textAlign: 'left' }}>{f.fundName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text3)' }}>{f.amcName} · {f.category}</p>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>+</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="fade-in">
            <p style={styles.filterLabel}>Selected Funds</p>
            <div style={styles.chips}>
              {selected.map(f => (
                <div key={f.schemeCode} style={styles.chip}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {f.fundName.slice(0, 45)}{f.fundName.length > 45 ? '...' : ''}
                  </span>
                  <button onClick={() => removeFund(f.schemeCode)}
                    style={{ color: 'var(--text3)', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
            {selected.length >= 2 && (
              <button className="btn btn-primary" onClick={compare} disabled={comparing} style={{ marginTop: 16 }}>
                {comparing ? 'Comparing...' : `Compare ${selected.length} Funds →`}
              </button>
            )}
            {selected.length === 1 && (
              <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 10 }}>Add at least one more fund to compare.</p>
            )}
          </div>
        )}

        {comparison && comparison.length > 0 && (
          <div className="fade-in" style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Metric</th>
                  {comparison.map(f => (
                    <th key={f.schemeCode} style={styles.th}>
                      <Link to={`/funds/${f.schemeCode}`} style={{ color: 'var(--accent2)', display: 'block', marginBottom: 4 }}>
                        {f.fundName.slice(0, 35)}{f.fundName.length > 35 ? '...' : ''}
                      </Link>
                      {f.bestInComparison && (
                        <span style={styles.bestBadge}>★ Best 3Y CAGR</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'AMC', key: 'amcName', format: v => v || '—' },
                  { label: 'Category', key: 'category', format: v => v || '—' },
                  { label: 'Latest NAV', key: 'latestNav', format: v => v ? `₹${parseFloat(v).toFixed(4)}` : '—' },
                  { label: '1Y CAGR', key: 'oneYearCagr', format: v => v !== null ? `${parseFloat(v).toFixed(2)}%` : '—', numeric: true },
                  { label: '3Y CAGR', key: 'threeYearCagr', format: v => v !== null ? `${parseFloat(v).toFixed(2)}%` : '—', numeric: true },
                  { label: '5Y CAGR', key: 'fiveYearCagr', format: v => v !== null ? `${parseFloat(v).toFixed(2)}%` : '—', numeric: true },
                  { label: 'Sharpe Ratio', key: 'sharpeRatio', format: v => v ? parseFloat(v).toFixed(3) : '—', numeric: true },
                ].map(row => {
                  // find best in numeric rows
                  const best = row.numeric
                    ? comparison.reduce((b, f) => {
                        if (!f[row.key]) return b;
                        if (!b) return f;
                        return parseFloat(f[row.key]) > parseFloat(b[row.key]) ? f : b;
                      }, null)
                    : null;

                  return (
                    <tr key={row.key} style={styles.tr}>
                      <td style={styles.tdLabel}>{row.label}</td>
                      {comparison.map(f => {
                        const isBest = best && best.schemeCode === f.schemeCode;
                        return (
                          <td key={f.schemeCode} style={{ ...styles.td, ...(isBest ? styles.tdBest : {}) }}>
                            {row.format(f[row.key])}
                            {isBest && <span style={{ color: 'var(--green)', marginLeft: 6 }}>▲</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {comparison && comparison.length === 0 && (
          <div style={styles.empty} className="fade-in">
            <p style={{ color: 'var(--text2)' }}>No comparison data available. Funds may lack sufficient analytics.</p>
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
  filterLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 },
  searchBox: { display: 'flex', gap: 12 },
  dropdown: { marginTop: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' },
  dropdownItem: {
    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px', background: 'transparent', cursor: 'pointer',
    borderBottom: '1px solid var(--border)', transition: 'background 0.15s', gap: 12,
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  chip: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '8px 14px',
  },
  errorBox: { background: 'var(--red-dim)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--red)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 14 },
  empty: { textAlign: 'center', padding: 40, color: 'var(--text3)' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', borderRadius: 'var(--radius)', overflow: 'hidden', fontSize: 14 },
  th: { padding: '14px 18px', textAlign: 'left', background: 'var(--bg3)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text2)', verticalAlign: 'top' },
  tr: { borderBottom: '1px solid var(--border)' },
  tdLabel: { padding: '13px 18px', color: 'var(--text3)', fontWeight: 600, fontSize: 13, background: 'var(--bg2)', whiteSpace: 'nowrap' },
  td: { padding: '13px 18px', color: 'var(--text)', fontWeight: 500 },
  tdBest: { color: 'var(--green)', fontWeight: 700 },
  bestBadge: { display: 'block', background: 'var(--green-dim)', color: 'var(--green)', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
};
