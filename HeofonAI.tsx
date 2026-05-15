import { useState } from 'react';
import { ExternalLink, Cpu } from 'lucide-react';

const AI_URL = 'https://heofonix-ai-com.zite.so/';

export default function HeofonAI() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Heofonix AI</span>
          <span className="text-xs text-muted-foreground">{AI_URL}</span>
        </div>
        <a href={AI_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          Open in Browser
        </a>
      </div>

      {/* iframe */}
      {!errored ? (
        <div className="flex-1 relative">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: 'linear-gradient(135deg, #0a0818, #10082a)' }}>
              <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground text-sm">Loading Heofon AI…</p>
            </div>
          )}
          <iframe src={AI_URL} className="w-full h-full border-0"
            title="Heofon AI"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            allow="microphone; camera; clipboard-write"
            style={{ display: loaded ? 'block' : 'block' }} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8"
          style={{ background: 'linear-gradient(135deg, #0a0818, #10082a)' }}>
          <Cpu className="w-16 h-16 text-primary opacity-60" />
          <h3 className="text-xl font-semibold text-foreground">Heofonix AI</h3>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            The AI assistant couldn't be embedded. Click below to open it in your browser.
          </p>
          <a href={AI_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-medium text-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #39d353)' }}>
            <ExternalLink className="w-4 h-4" />
            Open Heofon AI
          </a>
        </div>
      )}
    </div>
  );
}
