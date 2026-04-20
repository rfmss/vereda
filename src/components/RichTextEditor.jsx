import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export const RichTextEditor = ({ content, onChange, onFocus, onBlur, onKeyDown, onClick, editorRef }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Optional: configure specific nodes
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // The onChange callback expects the raw markdown string
      const markdown = editor.storage.markdown.getMarkdown();
      onChange({ target: { value: markdown } });
    },
    onFocus,
    onBlur,
    editorProps: {
      attributes: {
        class: 'editor-textarea tiptap-editor',
        spellcheck: 'false'
      },
      handleKeyDown: (view, event) => {
        if (onKeyDown) {
          onKeyDown(event);
        }
        return false; // let tiptap handle it
      }
    }
  });

  // Expose the editor instance to the parent
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  // Sync external content changes into the editor if needed
  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      // We only update if the content actually changed externally (e.g. restoring a snapshot)
      // Be careful not to reset cursor position during normal typing
      const currentSelection = editor.state.selection;
      editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
      // Restoring selection might be complex, so this is mainly for full document swaps
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <EditorContent editor={editor} style={{ flex: 1 }} />
    </div>
  );
};
