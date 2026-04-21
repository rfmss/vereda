// src/components/DictionaryTooltip.jsx
import React, { useState, useEffect, useRef } from 'react';
import { fetchDefinition } from '../utils/dictionaryAPI';
import { BookOpen } from 'lucide-react';

export function DictionaryTooltip() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = async (e) => {
      // Don't trigger if clicking inside the tooltip itself
      if (tooltipRef.current && tooltipRef.current.contains(e.target)) {
        return;
      }

      setTimeout(async () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && selectedText.split(' ').length === 1 && selectedText.length > 1) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          setPosition({
            top: rect.top - 10,
            left: rect.left + (rect.width / 2)
          });
          setWord(selectedText);
          setVisible(true);
          setDefinition(null);
          setIsLoading(true);

          const result = await fetchDefinition(selectedText);
          if (result && selection.toString().trim() === selectedText) {
            setDefinition(result.definition);
          } else if (!result) {
            setDefinition('Nenhuma definição encontrada.');
          }
          setIsLoading(false);
        } else {
          setVisible(false);
        }
      }, 10);
    };

    const handleKeyDown = (e) => {
      // Hide on escape or any typing
      if (visible && e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt') {
        setVisible(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      ref={tooltipRef}
      className="dictionary-float"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)',
        zIndex: 99999
      }}
    >
      <div className="dict-header">
        <BookOpen size={14} />
        <strong>{word}</strong>
      </div>
      <div className="dict-body">
        {isLoading ? (
          <span className="dict-loading">Buscando no arquivo...</span>
        ) : (
          <span>{definition}</span>
        )}
      </div>
    </div>
  );
}
