import React from 'react';
import { Bold, Italic, Heading2, Quote, Minus } from 'lucide-react';

/**
 * MarkdownToolbar — conecta diretamente ao editor Tiptap via comandos nativos.
 * Recebe `editor` (instância Tiptap) para formatação sem quebrar o cursor.
 * Também aceita `onInsert` legado para o modo terminal (textarea puro).
 */
export function MarkdownToolbar({ editor, onInsert }) {

  // Modo Tiptap: usa comandos nativos (focus mantido, sem bug de click)
  const tiptapCmd = (fn) => (e) => {
    e.preventDefault();
    if (editor) {
      editor.chain().focus();
      fn(editor.chain().focus());
    }
  };

  // Inserção de diálogo: travessão em nova linha
  const insertDialogue = (e) => {
    e.preventDefault();
    if (editor) {
      editor.chain().focus().insertContent('\n— ').run();
    } else if (onInsert) {
      onInsert('\n— ', '', '');
    }
  };

  return (
    <div className="markdown-toolbar">
      <button
        className="toolbar-btn"
        onMouseDown={tiptapCmd(c => c.toggleBold().run())}
        data-tooltip="Negrito"
        aria-label="Negrito"
      >
        <Bold size={15} strokeWidth={2.5} />
      </button>

      <button
        className="toolbar-btn"
        onMouseDown={tiptapCmd(c => c.toggleItalic().run())}
        data-tooltip="Itálico"
        aria-label="Itálico"
      >
        <Italic size={15} />
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-btn"
        onMouseDown={tiptapCmd(c => c.toggleHeading({ level: 2 }).run())}
        data-tooltip="Título"
        aria-label="Título"
      >
        <Heading2 size={15} strokeWidth={2} />
      </button>

      <button
        className="toolbar-btn"
        onMouseDown={tiptapCmd(c => c.toggleBlockquote().run())}
        data-tooltip="Citação"
        aria-label="Citação"
      >
        <Quote size={15} />
      </button>

      <button
        className="toolbar-btn toolbar-btn--dialogue"
        onMouseDown={insertDialogue}
        data-tooltip="Diálogo (travessão)"
        aria-label="Inserir travessão de diálogo"
      >
        <Minus size={15} strokeWidth={3} />
        <span className="toolbar-btn-label">—</span>
      </button>
    </div>
  );
}
