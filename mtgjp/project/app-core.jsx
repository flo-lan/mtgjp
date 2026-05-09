// MTG-JP — main app. Single-file React tree to keep state colocated.
//
// Screens:
//   - SearchScreen   home / search input / recent / featured cards
//   - CardDetail     hero, identity block, rules text, glossary chips
//   - KeywordSheet   bottom sheet with full glossary entry
//
// Original UI — does not reproduce the trademarked card frame design.

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────────
// Defaults persisted via __edit_mode_set_keys
// ─────────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "highlightStyle": "box",
  "showFurigana": true,
  "screen": "detail",
  "cardId": "lightning-bolt"
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────────────────────────────────
// Icons (inline SVG; uniform 22×22)
// ─────────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, color = 'currentColor' }) => {
  const s = size, c = color;
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'back':    return <svg {...props}><path d="M15 18l-6-6 6-6"/></svg>;
    case 'search':  return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'heart':   return <svg {...props}><path d="M12 21s-7-4.5-9.5-9C.8 8.5 3 4 7 4c2.2 0 3.7 1.4 5 3 1.3-1.6 2.8-3 5-3 4 0 6.2 4.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case 'heartf':  return <svg {...props} fill={c} stroke="none"><path d="M12 21s-7-4.5-9.5-9C.8 8.5 3 4 7 4c2.2 0 3.7 1.4 5 3 1.3-1.6 2.8-3 5-3 4 0 6.2 4.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case 'audio':   return <svg {...props}><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M18.5 5.5a9 9 0 010 13"/></svg>;
    case 'more':    return <svg {...props}><circle cx="5" cy="12" r="1.4" fill={c}/><circle cx="12" cy="12" r="1.4" fill={c}/><circle cx="19" cy="12" r="1.4" fill={c}/></svg>;
    case 'spark':   return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/></svg>;
    case 'book':    return <svg {...props}><path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4z"/><path d="M20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>;
    case 'cards':   return <svg {...props}><rect x="3" y="6" width="13" height="15" rx="2"/><path d="M7 3h12a2 2 0 012 2v13"/></svg>;
    case 'user':    return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case 'home':    return <svg {...props}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'check':   return <svg {...props}><path d="M5 12l4.5 4.5L19 7"/></svg>;
    case 'close':   return <svg {...props}><path d="M6 6l12 12M18 6l-6.1 6L6 18"/></svg>;
    case 'globe':   return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18"/></svg>;
    case 'wand':    return <svg {...props}><path d="M15 4l5 5-11 11H4v-5z"/><path d="M14 5l5 5"/></svg>;
    case 'mic':     return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>;
    case 'arrow':   return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'eye':     return <svg {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eyeoff':  return <svg {...props}><path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2"/><path d="M9.5 5.2A11 11 0 0112 5c6.5 0 10 7 10 7a14.7 14.7 0 01-3 3.7M6 6.4A14.7 14.7 0 002 12s3.5 7 10 7a11 11 0 003-.4"/></svg>;
    default: return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Card art placeholder — atmospheric gradient, NO trademarked frame.
// ─────────────────────────────────────────────────────────────────────────
function ArtPlate({ hue = 18, height = 200, label = 'art' }) {
  return (
    <div className="art-plate" style={{
      width: '100%', height,
      background: `
        radial-gradient(140% 80% at 30% 20%, oklch(0.42 0.13 ${hue} / 0.95), transparent 55%),
        radial-gradient(120% 100% at 80% 100%, oklch(0.20 0.08 ${hue} / 0.95), transparent 55%),
        linear-gradient(180deg, oklch(0.32 0.10 ${hue}), oklch(0.14 0.06 ${hue}))
      `,
    }}>
      <div style={{
        position: 'absolute', left: 14, bottom: 12, zIndex: 2,
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 10, letterSpacing: 0.4,
        color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Furigana ruby (compact)
// ─────────────────────────────────────────────────────────────────────────
function Ruby({ base, kana, on = true }) {
  if (!on || !kana) return <span>{base}</span>;
  return <ruby>{base}<rt>{kana}</rt></ruby>;
}

// ─────────────────────────────────────────────────────────────────────────
// Keyword pill — interactive, multi-style
// ─────────────────────────────────────────────────────────────────────────
function KeywordPill({ kw, onTap, style = 'box', showFurigana = true, active = false }) {
  const g = window.GLOSSARY[kw];
  const c = window.CAT_COLORS[g.cat];
  const klass = `kw-pill ${style}`;
  const sx = style === 'flat'
    ? { color: c.fg, background: 'transparent' }
    : style === 'underline'
      ? { color: c.fg, borderColor: c.fg }
      : { color: c.fg, background: c.bg, borderColor: c.border };

  return (
    <span className={klass} style={sx} onClick={() => onTap?.(kw)}>
      <span style={{ position: 'relative' }}>
        {g.jp}
        {active && (
          <span style={{
            position: 'absolute', left: -4, right: -4, bottom: -3, height: 2,
            background: c.fg, borderRadius: 2,
          }}/>
        )}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Rules text renderer
// ─────────────────────────────────────────────────────────────────────────
function RulesText({ card, hlStyle, onKw, activeKw, big = false }) {
  return (
    <div className="jp" style={{
      fontSize: big ? 23 : 21, lineHeight: 2.0, color: 'var(--text)',
      letterSpacing: 0.2, textAlign: 'left',
    }}>
      {card.rules.map((tok, i) => {
        if (tok.kw) {
          return <KeywordPill key={i} kw={tok.kw} onTap={onKw} style={hlStyle} active={activeKw === tok.kw}/>;
        }
        return <span key={i}>{tok.jp}</span>;
      })}
    </div>
  );
}

Object.assign(window, { Icon, ArtPlate, Ruby, KeywordPill, RulesText, TWEAK_DEFAULTS });
