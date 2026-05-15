import { useState } from 'react';
import { Wifi, Battery, Volume2, Maximize2, Minimize2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import StartMenu from './StartMenu';
import { AppId, WindowData } from '@/hooks/useWindows';
import { useTime } from '@/hooks/useTime';

const LOGO = 'https://images.fillout.com/orgid-694433/flowpublicid-default/widgetid-default/j2Eacq1ZryffDYsjesRueD/pasted-image-1778875945821-w1zyoun4.png';

interface Props {
  onOpenApp: (id: AppId) => void;
  windows: WindowData[];
  onFocusWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onShutdown: () => void;
}

export default function Taskbar({ onOpenApp, windows, onFocusWindow, onMinimizeWindow, isFullscreen, onToggleFullscreen, onShutdown }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { time, date } = useTime();

  function handleWindowClick(w: WindowData) {
    if (w.minimized) onFocusWindow(w.id);
    else onMinimizeWindow(w.id);
  }

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <StartMenu
            onOpenApp={onOpenApp}
            onClose={() => setMenuOpen(false)}
            onShutdown={onShutdown}
          />
        )}
      </AnimatePresence>

      <div className="relative z-50 w-full flex items-center justify-between px-2 shrink-0 border-b border-border"
        style={{ height: 40, background: 'rgba(8,6,24,0.95)', backdropFilter: 'blur(16px)' }}>

        {/* Left: logo + open windows */}
        <div className="flex items-center gap-1 overflow-hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all ${menuOpen ? 'bg-primary/20' : 'hover:bg-white/10'}`}>
            <img src={LOGO} className="w-5 h-5 object-contain" alt="" />
            <span className="text-sm font-bold text-foreground">Heofon</span>
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex items-center gap-1 overflow-x-auto">
            {windows.map(w => (
              <button key={w.id} onClick={() => handleWindowClick(w)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  w.minimized
                    ? 'text-foreground/40 hover:bg-white/5'
                    : 'bg-primary/20 text-primary border border-primary/30'}`}>
                {w.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right: system tray */}
        <div className="flex items-center gap-2 shrink-0 pl-2">
          <Wifi className="w-3.5 h-3.5 text-foreground/50" />
          <Volume2 className="w-3.5 h-3.5 text-foreground/50" />
          <Battery className="w-3.5 h-3.5 text-foreground/50" />
          <button onClick={onToggleFullscreen} className="p-1 rounded hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            {isFullscreen
              ? <Minimize2 className="w-3.5 h-3.5 text-foreground/50" />
              : <Maximize2 className="w-3.5 h-3.5 text-foreground/50" />}
          </button>
          <div className="text-right ml-1">
            <p className="text-xs font-semibold text-foreground leading-tight">{time}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{date}</p>
          </div>
        </div>
      </div>
    </>
  );
}
