import { useState, useRef, useCallback } from 'react';
import { WindowData } from '@/hooks/useWindows';

interface Props {
  window: WindowData;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

/** Pure pointer-event drag — no framer-motion, nothing can block clicks */
function useDraggable(initX: number, initY: number) {
  const posRef = useRef({ x: initX, y: initY });
  const [pos, setPos] = useState({ x: initX, y: initY });

  const onDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    const ox = posRef.current.x, oy = posRef.current.y;

    const move = (ev: PointerEvent) => {
      const next = { x: ox + ev.clientX - sx, y: Math.max(0, oy + ev.clientY - sy) };
      posRef.current = next;
      setPos(next);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, []);

  return { pos, onDragStart };
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 10 10" className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <line x1="2.5" y1="2.5" x2="7.5" y2="7.5" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7.5" y1="2.5" x2="2.5" y2="7.5" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function MinimizeIcon() {
  return (
    <svg viewBox="0 0 10 10" className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <line x1="2" y1="5" x2="8" y2="5" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function MaximizeIcon() {
  return (
    <svg viewBox="0 0 10 10" className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="#14532d" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

function TitleBar({ title, onClose, onMinimize, onMaximize, onDragStart }: {
  title: string; onClose: () => void; onMinimize: () => void;
  onMaximize: () => void; onDragStart?: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      className="relative flex items-center px-3 py-2 shrink-0 border-b border-border select-none"
      style={{ background: 'rgba(14,11,38,0.98)', backdropFilter: 'blur(8px)', cursor: 'move' }}
      onPointerDown={onDragStart}
    >
      <div className="flex items-center gap-2 z-10">
        <button onPointerDown={e => e.stopPropagation()} onClick={onClose}
          className="group w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: '#ef4444', boxShadow: '0 0 5px rgba(239,68,68,0.5)' }}>
          <CloseIcon />
        </button>
        <button onPointerDown={e => e.stopPropagation()} onClick={onMinimize}
          className="group w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: '#f59e0b', boxShadow: '0 0 5px rgba(245,158,11,0.5)' }}>
          <MinimizeIcon />
        </button>
        <button onPointerDown={e => e.stopPropagation()} onClick={onMaximize}
          className="group w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: '#10b981', boxShadow: '0 0 5px rgba(16,185,129,0.5)' }}>
          <MaximizeIcon />
        </button>
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-xs text-foreground/60 font-medium pointer-events-none">
        {title}
      </span>
    </div>
  );
}

export default function WindowFrame({ window: win, children, onClose, onMinimize, onMaximize, onFocus }: Props) {
  const { pos, onDragStart } = useDraggable(win.x, win.y);

  if (win.minimized) return null;

  if (win.maximized) {
    return (
      <div
        className="absolute inset-0 flex flex-col overflow-hidden shadow-2xl"
        style={{ zIndex: win.zIndex, border: '1px solid rgba(124,58,237,0.3)' }}
        onPointerDown={onFocus}
      >
        <TitleBar title={win.title} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
        <div className="flex-1 overflow-auto bg-card">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="absolute flex flex-col rounded-xl overflow-hidden shadow-2xl"
      style={{
        left: pos.x, top: pos.y,
        width: win.width, height: win.height,
        zIndex: win.zIndex,
        border: '1px solid rgba(124,58,237,0.3)',
      }}
      onPointerDown={onFocus}
    >
      <TitleBar
        title={win.title}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onDragStart={onDragStart}
      />
      <div className="flex-1 overflow-auto bg-card">{children}</div>
    </div>
  );
}
