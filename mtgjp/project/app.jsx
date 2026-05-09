// MTG-JP — main App shell + bottom nav + Tweaks panel.

const { useState: appUS, useEffect: appUE } = React;

function App() {
  const [tweaks, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS);
  const [screen, setScreen] = appUS(tweaks.screen || 'detail');
  const [cardId, setCardId] = appUS(tweaks.cardId || 'lightning-bolt');
  const [openKw, setOpenKw] = appUS(null);
  const [favs, setFavs] = appUS(new Set(['lightning-bolt']));
  const [query, setQuery] = appUS('');

  // Sync screen / card from tweaks panel changes
  appUE(() => { if (tweaks.screen && tweaks.screen !== screen && (tweaks.screen === 'detail' || tweaks.screen === 'search')) setScreen(tweaks.screen); }, [tweaks.screen]);
  appUE(() => { if (tweaks.cardId && tweaks.cardId !== cardId) setCardId(tweaks.cardId); }, [tweaks.cardId]);

  const card = window.CARDS.find(c => c.id === cardId) || window.CARDS[0];
  const isFav = favs.has(cardId);
  const toggleFav = () => {
    const next = new Set(favs);
    isFav ? next.delete(cardId) : next.add(cardId);
    setFavs(next);
  };
  const goDetail = (id) => { setCardId(id); setScreen('detail'); setTweak({ cardId: id, screen: 'detail' }); };
  const goSearch = () => { setScreen('search'); setTweak('screen', 'search'); };

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-canvas)', overflow: 'hidden',
    }}>
      {/* Backdrop dot grid (subtle) */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
      }}/>

      <IOSDevice dark width={390} height={844}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-app)', overflow: 'hidden' }}>
          {screen === 'detail' && (
            <CardDetail
              card={card}
              tweaks={tweaks}
              onKw={setOpenKw}
              activeKw={openKw}
              onBack={goSearch}
              onFav={toggleFav}
              isFav={isFav}
              setTweak={setTweak}
            />
          )}
          {screen === 'search' && (
            <SearchScreen
              onPick={goDetail}
              query={query}
              setQuery={setQuery}
            />
          )}

          {/* Bottom nav (always present, floats above content) */}
          <BottomNav screen={screen} setScreen={(s) => { setScreen(s); setTweak('screen', s); }}/>

          {/* Sheet (overlay) */}
          {openKw && <KeywordSheet kw={openKw} onClose={() => setOpenKw(null)}/>}
        </div>
      </IOSDevice>

      {/* Tweaks panel — TweaksPanel itself handles open/close via host messages */}
      <AppTweaks tweaks={tweaks} setTweak={setTweak}/>

      {/* Off-frame label */}
      <div style={{
        position: 'fixed', left: 18, bottom: 14,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.5,
        color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
      }}>
        mtg-jp · ios prototype · 390 × 844
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: 'search', icon: 'home',   label: 'Home' },
    { id: 'detail', icon: 'cards',  label: 'Card' },
    { id: 'study',  icon: 'spark',  label: 'Study' },
    { id: 'me',     icon: 'user',   label: 'Me' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 18, left: 16, right: 16,
      height: 64, borderRadius: 22,
      background: 'rgba(20,24,33,0.85)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 80,
    }}>
      {items.map(it => {
        const active = screen === it.id;
        return (
          <button key={it.id}
            onClick={() => (it.id === 'search' || it.id === 'detail') && setScreen(it.id)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: active ? 'var(--accent)' : 'var(--text-tertiary)',
              padding: '6px 14px',
            }}>
            <Icon name={it.icon} size={20}/>
            <span className="mono" style={{ fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tweaks
// ─────────────────────────────────────────────────────────────────────────
function AppTweaks({ tweaks, setTweak }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakSelect } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Highlighting">
        <TweakRadio
          label="Style"
          options={['box', 'underline', 'flat']}
          value={tweaks.highlightStyle}
          onChange={(v) => setTweak('highlightStyle', v)}
        />
      </TweakSection>
      <TweakSection title="Reading aids">
        <TweakToggle label="Furigana on names" value={tweaks.showFurigana} onChange={(v) => setTweak('showFurigana', v)}/>
      </TweakSection>
      <TweakSection title="Card">
        <TweakSelect
          label="Active card"
          options={window.CARDS.map(c => ({ value: c.id, label: c.nameEn }))}
          value={tweaks.cardId}
          onChange={(v) => setTweak('cardId', v)}
        />
        <TweakRadio
          label="Screen"
          options={['detail', 'search']}
          value={tweaks.screen}
          onChange={(v) => setTweak('screen', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
