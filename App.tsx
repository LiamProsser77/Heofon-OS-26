import { useState } from 'react';
import StartupScreen from './components/StartupScreen';
import Desktop from './components/Desktop';
import ShutdownScreen from './components/ShutdownScreen';
import InstallBanner from './components/InstallBanner';

type Phase = 'startup' | 'desktop' | 'shutdown';

export default function App() {
  const [phase, setPhase] = useState<Phase>('startup');

  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      {phase === 'startup' && (
        <StartupScreen onComplete={() => setPhase('desktop')} />
      )}
      {phase === 'desktop' && (
        <Desktop onShutdown={() => setPhase('shutdown')} />
      )}
      {phase === 'shutdown' && (
        <ShutdownScreen onComplete={() => setPhase('startup')} />
      )}
      {phase === 'desktop' && <InstallBanner />}
    </div>
  );
}
