import { useState } from 'react';

export type AppId = 'clock' | 'calculator' | 'notepad' | 'settings' | 'files' | 'terminal' | 'browser' | 'ai';

export interface WindowData {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

const APP_CONFIG: Record<AppId, { title: string; width: number; height: number }> = {
  clock:      { title: 'Clock',        width: 300, height: 360 },
  calculator: { title: 'Calculator',   width: 300, height: 480 },
  notepad:    { title: 'Notepad',      width: 520, height: 420 },
  settings:   { title: 'Settings',     width: 620, height: 500 },
  files:      { title: 'File Manager', width: 580, height: 460 },
  terminal:   { title: 'Terminal',     width: 600, height: 400 },
  browser:    { title: 'Browser',      width: 720, height: 520 },
  ai:         { title: 'Heofonix AI',   width: 760, height: 560 },
};

let windowCounter = 0;

export function useWindows() {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [topZ, setTopZ] = useState(100);

  const openApp = (appId: AppId) => {
    const config = APP_CONFIG[appId];
    const id = `${appId}-${++windowCounter}`;
    const offset = (windowCounter % 10) * 28;
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows(prev => [...prev, {
      id, appId, title: config.title,
      x: 80 + offset, y: 20 + offset,
      width: config.width, height: config.height,
      minimized: false, maximized: false, zIndex: newZ,
    }]);
  };

  const closeWindow = (id: string) =>
    setWindows(prev => prev.filter(w => w.id !== id));

  const minimizeWindow = (id: string) =>
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w));

  const maximizeWindow = (id: string) =>
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));

  const focusWindow = (id: string) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ, minimized: false } : w));
  };

  return { windows, openApp, closeWindow, minimizeWindow, maximizeWindow, focusWindow };
}
