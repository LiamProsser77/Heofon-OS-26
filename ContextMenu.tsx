import { useEffect, useRef } from 'react';
import { RefreshCw, Download, Bot, Image, Settings, FolderOpen, Terminal, FileDown, Info } from 'lucide-react';
import { AppId } from '@/hooks/useWindows';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
}

type MenuItem =
  | { type: 'item'; label: string; icon: any; action: () => void; danger?: boolean }
  | { type: 'separator' };

export default function ContextMenu({ x, y, onClose, onOpenApp }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Adjust position to stay within viewport
  const safeX = Math.min(x, window.innerWidth - 220);
  const safeY = Math.min(y, window.innerHeight - 320);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    setTimeout(() => {
      window.addEventListener('mousedown', handler);
      window.addEventListener('keydown', keyHandler);
    }, 10);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  const items: MenuItem[] = [
    {
      type: 'item', label: 'Reload', icon: RefreshCw,
      action: () => { onClose(); window.location.reload(); },
    },
    { type: 'separator' },
    {
      type: 'item', label: 'Install Heofon OS', icon: Download,
      action: () => { onClose(); window.dispatchEvent(new CustomEvent('heofon:trigger-install')); },
    },
    {
      type: 'item', label: 'Ask Heofonix AI', icon: Bot,
      action: () => { onClose(); onOpenApp('ai'); },
    },
    { type: 'separator' },
    {
      type: 'item', label: 'Change Wallpaper', icon: Image,
      action: () => { onClose(); onOpenApp('settings'); window.dispatchEvent(new CustomEvent('heofon:settings-section', { detail: 'wallpaper' })); },
    },
    {
      type: 'item', label: 'Display Settings', icon: Settings,
      action: () => { onClose(); onOpenApp('settings'); },
    },
    {
      type: 'item', label: 'Open File Manager', icon: FolderOpen,
      action: () => { onClose(); onOpenApp('files'); },
    },
    {
      type: 'item', label: 'Open Terminal', icon: Terminal,
      action: () => { onClose(); onOpenApp('terminal'); },
    },
    { type: 'separator' },
    {
      type: 'item', label: 'Download as App', icon: Download,
      action: () => {
        onClose();
        window.dispatchEvent(new CustomEvent('heofon:trigger-install'));
      },
    },
    {
      type: 'item', label: 'Save As PDF', icon: FileDown,
      action: () => { onClose(); window.print(); },
    },
    { type: 'separator' },
    {
      type: 'item', label: 'About Heofon OS 26', icon: Info,
      action: () => { onClose(); onOpenApp('settings'); },
    },
  ];

  return (
    <div ref={ref}
      className="fixed z-[9000] w-52 rounded-xl overflow-hidden border border-border shadow-2xl py-1"
      style={{ left: safeX, top: safeY, background: 'rgba(12,9,32,0.97)', backdropFilter: 'blur(20px)' }}>
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="my-1 border-t border-border/50" />;
        }
        return (
          <button key={i} onClick={item.action}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-primary/20 ${item.danger ? 'text-destructive' : 'text-foreground/80 hover:text-foreground'}`}>
            <item.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
