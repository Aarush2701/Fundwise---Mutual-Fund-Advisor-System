import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fundsAPI } from '../services/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fundsAPI.search(query);
      setResults(res.data);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.heroSection} className="fade-in">
          <h1 style={styles.title}>Search Mutual Funds</h1>
          <p style={styles.sub}>Search by fund name, AMC, or category</p>
          <form onSubmit={search} style={styles.searchForm}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>⬡</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. HDFC Midcap, SBI Bluechip, Mirae..."
                style={styles.searchInput}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div style={styles.center}><div className="spinner" /></div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={styles.empty} className="fade-in">
            <span style={{fontSize: 48}}>⬡</span>
            <p style={{color: 'var(--text2)', marginTop: 12}}>No funds found for "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="fade-in">
            <p style={styles.resultCount}>{results.length} fund{results.length !== 1 ? 's' : ''} found</p>
            <div style={styles.resultsList}>
              {results.map(fund => (
                <Link key={fund.schemeCode} to={`/funds/${fund.schemeCode}`} style={styles.resultCard}>
                  <div style={styles.resultLeft}>
                    <p style={styles.fundName}>{fund.fundName}</p>
                    <p style={styles.fundAmc}>{fund.amcName}</p>
                  </div>
                  <div style={styles.resultRight}>
                    <span className="tag">{fund.category}</span>
                    <span style={styles.code}>#{fund.schemeCode}</span>
                    <span style={{color: 'var(--text3)'}}>→</span>
                  </div>
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
  inner: { maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 },
  heroSection: { textAlign: 'center' },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 10 },
  sub: { color: 'var(--text2)', fontSize: 16, marginBottom: 28 },
  searchForm: { maxWidth: 640, margin: '0 auto' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '8px 12px 8px 16px',
  },
  searchIcon: { color: 'var(--accent)', fontSize: 18, flexShrink: 0 },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--text)', fontSize: 15, padding: '4px 0',
  },
  center: { display: 'flex', justifyContent: 'center', padding: 60 },
  empty: { textAlign: 'center', padding: 60, color: 'var(--text3)' },
  resultCount: { color: 'var(--text3)', fontSize: 13, marginBottom: 12 },
  resultsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  resultCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '16px 20px',
    transition: 'border-color 0.2s, background 0.2s',
  },
  resultLeft: { flex: 1, minWidth: 200 },
  fundName: { fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 },
  fundAmc: { fontSize: 13, color: 'var(--text3)' },
  resultRight: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  code: { fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' },
};
