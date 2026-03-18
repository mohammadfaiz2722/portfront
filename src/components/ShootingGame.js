// SpaceShooter.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const BEST_KEY = 'faiz_shooter_best';

const rand    = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

/* ══════════════════════════════════
   SOUND ENGINE — Web Audio API
   No external files, all synthesized
══════════════════════════════════ */
const createSoundEngine = () => {
  let ctx = null;

  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  const resume = () => { const c = getCtx(); if (c.state === 'suspended') c.resume(); };

  /* ── laser shoot ── */
  const shoot = () => {
    try {
      resume();
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.08);
    } catch (_) {}
  };

  /* ── enemy explosion (small) ── */
  const explodeSmall = () => {
    try {
      resume();
      const c = getCtx();
      // noise burst
      const bufLen = c.sampleRate * 0.18;
      const buf    = c.createBuffer(1, bufLen, c.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const src  = c.createBufferSource();
      const gain = c.createGain();
      const filt = c.createBiquadFilter();
      src.buffer = buf;
      filt.type  = 'bandpass';
      filt.frequency.setValueAtTime(600, c.currentTime);
      filt.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.18);
      filt.Q.value = 1.5;
      src.connect(filt); filt.connect(gain); gain.connect(c.destination);
      gain.gain.setValueAtTime(0.35, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
      src.start(c.currentTime);
    } catch (_) {}
  };

  /* ── tank explosion (big boom) ── */
  const explodeBig = () => {
    try {
      resume();
      const c = getCtx();
      const bufLen = c.sampleRate * 0.5;
      const buf    = c.createBuffer(1, bufLen, c.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const src   = c.createBufferSource();
      const gain  = c.createGain();
      const filt  = c.createBiquadFilter();
      const dist  = c.createWaveShaper();
      src.buffer  = buf;
      filt.type   = 'lowpass';
      filt.frequency.setValueAtTime(300, c.currentTime);
      filt.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.5);
      // soft clip distortion for crunch
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
      }
      dist.curve = curve;
      src.connect(filt); filt.connect(dist); dist.connect(gain); gain.connect(c.destination);
      gain.gain.setValueAtTime(0.7, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
      src.start(c.currentTime);

      // low rumble oscillator
      const osc  = c.createOscillator();
      const og   = c.createGain();
      osc.connect(og); og.connect(c.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, c.currentTime + 0.4);
      og.gain.setValueAtTime(0.4, c.currentTime);
      og.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.4);
    } catch (_) {}
  };

  /* ── player hit (damage) ── */
  const playerHit = () => {
    try {
      resume();
      const c = getCtx();
      // descending tone + noise
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, c.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.3);

      // noise crackle on top
      const bufLen = c.sampleRate * 0.12;
      const buf    = c.createBuffer(1, bufLen, c.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const src  = c.createBufferSource();
      const ng   = c.createGain();
      src.buffer = buf;
      src.connect(ng); ng.connect(c.destination);
      ng.gain.setValueAtTime(0.2, c.currentTime);
      ng.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      src.start(c.currentTime);
    } catch (_) {}
  };

  /* ── wave clear / level up ── */
  const waveClear = () => {
    try {
      resume();
      const c = getCtx();
      const notes = [523, 659, 784, 1047]; // C E G C
      notes.forEach((freq, i) => {
        const osc  = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain); gain.connect(c.destination);
        osc.type = 'sine';
        const t = c.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch (_) {}
  };

  /* ── game over ── */
  const gameOver = () => {
    try {
      resume();
      const c = getCtx();
      const notes = [392, 349, 311, 262]; // G F Eb C descending
      notes.forEach((freq, i) => {
        const osc  = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain); gain.connect(c.destination);
        osc.type = 'sawtooth';
        const t = c.currentTime + i * 0.18;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    } catch (_) {}
  };

  /* ── combo beep ── */
  const combo = (count) => {
    try {
      resume();
      const c    = getCtx();
      const freq = 440 * Math.pow(1.15, Math.min(count, 12));
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.1);
    } catch (_) {}
  };

  /* ── new high score jingle ── */
  const newBest = () => {
    try {
      resume();
      const c = getCtx();
      const notes = [523, 659, 784, 659, 1047];
      notes.forEach((freq, i) => {
        const osc  = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain); gain.connect(c.destination);
        osc.type = i === 4 ? 'sine' : 'triangle';
        const t = c.currentTime + i * 0.12;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (_) {}
  };

  /* ── enemy bullet (warning buzz) ── */
  const enemyShoot = () => {
    try {
      resume();
      const c = getCtx();
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, c.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.12);
    } catch (_) {}
  };

  return { shoot, explodeSmall, explodeBig, playerHit, waveClear, gameOver, combo, newBest, enemyShoot };
};

/* ── filled rounded rect ── */
const fillRR = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
  ctx.fill();
};

const makeStars = (W, H) =>
  Array.from({ length: 120 }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(0.3, 1.8), o: rand(0.2, 0.9),
    speed: rand(0.2, 1.4),
    twinkle: rand(0, Math.PI * 2),
  }));

