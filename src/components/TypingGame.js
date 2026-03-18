import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  "The best error message is the one that never shows up.",
  "First solve the problem, then write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to be irreplaceable one must always be different.",
  "Java is to JavaScript what car is to carpet.",
  "Code is like humor. When you have to explain it, it is bad.",
  "Fix the cause, not the symptom.",
  "Simplicity is the soul of efficiency.",
  "Before software can be reusable it first has to be usable.",
  "Make it work, make it right, make it fast.",
  "The most disastrous thing that you can ever learn is your first programming language.",
  "The function of good software is to make the complex appear to be simple.",
  "Optimism is an occupational hazard of programming. Feedback is the treatment.",
  "Any application that can be written in JavaScript, will eventually be written in JavaScript.",
];

const BEST_SCORE_KEY = 'faiz_typing_best_wpm';
const BEST_ACC_KEY   = 'faiz_typing_best_acc';

const TypingGame = ({ open, onClose }) => {
  const [quoteIndex,   setQuoteIndex]   = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [typed,        setTyped]        = useState('');
  const [startTime,    setStartTime]    = useState(null);
  const [finished,     setFinished]     = useState(false);
  const [wpm,          setWpm]          = useState(0);
  const [accuracy,     setAccuracy]     = useState(100);
  const [timeElapsed,  setTimeElapsed]  = useState(0);
  const [bestWpm,      setBestWpm]      = useState(() => parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0'));
  const [bestAcc,      setBestAcc]      = useState(() => parseInt(localStorage.getItem(BEST_ACC_KEY)   || '0'));
  const [newBest,      setNewBest]      = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const quote = QUOTES[quoteIndex];

  /* ── focus on open ── */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      resetGame();
    }
  }, [open]);

  /* ── live timer (only runs while typing, stops showing externally) ── */
  useEffect(() => {
    if (startTime && !finished) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((Date.now() - startTime) / 1000);
      }, 200);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, finished]);

  /* ── reset ── */
  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    setTyped('');
    setStartTime(null);
    setFinished(false);
    setWpm(0);
    setAccuracy(100);
    setTimeElapsed(0);
    setNewBest(false);
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* ── input handler ── */
  const handleInput = (e) => {
    const val = e.target.value;
    if (!startTime && val.length > 0) setStartTime(Date.now());
    if (finished) return;

    // allow typing up to quote length (no over-extension)
    const capped = val.slice(0, quote.length);
    setTyped(capped);

    // accuracy
    let correct = 0;
    for (let i = 0; i < capped.length; i++) {
      if (capped[i] === quote[i]) correct++;
    }
    setAccuracy(capped.length > 0 ? Math.round((correct / capped.length) * 100) : 100);

    // completion check — trigger when user has typed the full length
    if (capped.length >= quote.length) {
      clearInterval(timerRef.current);
      const elapsed   = (Date.now() - startTime) / 1000;
      const wordCount = quote.trim().split(/\s+/).length;
      const finalWpm  = Math.round((wordCount / elapsed) * 60);
      let finalCorrect = 0;
      for (let i = 0; i < quote.length; i++) {
        if (capped[i] === quote[i]) finalCorrect++;
      }
      const finalAcc = Math.round((finalCorrect / quote.length) * 100);
      setTimeElapsed(elapsed);
      setWpm(finalWpm);
      setAccuracy(finalAcc);
      setFinished(true);
      // only count as new best if WPM is higher AND accuracy is >= previous best accuracy
      if (finalWpm > bestWpm && finalAcc >= bestAcc) {
        setBestWpm(finalWpm);
        setBestAcc(finalAcc);
        localStorage.setItem(BEST_SCORE_KEY, String(finalWpm));
        localStorage.setItem(BEST_ACC_KEY,   String(finalAcc));
        setNewBest(true);
      } else {
        setNewBest(false);
      }
    }
  };

  /* ── character rendering ── */
  const renderQuote = () =>
    quote.split('').map((char, i) => {
      let color, bg;
      if (i < typed.length) {
        color = typed[i] === char ? '#e2e8f0' : '#f87171';
        bg    = typed[i] === char ? 'transparent' : 'rgba(248,113,113,0.12)';
      } else if (i === typed.length) {
        color = 'rgba(255,255,255,0.9)'; bg = 'transparent';
      } else {
        color = 'rgba(255,255,255,0.32)'; bg = 'transparent';
      }
      return (
        <span key={i} style={{ color, background: bg, borderRadius: 2, position: 'relative', transition: 'color 0.08s' }}>
          {i === typed.length && (
            <span style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 2, background: '#61DAFB', borderRadius: 1,
              animation: 'tgCursor 1s step-end infinite',
              boxShadow: '0 0 6px #61DAFB',
            }} />
          )}
          {char}
        </span>
      );
    });

  const progressPct = Math.min((typed.length / quote.length) * 100, 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes tgCursor    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes tgBarMove   { from{background-position:200% 0} to{background-position:-200% 0} }
        @keyframes tgPulse     { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.4} }
        @keyframes tgConfetti  { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-130px) rotate(720deg);opacity:0} }
        @keyframes tgResultIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }

        .tg-overlay {
          position:fixed;inset:0;z-index:10000;
          display:flex;align-items:center;justify-content:center;padding:16px;
          background:rgba(0,0,0,0.78);
          backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
        }
        .tg-modal {
          position:relative;width:100%;max-width:660px;
          border-radius:22px;
          background:#0c0c16;
          border:1px solid rgba(255,255,255,0.08);
          box-shadow:0 32px 80px rgba(0,0,0,0.75),inset 0 1px 0 rgba(255,255,255,0.06);
          overflow:hidden;
          font-family:'DM Sans',sans-serif;
        }
        .tg-topbar {
          height:2px;
          background:linear-gradient(90deg,#61DAFB,#a78bfa,#61DAFB);
          background-size:200% 100%;
          animation:tgBarMove 2.5s linear infinite;
        }
        .tg-body { padding:30px 34px 32px; }
        @media(max-width:500px){.tg-body{padding:22px 18px 26px;}}

        /* header */
        .tg-head {
          display:flex;align-items:flex-start;justify-content:space-between;
          margin-bottom:26px;
        }
        .tg-title {
          font-family:'Italiana',serif;
          font-size:clamp(26px,5vw,38px);
          margin:0;line-height:1;
          background:linear-gradient(135deg,#fff 40%,rgba(255,255,255,0.45));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .tg-badge {
          font-size:10px;letter-spacing:0.25em;text-transform:uppercase;
          color:rgba(255,255,255,0.22);font-weight:600;margin-top:5px;
        }
        .tg-x {
          width:34px;height:34px;border-radius:9px;
          border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);
          color:rgba(255,255,255,0.35);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;transition:all 0.2s;
        }
        .tg-x:hover{background:rgba(255,255,255,0.09);color:#fff;}

        /* stats strip — only visible after finish */
        .tg-stats {
          display:flex;gap:10px;margin-bottom:22px;flex-wrap:wrap;
          transition:opacity 0.4s,max-height 0.4s;
        }
        .tg-stat {
          flex:1;min-width:72px;
          padding:11px 12px;border-radius:11px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.07);
          text-align:center;
        }
        .tg-stat-v {
          font-family:'JetBrains Mono',monospace;
          font-size:20px;font-weight:700;line-height:1;margin-bottom:4px;
          color:#fff;
        }
        .tg-stat-l {
          font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
          color:rgba(255,255,255,0.25);
        }

        /* progress */
        .tg-prog {
          height:2px;background:rgba(255,255,255,0.06);
          border-radius:999px;margin-bottom:18px;overflow:hidden;
        }
        .tg-prog-fill {
          height:100%;border-radius:999px;
          background:linear-gradient(90deg,#61DAFB,#a78bfa);
          box-shadow:0 0 8px rgba(97,218,251,0.45);
          transition:width 0.12s ease;
        }

        /* quote box */
        .tg-box {
          position:relative;padding:18px 20px;border-radius:13px;
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          margin-bottom:18px;
          line-height:2;
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(14px,2vw,16px);
          letter-spacing:0.03em;
          cursor:text;user-select:none;min-height:88px;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .tg-box:focus-within {
          border-color:rgba(97,218,251,0.2);
          box-shadow:0 0 0 3px rgba(97,218,251,0.06);
        }
        .tg-hidden {
          position:absolute;opacity:0;width:1px;height:1px;
          top:0;left:0;pointer-events:none;
        }

        /* hint */
        .tg-hint {
          text-align:center;font-size:12px;color:rgba(255,255,255,0.18);
          letter-spacing:0.1em;margin-bottom:18px;
          display:flex;align-items:center;justify-content:center;gap:8px;
        }
        .tg-dot {
          width:5px;height:5px;border-radius:50%;background:#61DAFB;
          animation:tgPulse 2s ease-in-out infinite;flex-shrink:0;
        }

        /* actions */
        .tg-actions { display:flex;gap:10px;align-items:center; }
        .tg-reset {
          display:inline-flex;align-items:center;gap:7px;
          padding:10px 20px;border-radius:999px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.09);
          font-family:'DM Sans',sans-serif;
          font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
          color:rgba(255,255,255,0.42);
          cursor:pointer;transition:all 0.2s;
        }
        .tg-reset:hover{background:rgba(255,255,255,0.09);color:#fff;}
        .tg-best-lbl {
          margin-left:auto;font-size:12px;color:rgba(255,255,255,0.2);
          letter-spacing:0.06em;display:flex;align-items:center;gap:6px;
        }
        .tg-best-lbl strong{color:#61DAFB;font-family:'JetBrains Mono',monospace;}

        /* ── RESULT overlay ── */
        .tg-result {
          position:absolute;inset:0;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          background:rgba(10,10,20,0.98);
          border-radius:22px;padding:32px 24px;text-align:center;
          z-index:10;
          animation:tgResultIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .tg-res-wpm {
          font-family:'Italiana',serif;
          font-size:clamp(72px,14vw,108px);
          line-height:1;margin:0;
          background:linear-gradient(135deg,#61DAFB,#a78bfa);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .tg-res-wpm-lbl {
          font-size:11px;letter-spacing:0.35em;text-transform:uppercase;
          color:rgba(255,255,255,0.25);margin:8px 0 6px;
        }
        .tg-res-time {
          font-family:'JetBrains Mono',monospace;
          font-size:28px;font-weight:700;color:rgba(255,255,255,0.5);
          margin-bottom:4px;
        }
        .tg-res-time-lbl {
          font-size:10px;letter-spacing:0.3em;text-transform:uppercase;
          color:rgba(255,255,255,0.18);margin-bottom:24px;
        }
        .tg-res-chips {
          display:flex;gap:10px;margin-bottom:26px;flex-wrap:wrap;justify-content:center;
        }
        .tg-chip {
          padding:7px 16px;border-radius:999px;
          border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);
          font-size:12px;font-weight:600;
          color:rgba(255,255,255,0.5);
          font-family:'JetBrains Mono',monospace;
        }
        .tg-new-best {
          display:inline-flex;align-items:center;gap:8px;
          padding:7px 18px;border-radius:999px;
          background:rgba(97,218,251,0.1);border:1px solid rgba(97,218,251,0.3);
          color:#61DAFB;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          margin-bottom:24px;
          animation:tgPulse 1.5s ease-in-out infinite;
        }
        .tg-play-again {
          position:relative;display:inline-flex;
          padding:1.5px;border-radius:999px;
          background:linear-gradient(135deg,#61DAFB,#a78bfa);
          cursor:pointer;border:none;
          box-shadow:0 0 22px rgba(97,218,251,0.22);
          transition:box-shadow 0.3s;
        }
        .tg-play-again:hover{box-shadow:0 0 36px rgba(97,218,251,0.42);}
        .tg-play-again-in {
          display:inline-flex;align-items:center;gap:8px;
          padding:12px 30px;border-radius:999px;
          background:#0c0c16;
          font-family:'DM Sans',sans-serif;
          font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
          color:#fff;
        }

        /* confetti */
        .tg-cw { position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:22px; }
        .tg-cp {
          position:absolute;width:8px;height:8px;border-radius:2px;
          animation:tgConfetti 1.1s ease-out forwards;
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            className="tg-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
          >
            <motion.div
              className="tg-modal"
              initial={{ opacity: 0, scale: 0.88, y: 36 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.92,  y: 18 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tg-topbar" />
              <div className="tg-body">

                {/* Header */}
                <div className="tg-head">
                  <div>
                    <h2 className="tg-title">Typing Test</h2>
                    <p className="tg-badge">Secret Easter Egg 🥚</p>
                  </div>
                  <button className="tg-x" onClick={onClose}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {/* Stats — only shown after finish */}
                {finished && (
                  <div className="tg-stats">
                    <div className="tg-stat">
                      <div className="tg-stat-v" style={{ color: '#61DAFB' }}>{wpm}</div>
                      <div className="tg-stat-l">WPM</div>
                    </div>
                    <div className="tg-stat">
                      <div className="tg-stat-v" style={{ color: accuracy >= 90 ? '#4ade80' : accuracy >= 70 ? '#fbbf24' : '#f87171' }}>
                        {accuracy}%
                      </div>
                      <div className="tg-stat-l">Accuracy</div>
                    </div>
                    <div className="tg-stat">
                      <div className="tg-stat-v">{Math.round(timeElapsed)}s</div>
                      <div className="tg-stat-l">Time</div>
                    </div>
                    <div className="tg-stat">
                      <div className="tg-stat-v" style={{ color: '#4ade80' }}>{quote.trim().split(/\s+/).length}</div>
                      <div className="tg-stat-l">Words</div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="tg-prog">
                  <div className="tg-prog-fill" style={{ width: `${progressPct}%` }} />
                </div>

                {/* Quote box */}
                <div className="tg-box" onClick={() => inputRef.current?.focus()}>
                  {renderQuote()}
                  <input
                    ref={inputRef}
                    className="tg-hidden"
                    value={typed}
                    onChange={handleInput}
                    autoComplete="off" autoCorrect="off"
                    autoCapitalize="off" spellCheck="false"
                    tabIndex={0}
                  />
                </div>

                {/* Hint */}
                {!startTime && !finished && (
                  <div className="tg-hint">
                    <span className="tg-dot" />
                    Click the box and start typing
                  </div>
                )}

                {/* Actions */}
                <div className="tg-actions">
                  <button className="tg-reset" onClick={resetGame}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.62"/>
                    </svg>
                    New Quote
                  </button>
                  {bestWpm > 0 && (
                    <div className="tg-best-lbl">
                      Best: <strong>{bestWpm} WPM</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Result overlay ── */}
              <AnimatePresence>
                {finished && (
                  <motion.div
                    className="tg-result"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Confetti */}
                    <div className="tg-cw">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="tg-cp" style={{
                          left: `${8 + (i * 4.8) % 84}%`, top: '58%',
                          background: ['#61DAFB','#a78bfa','#4ade80','#fbbf24','#f87171'][i % 5],
                          animationDelay: `${i * 0.055}s`,
                          animationDuration: `${0.85 + (i % 4) * 0.15}s`,
                        }} />
                      ))}
                    </div>

                    {/* WPM — big hero number */}
                    <p className="tg-res-wpm">{wpm}</p>
                    <p className="tg-res-wpm-lbl">Words Per Minute</p>

                    {/* Time — secondary hero number */}
                    <p className="tg-res-time">{Math.round(timeElapsed)}s</p>
                    <p className="tg-res-time-lbl">Completion Time</p>

                    {/* chips */}
                    <div className="tg-res-chips">
                      <span className="tg-chip">⚡ {accuracy}% accuracy</span>
                      <span className="tg-chip">📝 {quote.trim().split(/\s+/).length} words</span>
                      <span className="tg-chip">🏆 Best {bestWpm} WPM</span>
                    </div>

                    {/* new best badge */}
                    {newBest && (
                      <div className="tg-new-best">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        New Personal Best!
                      </div>
                    )}

                    {/* Play again */}
                    <button className="tg-play-again" onClick={resetGame}>
                      <span className="tg-play-again-in">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.62"/>
                        </svg>
                        Play Again
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TypingGame;