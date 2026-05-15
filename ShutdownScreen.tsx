import { useEffect } from 'react';

const LOGO = 'https://images.fillout.com/orgid-694433/flowpublicid-default/widgetid-default/j2Eacq1ZryffDYsjesRueD/pasted-image-1778875945821-w1zyoun4.png';

export default function ShutdownScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2800);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: '#000', animation: 'fadeIn 0.4s ease-out' }}>
      <img src={LOGO} className="w-16 h-16 opacity-40" alt="" />
      <div className="flex flex-col items-center gap-3">
        <p className="text-white/70 text-lg font-light tracking-wide">Shutting down…</p>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
              style={{ animation: `pulse 1.2s ${i * 0.4}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
      <p className="text-white/20 text-xs absolute bottom-6">© 2026 Heofon Systems</p>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:.8} }
      `}</style>
    </div>
  );
}