const makeNebulas = (W, H) =>
  Array.from({ length: 4 }, (_, i) => ({
    x: rand(W * 0.1, W * 0.9),
    y: rand(H * 0.05, H * 0.5),
    rx: rand(W * 0.12, W * 0.22),
    ry: rand(H * 0.06, H * 0.12),
    hue: [210, 270, 190, 240][i],
    o: rand(0.03, 0.07),
  }));

const makePlayer = (W, H) => ({
  x: W / 2, y: H - 80,
  w: 40, h: 42, speed: 6,
  cooldown: 0, invincible: 0, lives: 3, shield: 0,
});

const makeEnemy = (W, wave) => {
  const types = wave < 2 ? ['basic'] : wave < 4 ? ['basic', 'fast'] : ['basic', 'fast', 'tank'];
  const t = types[randInt(0, types.length)];
  return {
    x: rand(30, W - 50), y: rand(-120, -40),
    w: t === 'tank' ? 36 : 28, h: t === 'tank' ? 32 : 26,
    type: t, hp: t === 'tank' ? 3 : 1, maxHp: t === 'tank' ? 3 : 1,
    speed: t === 'fast' ? rand(2.5, 3.8) : rand(0.8, 1.6 + wave * 0.12),
    wobble: rand(0, Math.PI * 2), wobbleSpeed: rand(0.018, 0.045),
    color: t === 'tank' ? '#a78bfa' : t === 'fast' ? '#fbbf24' : '#f87171',
    glowColor: t === 'tank' ? 'rgba(167,139,250,0.6)' : t === 'fast' ? 'rgba(251,191,36,0.6)' : 'rgba(248,113,113,0.6)',
    shootTimer: t === 'tank' ? randInt(90, 150) : 999999,
    points: t === 'tank' ? 30 : t === 'fast' ? 20 : 10,
    rot: 0, rotSpeed: t === 'fast' ? rand(-0.05, 0.05) : 0,
  };
};

const makeParts = (x, y, color, big) =>
  Array.from({ length: big ? 18 : 9 }, () => ({
    x, y, vx: rand(-4, 4), vy: rand(-5, 1),
    life: rand(22, big ? 55 : 36), maxLife: big ? 55 : 36,
    r: rand(1.5, big ? 6 : 3.5), color,
  }));

/* ══ DRAW ══ */
const drawPlayer = (ctx, p, frame) => {
  if (p.invincible > 0 && Math.floor(p.invincible / 5) % 2 === 0) return;
  const { x, y, w, h } = p;
  ctx.save(); ctx.translate(x, y);
  const flameH = 18 + Math.sin(frame * 0.25) * 6;
  const fg = ctx.createLinearGradient(0, h*0.4, 0, h*0.4+flameH);
  fg.addColorStop(0, 'rgba(97,218,251,0.9)');
  fg.addColorStop(0.4, 'rgba(167,139,250,0.7)');
  fg.addColorStop(1, 'rgba(97,218,251,0)');
  ctx.fillStyle = fg;
  ctx.beginPath(); ctx.moveTo(-6,h*0.38); ctx.lineTo(0,h*0.38+flameH); ctx.lineTo(6,h*0.38); ctx.closePath(); ctx.fill();
  [-w*0.28, w*0.28].forEach(tx => {
    const sfg = ctx.createLinearGradient(tx, h*0.3, tx, h*0.3+10);
    sfg.addColorStop(0,'rgba(97,218,251,0.6)'); sfg.addColorStop(1,'rgba(97,218,251,0)');
    ctx.fillStyle = sfg;
    ctx.beginPath(); ctx.moveTo(tx-3,h*0.28); ctx.lineTo(tx,h*0.28+10+Math.sin(frame*0.3+tx)*3); ctx.lineTo(tx+3,h*0.28); ctx.closePath(); ctx.fill();
  });
  ctx.shadowColor='#61DAFB'; ctx.shadowBlur=24;
  const hullG = ctx.createLinearGradient(0,-h/2,0,h/2);
  hullG.addColorStop(0,'#e0f7ff'); hullG.addColorStop(0.4,'#61DAFB'); hullG.addColorStop(1,'#0e7490');
  ctx.fillStyle = hullG;
  ctx.beginPath(); ctx.moveTo(0,-h/2); ctx.lineTo(w/2,h/2-6); ctx.lineTo(w*0.3,h/2-2); ctx.lineTo(0,h/2-12); ctx.lineTo(-w*0.3,h/2-2); ctx.lineTo(-w/2,h/2-6); ctx.closePath(); ctx.fill();
  ctx.shadowBlur=0; ctx.fillStyle='rgba(97,218,251,0.3)';
  ctx.beginPath(); ctx.moveTo(0,-h*0.1); ctx.lineTo(w*0.45,h*0.3); ctx.lineTo(w*0.25,h*0.3); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,-h*0.1); ctx.lineTo(-w*0.45,h*0.3); ctx.lineTo(-w*0.25,h*0.3); ctx.closePath(); ctx.fill();
  ctx.shadowColor='#61DAFB'; ctx.shadowBlur=10;
  const cg = ctx.createRadialGradient(-3,-h*0.18,1,0,-h*0.1,10);
  cg.addColorStop(0,'#fff'); cg.addColorStop(0.5,'rgba(97,218,251,0.6)'); cg.addColorStop(1,'rgba(0,0,30,0.8)');
  ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(0,-h*0.1,7,11,0,0,Math.PI*2); ctx.fill();
  if (p.shield > 0) {
    ctx.shadowColor='#4ade80'; ctx.shadowBlur=20;
    ctx.strokeStyle=`rgba(74,222,128,${Math.min(1,p.shield/60)*0.7})`; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,w*0.72,0,Math.PI*2); ctx.stroke();
  }
  ctx.restore();
};

