import { useState, useRef, useEffect, KeyboardEvent } from 'react';

type Line = { type: 'cmd' | 'out'; text: string };

const CMDS: Record<string, (args: string[]) => string> = {
  help:    () => 'Available: help  ls  pwd  whoami  echo  date  uname  clear  neofetch  uptime',
  ls:      () => 'Desktop/  Documents/  Downloads/  Music/  Pictures/  Videos/',
  pwd:     () => '/home/user',
  whoami:  () => 'user',
  date:    () => new Date().toUTCString(),
  uptime:  () => `up ${Math.floor(Math.random()*24)} hours, ${Math.floor(Math.random()*60)} minutes`,
  uname:   (a) => a[0] === '-a' ? 'Heofon heofon-machine 5.4.0-heofon #1 SMP x86_64 Heofon OS' : 'Heofon',
  echo:    (a) => a.join(' '),
  neofetch: () =>
`  ██╗  ██╗███████╗ ██████╗ ███████╗ ██████╗ ███╗  ██╗
  ██║  ██║██╔════╝██╔═══██╗██╔════╝██╔═══██╗████╗ ██║
  ███████║█████╗  ██║   ██║█████╗  ██║   ██║██╔██╗██║
  ██╔══██║██╔══╝  ██║   ██║██╔══╝  ██║   ██║██║╚████║
  ██║  ██║███████╗╚██████╔╝██║     ╚██████╔╝██║ ╚███║

  user@heofon-machine
  OS: Heofon OS 26 v2.0        Shell: hsh 3.1.0
  Kernel: 5.4.0-heofon         WM: Heofon Compositor
  CPU: Heofon Core i9 (8-core) Memory: 16.0 GB DDR5`,
};

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { type: 'out', text: 'Heofon OS 26 v2.0  —  Type "help" for available commands.' },
    { type: 'out', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);

  function run(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) { setLines(p => [...p, { type: 'cmd', text: '' }]); return; }
    const [name, ...args] = trimmed.split(/\s+/);
    setHistory(h => [trimmed, ...h].slice(0, 50));
    setHistIdx(-1);
    if (name === 'clear') { setLines([]); return; }
    const out = CMDS[name] ? CMDS[name](args) : `hsh: command not found: ${name}`;
    setLines(p => [...p, { type: 'cmd', text: trimmed }, { type: 'out', text: out }]);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { run(input); setInput(''); }
    if (e.key === 'ArrowUp') { const i = Math.min(histIdx + 1, history.length - 1); setHistIdx(i); setInput(history[i] ?? ''); }
    if (e.key === 'ArrowDown') { const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? '' : history[i]); }
  }

  return (
    <div className="h-full flex flex-col font-mono text-sm overflow-hidden cursor-text"
      style={{ background: '#020208', color: '#39d353' }}
      onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 overflow-auto p-4 space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', color: l.type === 'cmd' ? 'white' : '#39d353' }}>
            {l.type === 'cmd' && <span style={{ color: '#a78bfa' }}>user@heofon:~$ </span>}
            {l.text}
          </div>
        ))}
        <div className="flex items-center">
          <span style={{ color: '#a78bfa' }}>user@heofon:~$ </span>
          <input ref={inputRef} className="flex-1 bg-transparent outline-none text-white ml-1 caret-green-400"
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} autoFocus spellCheck={false} />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
