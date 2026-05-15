import { useState, useEffect } from 'react';
import { Monitor, Volume2, Wifi, Shield, Info, Cpu, Image } from 'lucide-react';
import { DEFAULT_WALLPAPER, WALLPAPER_KEY } from '../../constants/wallpaper';

const LOGO = 'https://images.fillout.com/orgid-694433/flowpublicid-default/widgetid-default/j2Eacq1ZryffDYsjesRueD/pasted-image-1778875945821-w1zyoun4.png';

const WALLPAPERS = [
  {
    id: 'heofon26',
    label: 'Heofon OS 26',
    value: 'https://images.fillout.com/orgid-694433/flowpublicid-aiblteb1zy/widgetid-default/i7wbMsdjD116Yz9sGg44zj/pasted-image-1778878377568-dvabifh5.png',
  },
  { id: 'nebula',   label: 'Nebula',   value: 'gradient:radial-gradient(ellipse at 20% 80%, #1a0842 0%, #0c0828 40%, #030310 100%)' },
  { id: 'midnight', label: 'Midnight', value: 'gradient:linear-gradient(135deg, #0a0818 0%, #1a0d3b 50%, #0a1628 100%)' },
  { id: 'aurora',   label: 'Aurora',   value: 'gradient:linear-gradient(160deg, #0d1117 0%, #0d2b45 40%, #0a3d2e 100%)' },
  { id: 'cosmic',   label: 'Cosmic',   value: 'gradient:radial-gradient(ellipse at 60% 40%, #2d1b69 0%, #11111b 60%)' },
];

const SECTIONS = [
  { id: 'about',    label: 'About',     icon: Info    },
  { id: 'display',  label: 'Display',   icon: Monitor },
  { id: 'wallpaper',label: 'Wallpaper', icon: Image   },
  { id: 'sound',    label: 'Sound',     icon: Volume2 },
  { id: 'network',  label: 'Network',   icon: Wifi    },
  { id: 'security', label: 'Security',  icon: Shield  },
  { id: 'system',   label: 'System',    icon: Cpu     },
];

const SPECS = [
  ['OS Name', 'Heofon OS 26'], ['Version', '2.0 (Build 26.0.0)'],
  ['Kernel', 'Heofon 5.4.0'], ['Architecture', 'x86_64'],
  ['Memory', '16.0 GB DDR5'], ['Processor', 'Heofon Core i9 × 8'],
  ['Storage', '512 GB NVMe'], ['Graphics', 'Heofon GPU 8 GB'],
];

function applyWallpaper(value: string) {
  localStorage.setItem(WALLPAPER_KEY, value);
  window.dispatchEvent(new CustomEvent('heofon:wallpaper', { detail: value }));
}

export default function SettingsApp() {
  const [active, setActive] = useState('about');
  const [vol, setVol] = useState(75);
  const [brightness, setBrightness] = useState(80);
  const [darkMode, setDarkMode] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [currentWallpaper, setCurrentWallpaper] = useState(
    () => localStorage.getItem(WALLPAPER_KEY) || DEFAULT_WALLPAPER
  );

  // Listen for context-menu shortcut to jump to wallpaper section
  useEffect(() => {
    const handler = (e: Event) => setActive((e as CustomEvent).detail || 'wallpaper');
    window.addEventListener('heofon:settings-section', handler);
    return () => window.removeEventListener('heofon:settings-section', handler);
  }, []);

  function handleWallpaper(value: string) {
    setCurrentWallpaper(value);
    applyWallpaper(value);
  }

  return (
    <div className="h-full flex bg-card">
      <nav className="w-44 shrink-0 border-r border-border py-2">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
              active === s.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <s.icon className="w-4 h-4 shrink-0" />
            {s.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 p-6 overflow-auto">
        {active === 'about' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src={LOGO} className="w-16 h-16" alt="" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Heofon OS 26</h2>
                <p className="text-muted-foreground text-sm">Version 2.0 (Build 26.0.0)</p>
              </div>
            </div>
            {SPECS.map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-border">
                <span className="text-muted-foreground text-sm">{k}</span>
                <span className="text-sm text-foreground">{v}</span>
              </div>
            ))}
          </div>
        )}

        {active === 'wallpaper' && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Wallpaper</h3>
            <div className="grid grid-cols-2 gap-3">
              {WALLPAPERS.map(w => {
                const isActive = currentWallpaper === w.value;
                const isImg = !w.value.startsWith('gradient:');
                return (
                  <button key={w.id} onClick={() => handleWallpaper(w.value)}
                    className={`relative rounded-xl overflow-hidden h-24 transition-all border-2 ${
                      isActive ? 'border-primary scale-105 shadow-lg shadow-primary/30' : 'border-transparent hover:border-border'}`}>
                    {isImg
                      ? <img src={w.value} className="w-full h-full object-cover" alt={w.label} />
                      : <div className="w-full h-full" style={{ background: w.value.slice(9) }} />}
                    <div className="absolute inset-0 flex items-end p-2"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                      <span className="text-white text-xs font-medium drop-shadow">{w.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg viewBox="0 0 10 10" className="w-3 h-3">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {active === 'display' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Display</h3>
            <SliderSetting label="Brightness" value={brightness} onChange={setBrightness} />
            <ToggleSetting label="Dark Mode" value={darkMode} onChange={setDarkMode} />
          </div>
        )}

        {active === 'sound' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Sound</h3>
            <SliderSetting label="Volume" value={vol} onChange={setVol} />
          </div>
        )}

        {active === 'network' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Network</h3>
            <ToggleSetting label="Wi-Fi" value={wifi} onChange={setWifi} />
            {wifi && <div className="p-3 rounded-lg bg-secondary text-sm text-foreground">Connected to <strong>Heofon-Net</strong></div>}
          </div>
        )}

        {(active === 'security' || active === 'system') && (
          <p className="text-muted-foreground text-sm mt-2">No configurable settings available.</p>
        )}
      </div>
    </div>
  );
}

function SliderSetting({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={e => onChange(+e.target.value)} className="w-full accent-primary" />
    </div>
  );
}

function ToggleSetting({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-secondary'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
