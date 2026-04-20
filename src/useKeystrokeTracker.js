import { useState, useRef, useCallback, useEffect } from 'react';

export function useKeystrokeTracker(initialText = '', initialEventLog = [], initialHumanScore = 0, initialPastedChunks = 0, initialOrganicKeys = 0) {
  const [text, setText] = useState(initialText);
  const [humanScore, setHumanScore] = useState(initialHumanScore);
  const eventLogRef = useRef(initialEventLog);
  const pastedChunksRef = useRef(initialPastedChunks);
  const lastTimeRef = useRef(Date.now());
  const organicKeysRef = useRef(initialOrganicKeys || (initialText ? (initialHumanScore / 100) * initialText.length : 0));

  // Update refs when note changes
  useEffect(() => {
    setText(initialText || '');
    setHumanScore(initialHumanScore || 0);
    eventLogRef.current = initialEventLog || [];
    pastedChunksRef.current = initialPastedChunks || 0;
    organicKeysRef.current = initialOrganicKeys || (initialText ? (initialHumanScore / 100) * initialText.length : 0);
    lastTimeRef.current = Date.now();
  }, [initialText, initialEventLog, initialHumanScore, initialPastedChunks, initialOrganicKeys]);

  const handleKeyDown = useCallback((e) => {
    if (!e.isTrusted) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    eventLogRef.current.push({
      t: 'key',
      k: e.key === ' ' ? 'Space' : e.key,
      dt: timeDelta
    });
    
    if (timeDelta > 30 && timeDelta < 2000) {
      organicKeysRef.current += 1;
    }
  }, []);
  
  const handlePaste = useCallback((e) => {
    if (!e.isTrusted) return;
    const pastedText = e.clipboardData.getData('Text');
    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    eventLogRef.current.push({
      t: 'paste',
      len: pastedText.length,
      dt: timeDelta
    });
    
    pastedChunksRef.current += 1;
  }, []);
  
  const handleChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Calcula a proporção orgânica de forma justa
    const length = newText.length;
    if (length === 0) {
      setHumanScore(100);
      organicKeysRef.current = 0;
    } else {
      const score = Math.min(100, Math.max(0, (organicKeysRef.current / length) * 100));
      setHumanScore(score);
    }
  }, []);

  return {
    text,
    humanScore,
    eventLog: eventLogRef.current,
    pastedChunks: pastedChunksRef.current,
    organicKeys: organicKeysRef.current,
    handleKeyDown,
    handlePaste,
    handleChange
  };
}
