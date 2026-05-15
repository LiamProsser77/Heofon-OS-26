import { useState, useEffect } from 'react';

export default function ClockApp() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const hDeg = (h % 12) / 12 * 360 + m / 60 * 30;
  const mDeg = m / 60 * 360 + s / 60 * 6;
  const sDeg = s / 60 * 360;
  const toXY = (deg: number, r: number) => ({
    x: 100 + r * Math.cos((deg - 90) * Math.PI / 180),
    y: 100 + r * Math.sin((deg - 90) * Math.PI / 180),
  });

  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-6"
      style={{ background: 'linear-gradient(135deg, #0a0818 0%, #10082a 100%)' }}>
      <svg viewBox="0 0 200 200" className="w-52 h-52">
        <defs>
          <radialGradient id="cface" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1045" />
            <stop offset="100%" stopColor="#0a0820" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="96" fill="url(#cface)" stroke="#7c3aed" strokeWidth="2" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="1" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * 6 - 90) * Math.PI / 180;
          const isHour = i % 5 === 0;
          const r1 = isHour ? 78 : 84, r2 = 90;
          return <line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)}
            x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)}
            stroke={isHour ? '#a78bfa' : 'rgba(167,139,250,0.3)'} strokeWidth={isHour ? 2 : 1} />;
        })}
        {/* Hour hand */}
        <line x1="100" y1="100" x2={toXY(hDeg, 52).x} y2={toXY(hDeg, 52).y}
          stroke="white" strokeWidth="5" strokeLinecap="round" />
        {/* Minute hand */}
        <line x1="100" y1="100" x2={toXY(mDeg, 68).x} y2={toXY(mDeg, 68).y}
          stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
        {/* Second hand */}
        <line x1={toXY(sDeg + 180, 18).x} y1={toXY(sDeg + 180, 18).y}
          x2={toXY(sDeg, 76).x} y2={toXY(sDeg, 76).y}
          stroke="#39d353" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="100" cy="100" r="5" fill="#39d353" />
        <circle cx="100" cy="100" r="2.5" fill="white" />
      </svg>
      <div className="text-center">
        <p className="text-4xl font-mono font-bold text-foreground">
          {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
