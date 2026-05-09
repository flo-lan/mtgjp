// MTG-JP — screens (search + card detail) and keyword bottom sheet.

const { useState: _us, useEffect: _ue, useRef: _ur, useMemo: _um } = React;

// ─────────────────────────────────────────────────────────────────────────
// Bottom-sheet for keyword glossary entry
// ─────────────────────────────────────────────────────────────────────────
function KeywordSheet({ kw, onClose }) {
  if (!kw) return null;
  const g = window.GLOSSARY[kw];
  const c = window.CAT_COLORS[g.cat];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.55)',
      animation: 'reveal 220ms ease-out',
    }} onClick={onClose}>
      <div className="sheet-up" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-app)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 22px 38px', borderTop: `1px solid ${c.border}`,
        boxShadow: `0 -1px 0 rgba(255,255,255,0.04) inset, 0 -16px 60px rgba(0,0,0,0.5)`,
      }}>
        {/* grabber */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 4, margin: '0 auto 18px' }}/>

        {/* category tag + close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 10px', borderRadius: 7,
            background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}>
            <span style={{ fontSize: 12 }}>{g.glyph}</span>
            <span>{g.cat.replace('-', ' / ')}</span>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 15,
            background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', cursor: 'pointer',
          }}><Icon name="close" size={16}/></button>
        </div>

        {/* JP word — large */}
        <div className="jp" style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontSize: 38, fontWeight: 700, color: c.fg, lineHeight: 1.1 }}>{g.jp}</span>
          <button style={{
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, cursor: 'pointer',
          }}><Icon name="audio" size={16}/></button>
        </div>

        {/* romaji + EN */}
        <div className="mono" style={{ color: 'var(--text-tertiary)', fontSize: 12, marginBottom: 4 }}>
          {g.kana}
        </div>
        <div style={{ fontSize: 17, color: 'var(--text)', fontWeight: 500, marginBottom: 18 }}>{g.en}</div>

        {/* JP definition */}
        <div className="jp" style={{
          fontSize: 15, lineHeight: 1.85, color: 'var(--text)',
          padding: '14px 16px',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 14, marginBottom: 10,
        }}>
          {g.def_jp}
        </div>

        {/* EN gloss */}
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)', padding: '0 4px' }}>
          {g.def_en}
        </div>

        {/* action row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
          <button style={{
            flex: 1, height: 46, borderRadius: 13, border: '1px solid var(--border-strong)',
            background: 'transparent', color: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}><Icon name="cards" size={16}/> Save term</button>
          <button style={{
            flex: 1, height: 46, borderRadius: 13, border: 'none',
            background: c.fg, color: '#0B0E14',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>See cards using →</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Search / Home screen
// ─────────────────────────────────────────────────────────────────────────
function SearchScreen({ onPick, query, setQuery }) {
  const recent = ['lightning-bolt', 'serra-angel', 'shock'];
  const featured = [
    { tag: '初級', label: 'Beginner combat', n: 12 },
    { tag: '色マナ', label: 'Mana symbols', n: 5 },
    { tag: '能力語', label: 'Keyword abilities', n: 24 },
  ];

  return (
    <div className="scroll" style={{ height: '100%', overflow: 'auto', paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: '54px 20px 0' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: 1.6, textTransform: 'uppercase' }}>
          mtg · jp study
        </div>
        <div className="jp" style={{ fontSize: 32, fontWeight: 700, marginTop: 8, lineHeight: 1.15 }}>
          カードで<br/>日本語を学ぶ
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
          Search any Magic card. Read the Japanese rules text with tappable glossary.
        </div>
      </div>

      {/* Search input */}
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{
          height: 50, borderRadius: 14, background: 'var(--bg-surface)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
        }}>
          <Icon name="search" size={18} color="var(--text-secondary)"/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Lightning Bolt / 稲妻 / inazuma…"
            style={{ flex: 1, fontSize: 15, color: 'var(--text)' }}
          />
          <button style={{
            width: 30, height: 30, borderRadius: 15, background: 'transparent', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="mic" size={16}/></button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8, paddingLeft: 4 }} className="mono">
          Tip: use roman, kana, or kanji.
        </div>
      </div>

      {/* Recent */}
      <div style={{ padding: '28px 20px 0' }}>
        <SectionHeader label="Recent" right="3"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recent.map(id => {
            const card = window.CARDS.find(c => c.id === id);
            return <CardRow key={id} card={card} onTap={() => onPick(id)} />;
          })}
        </div>
      </div>

      {/* Featured study sets */}
      <div style={{ padding: '28px 20px 0' }}>
        <SectionHeader label="Study sets" right="See all"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {featured.map((f, i) => (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'var(--accent-soft)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Noto Sans JP', fontSize: 16, fontWeight: 700,
              }}>{f.tag}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{f.label}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {f.n} terms
                </div>
              </div>
              <Icon name="arrow" size={16} color="var(--text-tertiary)"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      marginBottom: 12,
    }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
        {label}
      </div>
      {right && <div className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>{right}</div>}
    </div>
  );
}

function CardRow({ card, onTap }) {
  return (
    <button onClick={onTap} style={{
      width: '100%', textAlign: 'left',
      padding: '12px 14px', borderRadius: 14,
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    }}>
      <div style={{
        width: 44, height: 60, borderRadius: 6, flexShrink: 0,
        background: `linear-gradient(160deg, oklch(0.42 0.13 ${card.artHue}), oklch(0.16 0.06 ${card.artHue}))`,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="jp" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.25 }}>
          {card.nameJp}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
          {card.nameEn}
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, letterSpacing: 0.5 }}>
          {card.setCode}
        </div>
      </div>
      <Icon name="arrow" size={16} color="var(--text-tertiary)"/>
    </button>
  );
}

Object.assign(window, { KeywordSheet, SearchScreen, SectionHeader, CardRow });
