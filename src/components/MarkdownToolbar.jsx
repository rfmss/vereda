import React from 'react';
import { Bold, Italic, Heading, Quote, List } from 'lucide-react';

export function MarkdownToolbar({ onInsert }) {
  const handleFormat = (prefix, suffix = prefix, defaultText = 'texto') => {
    onInsert(prefix, suffix, defaultText);
  };

  return (
    <div className="markdown-toolbar">
      <button 
        className="toolbar-btn" 
        onClick={() => handleFormat('**')} 
        data-tooltip="Negrito (Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button 
        className="toolbar-btn" 
        onClick={() => handleFormat('*')} 
        data-tooltip="Itálico (Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <div className="toolbar-separator"></div>
      <button 
        className="toolbar-btn" 
        onClick={() => handleFormat('### ', '', 'Título')} 
        data-tooltip="Título 3"
      >
        <Heading size={16} />
      </button>
      <button 
        className="toolbar-btn" 
        onClick={() => handleFormat('> ', '', 'Citação')} 
        data-tooltip="Citação"
      >
        <Quote size={16} />
      </button>
      <button 
        className="toolbar-btn" 
        onClick={() => handleFormat('- ', '', 'Item')} 
        data-tooltip="Lista de Itens"
      >
        <List size={16} />
      </button>
    </div>
  );
}
