import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #0a0b0f;
    --surface: #111318;
    --surface-2: #181c24;
    --surface-3: #1e2330;
    --border: rgba(255,255,255,0.07);
    --border-active: rgba(99,210,179,0.4);
    --accent: #63d2b3;
    --accent-dim: rgba(99,210,179,0.10);
    --accent-glow: rgba(99,210,179,0.2);
    --gold: #f0c040;
    --gold-dim: rgba(240,192,64,0.12);
    --text: #e8eaf0;
    --text-muted: #6b7280;
    --text-dim: #9ca3af;
    --mono: 'DM Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .results-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 20px 80px;
    font-family: var(--sans);
    color: var(--text);
  }

  .results-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,210,179,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,210,179,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .results-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── Page header ── */
  .page-header {
    animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }

  .page-eyebrow {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
    opacity: 0.85;
  }

  .page-title {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--text);
  }

  .page-title span {
    color: var(--accent);
  }

  /* ── Best model hero card ── */
  .hero-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both;
  }

  .hero-bar {
    height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }

  .hero-body {
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .hero-left {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .trophy-box {
    width: 52px;
    height: 52px;
    background: var(--gold-dim);
    border: 1px solid rgba(240,192,64,0.25);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    flex-shrink: 0;
  }

  .hero-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .hero-tag {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    opacity: 0.8;
  }

  .hero-name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .hero-score-block {
    text-align: right;
  }

  .hero-score-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .hero-score-value {
    font-family: var(--mono);
    font-size: 34px;
    font-weight: 500;
    color: var(--gold);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  /* ── Rankings section ── */
  .section-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── Model rows ── */
  .model-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .model-row {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: border-color 0.2s, background 0.2s;
    opacity: 0;
    animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }

  .model-row:hover {
    border-color: rgba(255,255,255,0.12);
    background: var(--surface-2);
  }

  .model-row.rank-1 {
    border-color: rgba(240,192,64,0.2);
  }

  .rank-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-muted);
    width: 20px;
    flex-shrink: 0;
    text-align: right;
  }

  .model-row.rank-1 .rank-num {
    color: var(--gold);
  }

  .model-name {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Score bar */
  .score-bar-wrap {
    flex: 2;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .score-bar-track {
    flex: 1;
    height: 3px;
    background: var(--surface-3);
    border-radius: 999px;
    overflow: hidden;
  }

  .score-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--accent);
    transform-origin: left;
    transform: scaleX(0);
    animation: barGrow 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  .model-row.rank-1 .score-bar-fill {
    background: var(--gold);
  }

  @keyframes barGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .score-val {
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-dim);
    width: 58px;
    text-align: right;
    flex-shrink: 0;
  }

  .model-row.rank-1 .score-val {
    color: var(--gold);
  }

  /* ── CTA ── */
  .cta-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s both;
  }

  .btn-primary {
    flex: 1;
    min-width: 160px;
    padding: 14px 24px;
    background: var(--accent);
    color: #0a0b0f;
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }

  .btn-primary:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-ghost {
    flex: 1;
    min-width: 160px;
    padding: 14px 24px;
    background: transparent;
    color: var(--text-dim);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: border-color 0.2s, color 0.2s, transform 0.15s;
  }

  .btn-ghost:hover {
    border-color: rgba(255,255,255,0.2);
    color: var(--text);
    transform: translateY(-1px);
  }

  .btn-ghost:active {
    transform: translateY(0);
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Empty state ── */
  .empty-state {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 60px 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .empty-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dim);
    letter-spacing: -0.01em;
  }

  .empty-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-muted);
  }
`;

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || {};
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const best = sorted[0];

  // Stagger delay per row
  const rowDelay = (i) => `${0.15 + i * 0.07}s`;

  // Score relative to best for bar width
  const maxScore = best ? best[1] : 1;
  const relWidth = (score) => Math.max(0, Math.min(1, score / maxScore));

  return (
    <Layout>
      <style>{styles}</style>
      <div className="results-root">
        <div className="results-wrap">

          {/* Header */}
          <div className="page-header">
            <div className="page-eyebrow">AutoML · Evaluation Complete</div>
            <h1 className="page-title">Model <span>Rankings</span></h1>
          </div>

          {sorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="empty-title">No results found</div>
              <div className="empty-sub">Train a model first to see scores here.</div>
            </div>
          ) : (
            <>
              {/* Best model hero */}
              <div className="hero-card">
                <div className="hero-bar" />
                <div className="hero-body">
                  <div className="hero-left">
                    <div className="trophy-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 9H3V4h3M18 9h3V4h-3M6 4h12v7a6 6 0 0 1-12 0V4z"/>
                        <path d="M12 17v4M8 21h8"/>
                      </svg>
                    </div>
                    <div className="hero-meta">
                      <div className="hero-tag">Best Model</div>
                      <div className="hero-name">{best[0]}</div>
                    </div>
                  </div>
                  <div className="hero-score-block">
                    <div className="hero-score-label">Score</div>
                    <div className="hero-score-value">{best[1].toFixed(4)}</div>
                  </div>
                </div>
              </div>

              {/* All models */}
              <div className="section-label">All Models</div>

              <div className="model-list">
                {sorted.map(([model, score], i) => (
                  <div
                    key={model}
                    className={`model-row${i === 0 ? " rank-1" : ""}`}
                    style={{ animationDelay: rowDelay(i) }}
                  >
                    <div className="rank-num">#{i + 1}</div>
                    <div className="model-name">{model}</div>
                    <div className="score-bar-wrap">
                      <div className="score-bar-track">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${relWidth(score) * 100}%`,
                            animationDelay: rowDelay(i),
                          }}
                        />
                      </div>
                      <div className="score-val">{score.toFixed(4)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="cta-row">
                <button className="btn-primary" onClick={() => navigate("/eda")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  Explore EDA
                </button>
                <button className="btn-ghost" onClick={() => navigate("/")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  New Dataset
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}