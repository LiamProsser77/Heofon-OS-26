import { useState } from 'react';

export default function NotepadApp() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <span className="text-xs text-muted-foreground">Untitled.txt</span>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>{lines} lines</span>
          <span>{words} words</span>
          <span>{text.length} chars</span>
        </div>
      </div>
      <textarea
        className="flex-1 w-full resize-none bg-transparent text-foreground p-5 text-sm outline-none font-mono leading-relaxed placeholder-muted-foreground/40"
        placeholder="Start typing..."
        value={text}
        onChange={e => setText(e.target.value)}
        spellCheck={false}
      />
      <div className="px-4 py-1.5 border-t border-border shrink-0 flex justify-between">
        <span className="text-xs text-muted-foreground">UTF-8</span>
        <span className="text-xs text-muted-foreground">Plain Text</span>
      </div>
    </div>
  );
}
