import { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Globe, ExternalLink, Search } from 'lucide-react';

const SEARCH_URL = 'https://heofonsearch.zite.so/';
const LOGO = 'https://images.fillout.com/orgid-694433/flowpublicid-default/widgetid-default/j2Eacq1ZryffDYsjesRueD/pasted-image-1778875945821-w1zyoun4.png';

const QUICK_LINKS = [
  { label: 'Heofon AI', href: 'https://heofonix-ai-com.zite.so/', letter: 'AI', color: '#7c3aed' },
  { label: 'GitHub',    href: 'https://github.com',               letter: 'G',  color: '#6366f1' },
  { label: 'YouTube',   href: 'https://youtube.com',              letter: 'Y',  color: '#ef4444' },
  { label: 'Wikipedia', href: 'https://wikipedia.org',            letter: 'W',  color: '#3b82f6' },
];

export default function BrowserApp() {
  const [input, setInput] = useState(SEARCH_URL);
  const [url, setUrl] = useState(SEARCH_URL);
  const [loaded, setLoaded] = useState(false);
  const [showHome, setShowHome] = useState(false);

  function navigate(target?: string) {
    const raw = target ?? input.trim();
    if (!raw) return;
    const dest = raw.startsWith('http') ? raw : `${SEARCH_URL}?q=${encodeURIComponent(raw)}`;
    setUrl(dest);
    setInput(dest);
    setLoaded(false);
    setShowHome(false);
  }

  function goHome() {
    setUrl(SEARCH_URL);
    setInput(SEARCH_URL);
    setLoaded(false);
    setShowHome(false);
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Nav bar */}
      <div className="flex items-center gap-1.5 px-2 py-2 border-b border-border shrink-0">
        <button onClick={goHome} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={() => { setLoaded(false); }} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder-muted-foreground"
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate()}
            onFocus={e => e.target.select()} />
          <button onClick={() => navigate()} className="text-primary hover:text-primary/80 transition-colors">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </a>
      </div>

      {/* Content */}
      {!showHome ? (
        <div className="flex-1 relative">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10"
              style={{ background: 'linear-gradient(135deg, #0a0818, #10082a)' }}>
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
          <iframe key={url} src={url} className="w-full h-full border-0"
            title="Heofon Browser" onLoad={() => setLoaded(true)}
            allow="clipboard-write; microphone" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8"
          style={{ background: 'linear-gradient(135deg, #0a0818 0%, #10082a 100%)' }}>
          <div className="flex flex-col items-center gap-2">
            <img src={LOGO} className="w-12 h-12 opacity-70" alt="" />
            <h2 className="text-xl font-semibold text-foreground">Heofon Browser</h2>
          </div>
          <div className="flex gap-3">
            {QUICK_LINKS.map(link => (
              <button key={link.label} onClick={() => navigate(link.href)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/8 transition-colors">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold shadow-lg"
                  style={{ background: link.color + '25', border: `1px solid ${link.color}40`, color: link.color }}>
                  {link.letter}
                </div>
                <span className="text-xs text-muted-foreground">{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
