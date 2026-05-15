import { useState, useEffect, useRef } from 'react';

const ROWS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState('');
  const [op, setOp] = useState('');
  const [fresh, setFresh] = useState(false);

  function press(btn: string) {
    if (btn === 'C') { setDisplay('0'); setPrev(''); setOp(''); setFresh(false); return; }
    if (btn === '⌫') { setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0'); return; }
    if (btn === '±') { setDisplay(d => String(-parseFloat(d))); return; }
    if (btn === '%') { setDisplay(d => String(parseFloat(d) / 100)); return; }
    if ('+-×÷−'.includes(btn)) { setPrev(display); setOp(btn); setFresh(true); return; }
    if (btn === '=') {
      if (!op || !prev) return;
      const a = parseFloat(prev), b = parseFloat(display);
      const r = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
      setDisplay(parseFloat(r.toFixed(10)).toString());
      setOp(''); setPrev(''); setFresh(false); return;
    }
    if (btn === '.') { if (!display.includes('.')) setDisplay(d => d + '.'); return; }
    setDisplay(d => (fresh || d === '0') ? btn : d.length < 12 ? d + btn : d);
    setFresh(false);
  }

  // Use a ref to always call the latest press function
  const pressRef = useRef(press);
  pressRef.current = press;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      const map: Record<string, string> = {
        '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
        '.':'.', '+':'+', '-':'−', '*':'×', '/':'÷', 'Enter':'=', '=':'=',
        'Backspace':'⌫', 'Escape':'C', '%':'%',
      };
      if (e.key in map) {
        if (e.key === '/') e.preventDefault();
        pressRef.current(map[e.key]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isOp   = (b: string) => '÷×−+'.includes(b);
  const isMeta = (b: string) => 'C±%'.includes(b);

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0818' }}>
      <div className="flex-1 flex flex-col items-end justify-end px-5 py-4 min-h-0">
        {op && <p className="text-muted-foreground text-sm">{prev} {op}</p>}
        <p className="text-foreground font-light font-mono text-ellipsis overflow-hidden whitespace-nowrap max-w-full"
          style={{ fontSize: display.length > 10 ? '1.5rem' : '2.5rem' }}>{display}</p>
      </div>
      <div className="text-center pb-1">
        <span className="text-[10px] text-muted-foreground/50">Keyboard: 0-9 + - * / Enter Backspace</span>
      </div>
      <div className="grid grid-cols-4 gap-px" style={{ background: '#050510' }}>
        {ROWS.flat().map((btn, i) => (
          <button key={i} onClick={() => press(btn)}
            className="py-4 text-xl font-medium transition-all active:scale-95 active:brightness-75"
            style={{
              background: btn === '=' ? '#7c3aed' : isOp(btn) ? '#3b1f7a' : isMeta(btn) ? '#1e1650' : '#160e40',
              color: btn === '=' ? 'white' : isOp(btn) ? '#c084fc' : isMeta(btn) ? '#a78bfa' : 'white',
            }}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