const drawEnemy = (ctx, e, frame) => {
  const { x, y, w, h, type, glowColor } = e;
  ctx.save(); ctx.translate(x,y); ctx.rotate(e.rot);
  ctx.shadowColor=glowColor; ctx.shadowBlur=14;
  if (type==='tank') {
    const g=ctx.createLinearGradient(0,-h/2,0,h/2); g.addColorStop(0,'#c4b5fd'); g.addColorStop(1,'#7c3aed'); ctx.fillStyle=g;
    ctx.beginPath(); for(let i=0;i<6;i++){const a=(Math.PI/3)*i-Math.PI/6,r=w/2; i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);} ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); for(let i=0;i<6;i++){const a=(Math.PI/3)*i-Math.PI/6,r=w*0.28; i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);} ctx.closePath(); ctx.fill();
    ctx.shadowBlur=0; const bw=w*1.1; ctx.fillStyle='rgba(0,0,0,0.6)'; fillRR(ctx,-bw/2,h/2+4,bw,5,2); ctx.fillStyle=e.hp>1?'#a78bfa':'#f87171'; fillRR(ctx,-bw/2,h/2+4,bw*(e.hp/e.maxHp),5,2);
  } else if (type==='fast') {
    const g=ctx.createLinearGradient(0,-h/2,0,h/2); g.addColorStop(0,'#fef08a'); g.addColorStop(1,'#d97706'); ctx.fillStyle=g;
    ctx.beginPath(); ctx.moveTo(0,-h/2); ctx.lineTo(w/2,h/2); ctx.lineTo(w*0.15,h*0.1); ctx.lineTo(0,h/2-8); ctx.lineTo(-w*0.15,h*0.1); ctx.lineTo(-w/2,h/2); ctx.closePath(); ctx.fill();
    const eg=ctx.createRadialGradient(0,h/2-2,1,0,h/2-2,10); eg.addColorStop(0,'rgba(251,191,36,0.9)'); eg.addColorStop(1,'rgba(251,191,36,0)'); ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(0,h/2-2,10+Math.sin(frame*0.3)*3,0,Math.PI*2); ctx.fill();
  } else {
    const g=ctx.createLinearGradient(0,-h/2,0,h/2); g.addColorStop(0,'#fca5a5'); g.addColorStop(1,'#dc2626'); ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(0,h*0.1,w/2,h/2-4,0,0,Math.PI*2); ctx.fill();
    const dg=ctx.createRadialGradient(-3,-4,1,0,-2,10); dg.addColorStop(0,'rgba(255,255,255,0.6)'); dg.addColorStop(1,'rgba(220,38,38,0.3)'); ctx.fillStyle=dg; ctx.beginPath(); ctx.ellipse(0,-2,w*0.28,h*0.28,0,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=6; [-w*0.3,0,w*0.3].forEach(lx=>{ctx.fillStyle='rgba(255,200,200,0.8)'; ctx.beginPath(); ctx.arc(lx,h*0.15,2,0,Math.PI*2); ctx.fill();});
  }
  ctx.restore();
};

const drawBullet = (ctx, b, enemy) => {
  ctx.save();
  if (enemy) {
    ctx.shadowColor='#f87171'; ctx.shadowBlur=12;
    const g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+16); g.addColorStop(0,'#fff'); g.addColorStop(0.3,'#f87171'); g.addColorStop(1,'rgba(248,113,113,0)'); ctx.fillStyle=g; fillRR(ctx,b.x-2.5,b.y,5,16,2.5);
  } else {
    ctx.shadowColor='#61DAFB'; ctx.shadowBlur=14;
    const g=ctx.createLinearGradient(b.x,b.y-18,b.x,b.y+2); g.addColorStop(0,'rgba(97,218,251,0)'); g.addColorStop(0.5,'#61DAFB'); g.addColorStop(1,'#fff'); ctx.fillStyle=g; fillRR(ctx,b.x-2,b.y-18,4,18,2);
  }
  ctx.restore();
};

