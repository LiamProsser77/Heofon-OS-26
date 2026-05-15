import { useState, useEffect } from 'react';
import Taskbar from './Taskbar';
import WindowFrame from './WindowFrame';
import DesktopIcons from './DesktopIcons';
import ContextMenu from './ContextMenu';
import { useWindows, AppId } from '@/hooks/useWindows';
import { DEFAULT_WALLPAPER, WALLPAPER_KEY } from '../constants/wallpaper';
import ClockApp from './apps/ClockApp';
import CalculatorApp from './apps/CalculatorApp';
import NotepadApp from './apps/NotepadApp';
import SettingsApp from './apps/SettingsApp';
import FileManagerApp from './apps/FileManagerApp';
import TerminalApp from './apps/TerminalApp';
import BrowserApp from './apps/BrowserApp';
import HeofonAI from './apps/HeofonAI';

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'clock':      return <ClockApp />;
    case 'calculator': return <CalculatorApp />;
    case 'notepad':    return <NotepadApp />;
    case 'settings':   return <SettingsApp />;
    case 'files':      return <FileManagerApp />;
    case 'terminal':   return <TerminalApp />;
    case 'browser':    return <BrowserApp />;
    case 'ai':         return <HeofonAI />;
    default:           return null;
  }
}

interface Props { onShutdown: () => void; }

export default function Desktop({ onShutdown }: Props) {
  const { windows, openApp, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindows();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wallpaper, setWallpaper] = useState(
    () => localStorage.getItem(WALLPAPER_KEY) || DEFAULT_WALLPAPER
  );
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fsHandler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fsHandler);
    return () => document.removeEventListener('fullscreenchange', fsHandler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => setWallpaper((e as CustomEvent).detail);
    window.addEventListener('heofon:wallpaper', handler);
    return () => window.removeEventListener('heofon:wallpaper', handler);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }

  const isGradient = wallpaper.startsWith('gradient:');
  const bgStyle = isGradient
    ? { background: wallpaper.slice(9) }
    : {
        backgroundImage: `url("${wallpaper}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col" style={bgStyle}
      onContextMenu={handleContextMenu}>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.22)' }} />

      <Taskbar
        onOpenApp={openApp} windows={windows}
        onFocusWindow={focusWindow} onMinimizeWindow={minimizeWindow}
        isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen}
        onShutdown={onShutdown}
      />

      <div className="flex-1 relative overflow-hidden">
        <DesktopIcons onOpenApp={openApp} />

        {windows.length === 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="text-xs drop-shadow" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Click icons to open apps · Right-click for options · Click <strong className="text-white/60">Heofon</strong> for app menu
            </p>
          </div>
        )}

        {windows.map(win => (
          <WindowFrame key={win.id} window={win}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}>
            <AppContent appId={win.appId} />
          </WindowFrame>
        ))}

        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x} y={ctxMenu.y}
            onClose={() => setCtxMenu(null)}
            onOpenApp={openApp}
          />
        )}
      </div>
    </div>
  );
}
