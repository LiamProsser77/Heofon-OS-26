import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function useIsPwaMode() {
  const [isPwa, setIsPwa] = useState(false);
  useEffect(() => {
    const sa = window.matchMedia('(display-mode: standalone)');
    const fs = window.matchMedia('(display-mode: fullscreen)');
    const update = () => setIsPwa(sa.matches || fs.matches || (navigator as any).standalone === true);
    update();
    sa.addEventListener('change', update);
    fs.addEventListener('change', update);
    return () => { sa.removeEventListener('change', update); fs.removeEventListener('change', update); };
  }, []);
  return isPwa;
}

const LOGO = 'https://images.fillout.com/orgid-694433/flowpublicid-default/widgetid-default/j2Eacq1ZryffDYsjesRueD/pasted-image-1778875945821-w1zyoun4.png';

export default function InstallBanner() {
  const isPwa = useIsPwaMode();
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem('heofon-install-dismissed'));
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Context menu can trigger the install prompt
  useEffect(() => {
    const handler = () => { setDismissed(false); handleInstall(); };
    window.addEventListener('heofon:trigger-install', handler);
    return () => window.removeEventListener('heofon:trigger-install', handler);
  }, [prompt]);

  if (isPwa || dismissed) return null;

  async function handleInstall() {
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      setDismissed(true);
    }
  }

  function dismiss() {
    localStorage.setItem('heofon-install-dismissed', '1');
    setDismissed(true);
  }

  const ua = navigator.userAgent.toLowerCase();
  const isChromebook = ua.includes('cros');
  const instructions = isChromebook
    ? 'Click the install icon (⊕) in the address bar to install Heofon OS on your Chromebook.'
    : 'Use the install button in your browser address bar, or click Install below.';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[min(92vw,420px)]">
      <div className="rounded-2xl border border-border shadow-2xl overflow-hidden"
        style={{ background: 'rgba(14,11,38,0.97)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-start gap-4 p-4">
          <img src={LOGO} className="w-12 h-12 rounded-xl shrink-0" alt="" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm">Install Heofon OS 26</p>
            <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{instructions}</p>
          </div>
          <button onClick={dismiss} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          {prompt ? (
            <button onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #39d353)' }}>
              <Download className="w-4 h-4" />
              Install on {isChromebook ? 'Chromebook' : 'Device'}
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-xl bg-secondary text-xs text-muted-foreground">
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              {isChromebook ? 'Look for ⊕ in the Chrome address bar' : 'Look for the install icon in your browser address bar'}
            </div>
          )}
          <button onClick={dismiss}
            className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