/* ══════════════════════════════════
   COMPONENT
══════════════════════════════════ */
const SpaceShooter = ({ open, onClose }) => {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const stateRef   = useRef(null);
  const keysRef    = useRef({});
  const touchRef   = useRef({ active: false, x: 0 });
  const dimRef     = useRef({ W: 0, H: 0 });
  const starsRef   = useRef([]);
  const nebulasRef = useRef([]);
  const sfxRef     = useRef(null); // sound engine

  const [phase,      setPhase]      = useState('idle');
  const [uiScore,    setUiScore]    = useState(0);
  const [uiLives,    setUiLives]    = useState(3);
  const [uiWave,     setUiWave]     = useState(1);
  const [bestScore,  setBestScore]  = useState(() => parseInt(localStorage.getItem(BEST_KEY) || '0'));
  const [finalScore, setFinalScore] = useState(0);
  const [isNewBest,  setIsNewBest]  = useState(false);
  const [combo,      setCombo]      = useState(0);
  const [muted,      setMuted]      = useState(false);

  /* ── init sound engine on first interaction ── */
  const initSfx = useCallback(() => {
    if (!sfxRef.current) sfxRef.current = createSoundEngine();
  }, []);

  const sfx = useCallback((name, ...args) => {
    if (muted || !sfxRef.current) return;
    sfxRef.current[name]?.(...args);
  }, [muted]);

  /* ── resize ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    dimRef.current = { W: canvas.width, H: canvas.height };
    starsRef.current   = makeStars(canvas.width, canvas.height);
    nebulasRef.current = makeNebulas(canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (!open) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [open, resizeCanvas]);

  /* ── init state ── */
  const initState = useCallback(() => {
    const { W, H } = dimRef.current;
    return {
      player: makePlayer(W, H),
      bullets: [], enemyBullets: [], enemies: [], parts: [],
      score: 0, combo: 0, comboTimer: 0,
      wave: 1, frame: 0,
      spawnTimer: 0, spawnRate: 80, maxEnemies: 6,
      waveKills: 0, waveTarget: 10, waveCooldown: 0,
    };
  }, []);

  const startGame = useCallback(() => {
    initSfx();
    cancelAnimationFrame(rafRef.current);
    stateRef.current = initState();
    setUiScore(0); setUiLives(3); setUiWave(1); setCombo(0);
    setPhase('playing');
  }, [initState, initSfx]);

  /* ── background draw ── */
  const drawBg = useCallback((ctx, W, H) => {
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#000008'); bg.addColorStop(0.5,'#00000f'); bg.addColorStop(1,'#050008');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    nebulasRef.current.forEach(n => {
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,Math.max(n.rx,n.ry));
      g.addColorStop(0,`hsla(${n.hue},70%,50%,${n.o})`); g.addColorStop(1,'transparent');
      ctx.save(); ctx.scale(1,n.ry/n.rx); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(n.x,n.y*(n.rx/n.ry),n.rx,0,Math.PI*2); ctx.fill(); ctx.restore();
    });
    starsRef.current.forEach(s => {
      s.y+=s.speed; if(s.y>H){s.y=0;s.x=rand(0,W);}
      s.twinkle+=0.04;
      const op=s.o*(0.7+Math.sin(s.twinkle)*0.3);
      ctx.globalAlpha=op; ctx.fillStyle='#fff'; ctx.shadowColor='#fff'; ctx.shadowBlur=s.r>1.2?4:0;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    });
    ctx.globalAlpha=1;
  }, []);

  /* ── HUD draw ── */
  const drawHUD = useCallback((ctx, W, H, s) => {
    ctx.save();
    ctx.font='bold 22px "Courier New",monospace'; ctx.fillStyle='#61DAFB'; ctx.shadowColor='#61DAFB'; ctx.shadowBlur=12; ctx.textAlign='left';
    ctx.fillText(`SCORE  ${String(s.score).padStart(7,'0')}`,24,38);
    ctx.font='bold 16px "Courier New",monospace'; ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.shadowBlur=0; ctx.textAlign='center';
    ctx.fillText(`— WAVE ${s.wave} —`,W/2,36);
    ctx.font='13px "Courier New",monospace'; ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.textAlign='right';
    ctx.fillText(`BEST  ${String(parseInt(localStorage.getItem(BEST_KEY)||'0')).padStart(7,'0')}`,W-24,38);
    for(let i=0;i<3;i++){
      const lx=24+i*28, ly=H-28;
      ctx.save(); ctx.translate(lx,ly);
      if(i<s.player.lives){ctx.shadowColor='#61DAFB'; ctx.shadowBlur=8; ctx.fillStyle='#61DAFB';}
      else ctx.fillStyle='rgba(97,218,251,0.12)';
      ctx.beginPath(); ctx.moveTo(0,-9); ctx.lineTo(7,7); ctx.lineTo(0,3); ctx.lineTo(-7,7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    if(s.combo>=2){
      const ca=Math.min(1,s.comboTimer/40);
      ctx.globalAlpha=ca; ctx.font=`bold ${16+s.combo*2}px "Courier New",monospace`; ctx.fillStyle='#fbbf24'; ctx.shadowColor='#fbbf24'; ctx.shadowBlur=16; ctx.textAlign='right';
      ctx.fillText(`${s.combo}x COMBO!`,W-24,H-18); ctx.shadowBlur=0; ctx.globalAlpha=1;
    }
    if(s.waveCooldown>60){
      const wa=Math.min(1,(s.waveCooldown-60)/20); ctx.globalAlpha=wa;
      ctx.font='bold 40px "Courier New",monospace'; ctx.fillStyle='#61DAFB'; ctx.shadowColor='#61DAFB'; ctx.shadowBlur=30; ctx.textAlign='center';
      ctx.fillText(`WAVE ${s.wave}`,W/2,H/2-10);
      ctx.font='16px "Courier New",monospace'; ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.shadowBlur=0;
      ctx.fillText('GET READY',W/2,H/2+20); ctx.globalAlpha=1;
    }
    for(let sy=0;sy<H;sy+=4){ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fillRect(0,sy,W,1);}
    ctx.restore();
  }, []);

  /* ── game loop ── */
  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const tick = () => {
      const s = stateRef.current;
      if (!s) return;
      const { W, H } = dimRef.current;
      s.frame++;
      const k = s.player;

      /* movement */
      if (keysRef.current['ArrowLeft']  || keysRef.current['a'] || keysRef.current['A']) k.x = Math.max(k.w/2+8, k.x-k.speed);
      if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) k.x = Math.min(W-k.w/2-8, k.x+k.speed);
      if (keysRef.current['ArrowUp']    || keysRef.current['w'] || keysRef.current['W']) k.y = Math.max(H*0.35, k.y-k.speed);
      if (keysRef.current['ArrowDown']  || keysRef.current['s'] || keysRef.current['S']) k.y = Math.min(H-k.h/2-20, k.y+k.speed);
      if (touchRef.current.active) { k.x += (touchRef.current.x-k.x)*0.15; k.x=Math.max(k.w/2+8,Math.min(W-k.w/2-8,k.x)); }

      /* shoot */
      if (k.cooldown > 0) k.cooldown--;
      if ((keysRef.current[' '] || touchRef.current.active) && k.cooldown <= 0) {
        s.bullets.push({ x: k.x, y: k.y - k.h/2 });
        k.cooldown = 8;
        sfx('shoot');
      }
      if (k.invincible > 0) k.invincible--;
      if (k.shield > 0)     k.shield--;

      /* combo timer */
      if (s.comboTimer > 0) s.comboTimer--;
      else if (s.combo > 0) { s.combo = 0; setCombo(0); }

      /* spawn */
      if (s.waveCooldown > 0) s.waveCooldown--;
      else {
        s.spawnTimer++;
        if (s.spawnTimer >= s.spawnRate && s.enemies.length < s.maxEnemies) {
          s.enemies.push(makeEnemy(W, s.wave));
          s.spawnTimer = 0;
        }
      }

      /* bullets move */
      s.bullets      = s.bullets.map(b=>({...b,y:b.y-12})).filter(b=>b.y>-20);
      s.enemyBullets = s.enemyBullets.map(b=>({...b,x:b.x+(b.vx||0),y:b.y+(b.vy||4)})).filter(b=>b.y<H+20&&b.x>-20&&b.x<W+20);

      /* enemies move */
      s.enemies.forEach(e => {
        e.wobble += e.wobbleSpeed;
        e.y += e.speed;
        e.x = Math.max(e.w/2+8, Math.min(W-e.w/2-8, e.x+Math.sin(e.wobble)*1.4));
        e.rot += e.rotSpeed;
        if (e.shootTimer !== 999999) {
          e.shootTimer--;
          if (e.shootTimer <= 0) {
            const dx=k.x-e.x, dy=k.y-e.y, dist=Math.hypot(dx,dy)||1;
            s.enemyBullets.push({ x:e.x, y:e.y, vx:(dx/dist)*3.5, vy:(dy/dist)*3.5 });
            e.shootTimer = randInt(80,150);
            sfx('enemyShoot');
          }
        }
      });

      /* player bullets vs enemies */
      s.bullets = s.bullets.filter(b => {
        let hit = false;
        s.enemies = s.enemies.filter(e => {
          if (hit) return true;
          if (Math.abs(b.x-e.x)<e.w/2+4 && Math.abs(b.y-e.y)<e.h/2+4) {
            e.hp--; hit = true;
            if (e.hp <= 0) {
              s.parts.push(...makeParts(e.x, e.y, e.color, e.type==='tank'));
              e.type === 'tank' ? sfx('explodeBig') : sfx('explodeSmall');
              s.combo++;
              s.comboTimer = 55;
              s.score += e.points * Math.max(1, s.combo);
              s.waveKills++;
              if (s.combo >= 2) sfx('combo', s.combo);
              setUiScore(s.score);
              setCombo(s.combo);
              return false;
            }
          }
          return true;
        });
        return !hit;
      });

      /* enemy bullets vs player */
      if (k.invincible <= 0) {
        s.enemyBullets = s.enemyBullets.filter(b => {
          const hit = Math.abs(b.x-k.x)<k.w/2-4 && Math.abs(b.y-k.y)<k.h/2-4;
          if (hit) {
            if (k.shield > 0) { k.shield = 0; return false; }
            s.parts.push(...makeParts(k.x, k.y, '#61DAFB', false));
            sfx('playerHit');
            k.lives--; k.invincible = 130;
            setUiLives(k.lives);
          }
          return !hit;
        });
      }

      /* enemy collision + screen exit */
      if (k.invincible <= 0) {
        s.enemies = s.enemies.filter(e => {
          if (e.y > H+10) { if (k.invincible<=0){k.lives--;k.invincible=100;sfx('playerHit');setUiLives(k.lives);} return false; }
          const hit = Math.abs(e.x-k.x)<(e.w+k.w)/2-6 && Math.abs(e.y-k.y)<(e.h+k.h)/2-6;
          if (hit) {
            if (k.shield > 0) { k.shield=0; s.parts.push(...makeParts(e.x,e.y,e.color,true)); sfx('explodeBig'); return false; }
            s.parts.push(...makeParts(e.x,e.y,e.color,true)); sfx('explodeBig'); sfx('playerHit');
            k.lives--; k.invincible=130; setUiLives(k.lives); return false;
          }
          return true;
        });
      } else {
        s.enemies = s.enemies.filter(e => e.y <= H+10);
      }

      /* particles */
      s.parts = s.parts.map(p=>({...p,x:p.x+p.vx,y:p.y+p.vy,vy:p.vy+0.1,life:p.life-1})).filter(p=>p.life>0);

      /* wave up */
      if (s.waveKills >= s.waveTarget && s.waveCooldown <= 0) {
        s.wave++;
        s.waveKills=0; s.waveTarget=10+s.wave*3;
        s.spawnRate=Math.max(25,80-s.wave*7); s.maxEnemies=Math.min(14,6+s.wave);
        s.waveCooldown=100;
        sfx('waveClear');
        setUiWave(s.wave);
      }

      /* death */
      if (k.lives <= 0) {
        const best = parseInt(localStorage.getItem(BEST_KEY)||'0');
        const nb = s.score > best;
        if (nb) { localStorage.setItem(BEST_KEY,String(s.score)); setBestScore(s.score); }
        setFinalScore(s.score); setIsNewBest(nb);
        sfx('gameOver');
        if (nb) setTimeout(() => sfx('newBest'), 900);
        setPhase('dead');
        return;
      }

      /* draw */
      drawBg(ctx, W, H);
      s.enemyBullets.forEach(b=>drawBullet(ctx,b,true));
      s.bullets.forEach(b=>drawBullet(ctx,b,false));
      s.enemies.forEach(e=>drawEnemy(ctx,e,s.frame));
      drawPlayer(ctx,k,s.frame);
      s.parts.forEach(p=>{ctx.save();ctx.globalAlpha=p.life/p.maxLife;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();});
      drawHUD(ctx,W,H,s);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, drawBg, drawHUD, sfx]);

  /* ── idle loop ── */
  useEffect(() => {
    if (phase !== 'idle') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const loop = () => { const{W,H}=dimRef.current; drawBg(ctx,W,H); rafRef.current=requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, drawBg]);

  /* ── keys ── */
  useEffect(() => {
    if (!open) return;
    const dn = e => { keysRef.current[e.key]=true; if(e.key===' ')e.preventDefault(); };
    const up = e => { keysRef.current[e.key]=false; };
    window.addEventListener('keydown',dn); window.addEventListener('keyup',up);
    return () => { window.removeEventListener('keydown',dn); window.removeEventListener('keyup',up); };
  }, [open]);

  /* ── touch ── */
  const onTouch    = useCallback(e=>{e.preventDefault();const t=e.touches[0];touchRef.current={active:true,x:t.clientX};}, []);
  const onTouchEnd = useCallback(()=>{touchRef.current={active:false,x:0};}, []);

  /* ── mouse ── */
  const onMouseMove = useCallback(e=>{if(phase!=='playing'||!stateRef.current)return;stateRef.current.player.x=e.clientX;}, [phase]);
  const onMouseDown = useCallback(()=>{initSfx();if(stateRef.current)keysRef.current[' ']=true;}, [initSfx]);
  const onMouseUp   = useCallback(()=>{keysRef.current[' ']=false;}, []);

  /* ── reset on close ── */
  useEffect(() => {
    if (!open) { cancelAnimationFrame(rafRef.current); stateRef.current=null; keysRef.current={}; setPhase('idle'); }
  }, [open]);

  /* ── ESC ── */
  useEffect(() => {
    if (!open) return;
    const esc = e => { if(e.key==='Escape')onClose(); };
    window.addEventListener('keydown',esc);
    return () => window.removeEventListener('keydown',esc);
  }, [open, onClose]);

  return (
    <>
      <style>{`
        @keyframes ssGlow  {0%,100%{text-shadow:0 0 12px #61DAFB,0 0 28px #61DAFB;}50%{text-shadow:0 0 24px #61DAFB,0 0 56px #61DAFB,0 0 80px #61DAFB;}}
        @keyframes ssPulse {0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.45);opacity:0.4;}}
        @keyframes ssConf  {0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(-160px) rotate(720deg);opacity:0;}}
        @keyframes ssBlink {0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes ssBarMove{from{background-position:0% 0}to{background-position:200% 0}}
        .ss-full{position:fixed;inset:0;z-index:10001;background:#000;overflow:hidden;cursor:crosshair;}
        .ss-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;}
        .ss-scanline{position:absolute;inset:0;pointer-events:none;z-index:2;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);}
        .ss-vignette{position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.55) 100%);}
        .ss-esc{position:absolute;top:16px;right:20px;z-index:10;font-family:'Courier New',monospace;font-size:11px;color:rgba(255,255,255,0.2);letter-spacing:0.2em;pointer-events:none;}
        .ss-mute{position:absolute;top:14px;right:110px;z-index:10;font-family:'Courier New',monospace;font-size:11px;color:rgba(255,255,255,0.2);letter-spacing:0.15em;cursor:pointer;padding:4px 10px;border:1px solid rgba(255,255,255,0.1);border-radius:4px;background:rgba(255,255,255,0.03);transition:all 0.2s;user-select:none;}
        .ss-mute:hover{color:rgba(255,255,255,0.5);border-color:rgba(255,255,255,0.25);}
        .ss-screen{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;font-family:'Courier New',monospace;}
        .ss-title{font-size:clamp(36px,7vw,72px);font-weight:900;color:#61DAFB;letter-spacing:0.12em;text-transform:uppercase;animation:ssGlow 2s ease-in-out infinite;margin:0;line-height:1;}
        .ss-title-sub{font-size:clamp(11px,1.5vw,14px);letter-spacing:0.5em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin:12px 0 40px;}
        .ss-enemy-legend{display:flex;gap:clamp(16px,3vw,32px);margin-bottom:36px;flex-wrap:wrap;justify-content:center;}
        .ss-legend-item{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;letter-spacing:0.15em;color:rgba(255,255,255,0.4);}
        .ss-legend-dot{width:28px;height:14px;border-radius:3px;}
        .ss-best-line{font-size:13px;color:rgba(255,255,255,0.25);letter-spacing:0.2em;margin-bottom:32px;}
        .ss-best-line span{color:#61DAFB;}
        .ss-controls-row{display:flex;gap:clamp(12px,2vw,24px);margin-bottom:40px;flex-wrap:wrap;justify-content:center;}
        .ss-ctrl-item{font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.12em;display:flex;align-items:center;gap:7px;}
        .ss-ctrl-key{padding:3px 9px;border:1px solid rgba(97,218,251,0.3);border-radius:5px;color:#61DAFB;font-size:10px;background:rgba(97,218,251,0.06);}
        .ss-start-btn{position:relative;padding:0;border:none;background:none;cursor:pointer;outline:none;}
        .ss-start-ring{position:absolute;inset:-3px;border-radius:4px;background:linear-gradient(135deg,#61DAFB,#a78bfa,#61DAFB);background-size:200%;animation:ssBarMove 2s linear infinite;}
        .ss-start-inner{position:relative;padding:16px 52px;background:#000010;font-family:'Courier New',monospace;font-size:clamp(14px,2vw,18px);font-weight:900;letter-spacing:0.3em;text-transform:uppercase;color:#61DAFB;border-radius:3px;animation:ssGlow 1.5s ease-in-out infinite;display:flex;align-items:center;gap:12px;}
        .ss-blink{animation:ssBlink 1s step-end infinite;}
        .ss-go-label{font-size:clamp(13px,2vw,16px);letter-spacing:0.4em;color:#f87171;text-transform:uppercase;margin-bottom:12px;text-shadow:0 0 20px rgba(248,113,113,0.8);}
        .ss-go-score{font-size:clamp(56px,12vw,96px);font-weight:900;line-height:1;margin:0;background:linear-gradient(135deg,#61DAFB,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .ss-go-score-lbl{font-size:11px;letter-spacing:0.35em;color:rgba(255,255,255,0.18);margin:8px 0 20px;text-transform:uppercase;}
        .ss-new-best{display:inline-flex;align-items:center;gap:8px;padding:8px 22px;border-radius:3px;border:1px solid rgba(97,218,251,0.4);background:rgba(97,218,251,0.08);color:#61DAFB;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:24px;animation:ssPulse 1.5s ease-in-out infinite;}
        .ss-stat-row{display:flex;gap:20px;margin-bottom:32px;flex-wrap:wrap;justify-content:center;}
        .ss-stat{font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:0.15em;text-transform:uppercase;}
        .ss-stat span{color:rgba(255,255,255,0.6);}
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div className="ss-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
            <canvas ref={canvasRef} className="ss-canvas"
              onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}
              onTouchStart={onTouch} onTouchMove={onTouch} onTouchEnd={onTouchEnd}
            />
            <div className="ss-vignette"/>
            <div className="ss-scanline"/>
            <div className="ss-esc">ESC TO EXIT</div>

            {/* Mute toggle */}
            <div className="ss-mute" onClick={() => setMuted(m => !m)}>
              {muted ? '🔇 MUTED' : '🔊 SOUND'}
            </div>

            {/* START */}
            {phase === 'idle' && (
              <motion.div className="ss-screen" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
                <h1 className="ss-title">FAIZ DEFENDER</h1>
                <p className="ss-title-sub">Easter Egg · Hidden Mission</p>
                <div className="ss-enemy-legend">
                  {[{color:'#f87171',label:'SCOUT',pts:'10 PTS'},{color:'#fbbf24',label:'RAIDER',pts:'20 PTS'},{color:'#a78bfa',label:'DREAD',pts:'30 PTS'}].map(e=>(
                    <div key={e.label} className="ss-legend-item">
                      <div className="ss-legend-dot" style={{background:e.color,boxShadow:`0 0 10px ${e.color}`}}/>
                      <span>{e.label}</span>
                      <span style={{color:'rgba(255,255,255,0.2)'}}>{e.pts}</span>
                    </div>
                  ))}
                </div>
                <div className="ss-controls-row">
                  <div className="ss-ctrl-item"><span className="ss-ctrl-key">MOUSE</span>AIM+MOVE</div>
                  <div className="ss-ctrl-item"><span className="ss-ctrl-key">CLICK</span>SHOOT</div>
                  <div className="ss-ctrl-item"><span className="ss-ctrl-key">WASD</span>MOVE</div>
                  <div className="ss-ctrl-item"><span className="ss-ctrl-key">SPACE</span>SHOOT</div>
                  <div className="ss-ctrl-item"><span className="ss-ctrl-key">ESC</span>EXIT</div>
                </div>
                {bestScore > 0 && <div className="ss-best-line">BEST: <span>{String(bestScore).padStart(7,'0')}</span></div>}
                <button className="ss-start-btn" onClick={startGame}>
                  <div className="ss-start-ring"/>
                  <div className="ss-start-inner"><span className="ss-blink">▶</span>INSERT COIN</div>
                </button>
              </motion.div>
            )}

            {/* GAME OVER */}
            {phase === 'dead' && (
              <motion.div className="ss-screen" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.5}}>
                {isNewBest && (
                  <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
                    {Array.from({length:24}).map((_,i)=>(
                      <div key={i} style={{position:'absolute',left:`${3+(i*4)%93}%`,top:'68%',width:9,height:9,borderRadius:2,
                        background:['#61DAFB','#a78bfa','#4ade80','#fbbf24','#f87171'][i%5],
                        animation:`ssConf ${0.9+(i%5)*0.12}s ease-out ${i*0.04}s forwards`}}/>
                    ))}
                  </div>
                )}
                <div className="ss-go-label">— MISSION FAILED —</div>
                <p className="ss-go-score">{String(finalScore).padStart(7,'0')}</p>
                <p className="ss-go-score-lbl">FINAL SCORE</p>
                {isNewBest && <div className="ss-new-best">⭐ &nbsp; NEW HIGH SCORE</div>}
                <div className="ss-stat-row">
                  <div className="ss-stat">WAVE <span>{uiWave}</span></div>
                  <div className="ss-stat">RECORD <span>{String(bestScore).padStart(7,'0')}</span></div>
                </div>
                <button className="ss-start-btn" onClick={startGame}>
                  <div className="ss-start-ring"/>
                  <div className="ss-start-inner"><span className="ss-blink">↺</span>TRY AGAIN</div>
                </button>
                <div style={{marginTop:18,fontSize:11,color:'rgba(255,255,255,0.15)',letterSpacing:'0.2em',fontFamily:'Courier New,monospace',cursor:'pointer'}} onClick={onClose}>
                  [ ESC TO EXIT ]
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpaceShooter;