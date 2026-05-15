import { useState, useEffect } from 'react';

const LOGO = 'https://images.fillout.com/orgid-694433/flowpublicid-default/widgetid-default/j2Eacq1ZryffDYsjesRueD/pasted-image-1778875945821-w1zyoun4.png';

function playStartupSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    function note(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + start;
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.07);
      gain.gain.setValueAtTime(vol, t + dur - 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }

    // Warm opening pad — C major chord
    note(130.81, 0,    2.0, 'sine',     0.06); // C3
    note(196.00, 0,    2.0, 'sine',     0.05); // G3
    note(261.63, 0,    2.0, 'triangle', 0.04); // C4

    // Rising melody
    note(523.25, 0.05, 0.38, 'sine', 0.15); // C5
    note(659.25, 0.32, 0.38, 'sine', 0.15); // E5
    note(783.99, 0.60, 0.38, 'sine', 0.13); // G5
    note(1046.5, 0.92, 0.55, 'sine', 0.11); // C6

    // Bright finish note
    note(1318.5, 1.35, 1.1, 'sine', 0.20); // E6

    // Soft chord harmony under the melody
    note(392.00, 0.60, 1.6, 'triangle', 0.05); // G4
    note(523.25, 0.60, 1.6, 'triangle', 0.04); // C5
    note(659.25, 0.60, 1.6, 'triangle', 0.04); // E5
  } catch (_) {}
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  size: (((i * 7 + 3) % 3) + 1),
  left: ((i * 137.5) % 100),
  top: ((i * 97.3) % 100),
  opacity: ((i * 53) % 6) / 10 + 0.1,
}));

export default function StartupScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'booting'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Loading kernel…');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 600);
    return () => clearInterval(id);
  }, []);

  function startBoot() {
    if (phase !== 'idle') return;
    playStartupSound();
    setPhase('booting');
    const start = Date.now();
    const duration = 3200;
    const id = setInterval(() => {
      const p = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(p);
      if (p < 30) setStatusText('Loading kernel…');
      else if (p < 60) setStatusText('Starting services…');
      else if (p < 90) setStatusText('Preparing desktop…');
      else setStatusText('Almost ready…');
      if (p >= 100) { clearInterval(id); setTimeout(onComplete, 400); }
    }, 30);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') startBoot();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 60%, #1a0842 0%, #080618 50%, #030310 100%)' }}
      onClick={startBoot}>
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(s => (
          <div key={s.id} className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <img src={LOGO} alt="Heofon OS" className="w-28 h-28 mb-4 drop-shadow-2xl"
          style={{ animation: 'fadeIn 1s ease-out forwards' }} />
        <h1 className="text-5xl font-bold text-white tracking-tight"
          style={{ animation: 'fadeIn 0.7s 0.4s ease-out both' }}>Heofon OS</h1>
        <p className="text-sm font-medium mb-8 text-primary"
          style={{ animation: 'fadeIn 0.7s 0.8s ease-out both' }}>Version 26 · Release 2.0</p>

        {phase === 'idle' && (
          <p className="text-sm font-medium tracking-widest uppercase"
            style={{ color: blink ? 'rgba(167,139,250,0.9)' : 'rgba(167,139,250,0.2)',
              transition: 'color 0.3s', animation: 'fadeIn 0.5s 1.2s ease-out both' }}>
            Press Enter or click anywhere to boot
          </p>
        )}

        {phase === 'booting' && (
          <div className="w-64 flex flex-col gap-3 mt-2">
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-75"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #39d353)' }} />
            </div>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{statusText}</p>
          </div>
        )}
      </div>

      <p className="absolute bottom-6 text-xs pointer-events-none" style={{ color: 'rgba(255,255,255,0.15)' }}>
        © 2026 Heofon Systems · All rights reserved
      </p>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
}
