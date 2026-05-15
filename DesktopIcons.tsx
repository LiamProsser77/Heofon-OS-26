import { Calculator, Clock, FileText, Settings, FolderOpen, Terminal, Globe, Cpu } from 'lucide-react';
import { AppId } from '@/hooks/useWindows';

const ICONS: { id: AppId; label: string; icon: any; bg: string; fg: string }[] = [
  { id: 'browser',    label: 'Browser',     icon: Globe,      bg: '#0d3322', fg: '#39d353' },
  { id: 'ai',         label: 'Heofonix AI', icon: Cpu,        bg: '#1a0842', fg: '#a78bfa' },
  { id: 'files',      label: 'Files',       icon: FolderOpen, bg: '#2e1e00', fg: '#f59e0b' },
  { id: 'notepad',    label: 'Notepad',     icon: FileText,   bg: '#0a2e1a', fg: '#34d399' },
  { id: 'terminal',   label: 'Terminal',    icon: Terminal,   bg: '#0a1230', fg: '#60a5fa' },
  { id: 'calculator', label: 'Calculator',  icon: Calculator, bg: '#1a1060', fg: '#a78bfa' },
  { id: 'clock',      label: 'Clock',       icon: Clock,      bg: '#1a0a40', fg: '#c084fc' },
  { id: 'settings',   label: 'Settings',    icon: Settings,   bg: '#1a1a2e', fg: '#94a3b8' },
];

export default function DesktopIcons({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-0.5 z-10">
      {ICONS.map(item => (
        <button
          key={item.id}
          onClick={(e) => { e.stopPropagation(); onOpenApp(item.id); }}
          className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all w-[72px] group"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95"
            style={{ background: item.bg, border: `1px solid ${item.fg}40` }}
          >
            <item.icon className="w-6 h-6" style={{ color: item.fg }} />
          </div>
          <span
            className="text-[11px] text-center font-medium leading-tight"
            style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
