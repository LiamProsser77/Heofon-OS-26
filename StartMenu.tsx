import { motion } from 'framer-motion';
import { Calculator, Clock, FileText, Settings, FolderOpen, Terminal, Globe, Cpu, Power, User } from 'lucide-react';
import { AppId } from '@/hooks/useWindows';

const APPS: { id: AppId; label: string; icon: any; bg: string; fg: string }[] = [
  { id: 'browser',    label: 'Browser',     icon: Globe,      bg: '#0d3322', fg: '#39d353' },
  { id: 'ai',         label: 'Heofonix AI', icon: Cpu,        bg: '#1a0842', fg: '#a78bfa' },
  { id: 'files',      label: 'Files',       icon: FolderOpen, bg: '#2e1e00', fg: '#f59e0b' },
  { id: 'notepad',    label: 'Notepad',     icon: FileText,   bg: '#0a2e1a', fg: '#34d399' },
  { id: 'terminal',   label: 'Terminal',    icon: Terminal,   bg: '#0a1230', fg: '#60a5fa' },
  { id: 'calculator', label: 'Calculator',  icon: Calculator, bg: '#1a1060', fg: '#a78bfa' },
  { id: 'clock',      label: 'Clock',       icon: Clock,      bg: '#1a0a40', fg: '#c084fc' },
  { id: 'settings',   label: 'Settings',    icon: Settings,   bg: '#1a1a2e', fg: '#94a3b8' },
];

interface Props {
  onOpenApp: (id: AppId) => void;
  onClose: () => void;
  onShutdown: () => void;
}

export default function StartMenu({ onOpenApp, onClose, onShutdown }: Props) {
  return (
    <>
      <div className="fixed inset-0 z-[900]" onClick={onClose} />
      <motion.div
        className="fixed top-10 left-0 z-[1000] w-72 border border-border rounded-br-2xl overflow-hidden shadow-2xl"
        style={{ background: 'rgba(10,8,30,0.96)', backdropFilter: 'blur(24px)' }}
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}>

        {/* User bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/30">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">User</p>
            <p className="text-xs text-muted-foreground">Heofon OS 26 v2.0</p>
          </div>
        </div>

        {/* App grid */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 px-1">Applications</p>
          <div className="grid grid-cols-3 gap-1">
            {APPS.map(app => (
              <button key={app.id} onClick={() => { onOpenApp(app.id); onClose(); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: app.bg, border: `1px solid ${app.fg}25` }}>
                  <app.icon className="w-5 h-5" style={{ color: app.fg }} />
                </div>
                <span className="text-xs text-foreground/80 font-medium">{app.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
          <span className="text-xs text-muted-foreground">Heofon OS 26</span>
          <button
            onClick={() => { onClose(); onShutdown(); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <Power className="w-3.5 h-3.5" /> Shut Down
          </button>
        </div>
      </motion.div>
    </>
  );
}
