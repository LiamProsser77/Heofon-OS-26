import { useState } from 'react';
import { Folder, FolderOpen, FileText, Image, Music, Film, ChevronRight, ChevronDown, Home } from 'lucide-react';

const FS: any = {
  name: 'Home', type: 'dir', children: [
    { name: 'Desktop', type: 'dir', children: [
      { name: 'README.txt', type: 'txt', size: '1 KB' },
      { name: 'heofon-2.0.lnk', type: 'lnk', size: '512 B' },
    ]},
    { name: 'Documents', type: 'dir', children: [
      { name: 'heofon-notes.txt', type: 'txt', size: '4 KB' },
      { name: 'budget-2026.txt', type: 'txt', size: '8 KB' },
      { name: 'Projects', type: 'dir', children: [
        { name: 'report.pdf', type: 'pdf', size: '128 KB' },
        { name: 'design.sketch', type: 'file', size: '2.1 MB' },
      ]},
    ]},
    { name: 'Downloads', type: 'dir', children: [
      { name: 'heofon-26-2.0.iso', type: 'file', size: '1.2 GB' },
      { name: 'wallpaper.png', type: 'img', size: '4.5 MB' },
    ]},
    { name: 'Pictures', type: 'dir', children: [
      { name: 'screenshot-001.png', type: 'img', size: '2.1 MB' },
    ]},
    { name: 'Music', type: 'dir', children: [
      { name: 'heofon-theme.mp3', type: 'audio', size: '3.4 MB' },
    ]},
    { name: 'Videos', type: 'dir', children: [
      { name: 'heofon-demo.mp4', type: 'video', size: '156 MB' },
    ]},
  ],
};

const fileIcon = (type: string) => {
  if (type === 'img') return <Image className="w-4 h-4 shrink-0" style={{ color: '#f472b6' }} />;
  if (type === 'audio') return <Music className="w-4 h-4 shrink-0" style={{ color: '#34d399' }} />;
  if (type === 'video') return <Film className="w-4 h-4 shrink-0" style={{ color: '#fb923c' }} />;
  return <FileText className="w-4 h-4 shrink-0 text-blue-300" />;
};

function TreeNode({ node, depth = 0 }: { node: any; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const isDir = node.type === 'dir';
  return (
    <div>
      <div className="flex items-center gap-1 py-1 hover:bg-white/8 rounded cursor-pointer text-sm transition-colors"
        style={{ paddingLeft: `${8 + depth * 16}px`, paddingRight: 8 }}
        onClick={() => isDir && setOpen(!open)}>
        {isDir ? (
          <>
            {open ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
            {open ? <FolderOpen className="w-4 h-4 shrink-0" style={{ color: '#fbbf24' }} /> : <Folder className="w-4 h-4 shrink-0" style={{ color: '#fbbf24' }} />}
          </>
        ) : (
          <><span className="w-4 shrink-0" />{fileIcon(node.type)}</>
        )}
        <span className={`flex-1 ${isDir ? 'text-foreground font-medium' : 'text-foreground/75'}`}>{node.name}</span>
        {node.size && <span className="text-xs text-muted-foreground">{node.size}</span>}
      </div>
      {isDir && open && node.children?.map((c: any, i: number) => <TreeNode key={i} node={c} depth={depth + 1} />)}
    </div>
  );
}

export default function FileManagerApp() {
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border shrink-0">
        <Home className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">/home/user</span>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <TreeNode node={FS} />
      </div>
      <div className="px-4 py-1.5 border-t border-border text-xs text-muted-foreground">
        6 items · 1.4 GB used of 512 GB
      </div>
    </div>
  );
}
