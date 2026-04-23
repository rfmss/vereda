import { useState } from 'react';

export function useEditorModes() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [isGrammarMode, setIsGrammarMode] = useState(false);

  const toggleFocus = () => setIsFocusMode(prev => !prev);
  const toggleReader = () => setIsReaderMode(prev => !prev);
  const toggleTerminal = () => setIsTerminalMode(prev => !prev);
  const toggleGrammar = () => setIsGrammarMode(prev => !prev);

  const exitSpecialModes = () => {
    setIsFocusMode(false);
    setIsReaderMode(false);
  };

  return {
    isFocusMode, setIsFocusMode, toggleFocus,
    isReaderMode, setIsReaderMode, toggleReader,
    isTerminalMode, setIsTerminalMode, toggleTerminal,
    isGrammarMode, setIsGrammarMode, toggleGrammar,
    exitSpecialModes
  };
}
