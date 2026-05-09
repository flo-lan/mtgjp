// MTG-JP — card detail (the main study screen).
// Layout: full card preview (original frame, NOT the trademarked design) →
// identity → type → rules text study area → terms list.

const _CD_REACT = React;

function CardPreview({ card, hlStyle, onKw, activeKw, showFurigana }) {
  const hue = card.artHue;
  const typeG = window.GLOSSARY[card.typeKw];
  const typeC = window.CAT_COLORS[typeG.cat];

  return (
    <div style={{
      width: '100%', position: 'relative',
      borderRadius: 16,
      padding: 10,
      background: `
        linear-gradient(170deg, oklch(0.22 0.05 ${hue}) 0%, oklch(0.12 0.04 ${hue}) 60%, oklch(0.08 0.03 ${hue}) 100%)
      `,
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        padding: '8px 11px', borderRadius: 9,
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span className="jp" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>
          <Ruby base={card.nameJp} kana={showFurigana ? card.nameKana : null}/>
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: 0.4 }}>
          {card.cost}
        </span>
      </div>

      {/* Art window */}
      <ArtPlate hue={hue} height={160} label={`art · ${card.nameEn.toLowerCase()}`}/>

      {/* Type bar */}
      <div className="jp" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 11px', borderRadius: 8,
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.06)',
        fontSize: 13, fontWeight: 500, color: typeC.fg,
      }}>
        <span>{typeG.jp}</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: 0.6 }}>
          {card.setCode.split(' · ')[0]}
        </span>
      </div>

      {/* Rules text in-card */}
      <div style={{
        padding: '12px 13px', borderRadius: 10, minHeight: 110,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.05)',
        flex: 1,
      }}>
        <div className="jp" style={{ fontSize: 15, lineHeight: 1.95, letterSpacing: 0.1 }}>
          {card.rules.map((tok, i) => {
            if (tok.kw) {
              return <KeywordPill key={i} kw={tok.kw} onTap={onKw} style={hlStyle} active={activeKw === tok.kw}/>;
            }
            return <span key={i}>{tok.jp}</span>;
          })}
        </div>
      </div>

      {/* Footer: artist + set */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '0 4px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(255,255,255,0.35)', letterSpacing: 0.4,
      }}>
        <span>illus. {card.artist}</span>
        <span>{card.setCode}</span>
      </div>
    </div>
  );
}

function CardDetail({ card, tweaks, onKw, activeKw, onBack, onFav, isFav, setTweak }) {
  const [showEn, setShowEn] = _CD_REACT.useState(false);

  const usedKws = card.rules.filter(t => t.kw).map(t => t.kw);
  const uniqueKws = [...new Set(usedKws)];
  const typeG = window.GLOSSARY[card.typeKw];
  const typeC = window.CAT_COLORS[typeG.cat];

  return (
    <div className="scroll" style={{ height: '100%', overflow: 'auto' }}>
      {/* ── Top action bar ─────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '54px 14px 10px',
        background: 'linear-gradient(180deg, var(--bg-app) 50%, transparent)',
      }}>
        <button onClick={onBack} style={pillBtnSx}><Icon name="back" size={18}/></button>
        <div className="mono" style={{ fontSize: 10, letterSpacing: 1.4, color: 'var(--text-tertiary)' }}>
          {card.setCode}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onFav} style={pillBtnSx}>
            <Icon name={isFav ? 'heartf' : 'heart'} size={17} color={isFav ? '#F08C9C' : 'currentColor'}/>
          </button>
          <button style={pillBtnSx}><Icon name="more" size={18}/></button>
        </div>
      </div>

      {/* ── Full card preview (original frame, not trademarked) ─── */}
      <div style={{ padding: '0 22px' }}>
        <CardPreview card={card} hlStyle={tweaks.highlightStyle} onKw={onKw} activeKw={activeKw} showFurigana={tweaks.showFurigana}/>
      </div>

      {/* ── Identity block ──────────────────────────────────────── */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="jp" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1, letterSpacing: 1 }}>
              <Ruby base={card.nameJp} kana={tweaks.showFurigana ? card.nameKana : null}/>
            </div>
            <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 400 }}>
              {card.nameEn}
            </div>
          </div>
          <button style={{
            ...pillBtnSx, width: 38, height: 38, marginTop: 4,
            background: 'var(--accent-soft)', color: 'var(--accent)',
          }}><Icon name="audio" size={16}/></button>
        </div>

        {/* Type row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <span className="jp" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 8,
            background: typeC.bg, border: `1px solid ${typeC.border}`,
            color: typeC.fg, fontSize: 14, fontWeight: 500,
          }}>{typeG.jp}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{typeG.en}</span>
          <div style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{card.cost}</span>
        </div>
      </div>

      {/* ── Rules text study area ───────────────────────────────── */}
      <div style={{ padding: '26px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <SectionHeader label="ルールテキスト · Rules"/>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button onClick={() => setTweak('showFurigana', !tweaks.showFurigana)} style={miniToggleSx(tweaks.showFurigana)}>振</button>
            <button onClick={() => setShowEn(!showEn)} style={miniToggleSx(showEn)}>EN</button>
          </div>
        </div>

        <div style={{
          padding: '20px 18px', borderRadius: 18,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
        }}>
          <RulesText card={card} hlStyle={tweaks.highlightStyle} onKw={onKw} activeKw={activeKw}/>
          {showEn && (
            <div className="reveal" style={{
              marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.55,
            }}>
              {card.rulesEn}
            </div>
          )}
        </div>

        <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 10, letterSpacing: 0.4, paddingLeft: 4 }}>
          ↑ tap any colored term for definition
        </div>
      </div>

      {/* ── Terms list ──────────────────────────────────────────── */}
      <div style={{ padding: '24px 22px 0' }}>
        <SectionHeader label={`Terms · ${uniqueKws.length}`}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {uniqueKws.map(k => {
            const g = window.GLOSSARY[k];
            const c = window.CAT_COLORS[g.cat];
            return (
              <button key={k} onClick={() => onKw(k)} style={{
                width: '100%', textAlign: 'left',
                padding: '12px 14px', borderRadius: 13,
                background: 'var(--bg-surface)', border: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: c.bg, color: c.fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                }}>{g.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="jp" style={{ fontSize: 15, fontWeight: 600, color: c.fg }}>{g.jp}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{g.en}</div>
                </div>
                <Icon name="arrow" size={14} color="var(--text-tertiary)"/>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 110 }}/>
    </div>
  );
}

const pillBtnSx = {
  width: 40, height: 40, borderRadius: 20,
  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

const miniToggleSx = (on) => ({
  height: 28, minWidth: 32, padding: '0 9px', borderRadius: 8,
  background: on ? 'var(--accent-soft)' : 'transparent',
  color: on ? 'var(--accent)' : 'var(--text-tertiary)',
  border: `1px solid ${on ? 'rgba(232,184,107,0.35)' : 'var(--border)'}`,
  fontFamily: 'Noto Sans JP, JetBrains Mono, monospace', fontSize: 12, fontWeight: 600,
  cursor: 'pointer',
});

Object.assign(window, { CardDetail, CardPreview });
