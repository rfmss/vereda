import { useState } from 'react';

export function useEditorModes() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [isGrammarMode, setIsGrammarMode] = useState(false);

  const toggleFocus = () => setIsFocusMode(prev => !prev);
  const toggleReader = () => setIsReaderMode(prev => !prev);
  const toggleTerminal = () => setIsTerminalMode(prev => !prev);
  const toggleTypewriter = () => setIsTypewriterMode(prev => !prev);
  const toggleGrammar = () => setIsGrammarMode(prev => !prev);

  const exitSpecialModes = () => {
    setIsFocusMode(false);
    setIsReaderMode(false);
  };

  return {
    isFocusMode, setIsFocusMode, toggleFocus,
    isReaderMode, setIsReaderMode, toggleReader,
    isTerminalMode, setIsTerminalMode, toggleTerminal,
    isTypewriterMode, setIsTypewriterMode, toggleTypewriter,
    isGrammarMode, setIsGrammarMode, toggleGrammar,
    exitSpecialModes
  };
}
