import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '◎', title: 'Smart Recommendations', desc: 'AI-powered fund recommendations tailored to your risk profile and investment goals.' },
  { icon: '⬡', title: 'Deep Fund Analytics', desc: 'Sharpe ratio, volatility, CAGR — all the metrics that matter, at a glance.' },
  { icon: '⬦', title: 'Fund Comparison', desc: 'Compare multiple funds side-by-side to make the best choice for your portfolio.' },
  { icon: '◈', title: 'Investment Calculator', desc: 'Simulate SIP and lumpsum investments to project future wealth.' },
  { icon: '○', title: 'NAV Charts', desc: 'Interactive price history charts across 1Y, 3Y and 5Y time ranges.' },
  { icon: '◇', title: 'Risk Profiling', desc: 'Smart risk assessment that builds your personal investor profile.' },
];

export default function Landing() {
  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <div style={styles.pill}>◈ Intelligent Fund Advisor</div>
          <h1 style={styles.h1}>
            Invest with<br />
            <span style={styles.h1Accent}>Intelligence</span>
          </h1>
          <p style={styles.heroSub}>
            Stop guessing. Get personalized mutual fund recommendations based on your risk profile,
            investment horizon, and financial goals.
          </p>
          <div style={styles.heroCta}>
            <Link to="/signup" className="btn btn-primary" style={{padding: '14px 32px', fontSize: 16}}>
              Start Investing Smart →
            </Link>
            <Link to="/recommendations" className="btn btn-ghost" style={{padding: '14px 24px', fontSize: 16}}>
              Explore Funds
            </Link>
          </div>
          <div style={styles.stats}>
            {[['10,000+', 'Mutual Funds'], ['3 Risk', 'Profiles'], ['Real-time', 'NAV Data']].map(([val, label]) => (
              <div key={label} style={styles.stat}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionTag}>FEATURES</p>
          <h2 style={styles.sectionTitle}>Everything you need to invest wisely</h2>
          <div className="grid-3" style={{marginTop: 40}}>
            {features.map(f => (
              <div key={f.title} style={styles.featureCard} className="fade-in">
                <span style={styles.featureIcon}>{f.icon}</span>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={{fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 16}}>
            Ready to build your wealth?
          </h2>
          <p style={{color: 'var(--text2)', fontSize: 18, marginBottom: 32}}>
            Create a free account and get instant personalized recommendations.
          </p>
          <Link to="/signup" className="btn btn-primary" style={{padding: '14px 36px', fontSize: 16}}>
            Create Free Account
          </Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={{color: 'var(--text3)', fontSize: 13}}>© 2024 MF Advisor. Built for college major project.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh' },
  hero: {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '80px 24px',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: 700,
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--accent-glow)',
    border: '1px solid rgba(59,130,246,0.3)',
    color: 'var(--accent2)',
    borderRadius: 100,
    padding: '6px 18px',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.05em',
    marginBottom: 28,
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(48px, 8vw, 80px)',
    fontWeight: 800,
    lineHeight: 1.05,
    color: 'var(--text)',
    marginBottom: 24,
    letterSpacing: '-0.02em',
  },
  h1Accent: { color: 'var(--accent)' },
  heroSub: { fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' },
  heroCta: { display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 56, flexWrap: 'wrap' },
  stats: { display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text)' },
  statLabel: { fontSize: 13, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  section: { padding: '100px 24px', background: 'var(--bg2)' },
  sectionInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  sectionTag: { color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)' },
  featureCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px 28px',
    textAlign: 'left',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  featureIcon: { fontSize: 28, color: 'var(--accent)', display: 'block', marginBottom: 16 },
  featureTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 8 },
  featureDesc: { color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 },
  ctaSection: {
    padding: '100px 24px',
    background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, var(--bg) 60%)',
    textAlign: 'center',
  },
  ctaInner: { maxWidth: 600, margin: '0 auto' },
  footer: { padding: '32px 24px', textAlign: 'center', borderTop: '1px solid var(--border)' },
};
