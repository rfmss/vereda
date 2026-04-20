import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from './hooks/useNotes';
import { useKeystrokeTracker } from './useKeystrokeTracker';
import { Sidebar } from './components/Sidebar';
import { GrammarViewer } from './components/GrammarViewer';
import { VerifierModal } from './components/VerifierModal';
import { CustomDialog } from './components/CustomDialog';
import { CustomCursor } from './components/CustomCursor';
import { MarkdownToolbar } from './components/MarkdownToolbar';
import { TextStatistics } from './components/TextStatistics';
import { generateProofSignature } from './crypto';
import { ReaderSettings } from './components/ReaderSettings';
import { SnapshotModal } from './components/SnapshotModal';
import { AudioPlayer } from './components/AudioPlayer';
import { Maximize2, Minimize2, Highlighter, ShieldCheck, Sun, Moon, Download, Settings, BookOpen, Focus, History, Headphones } from 'lucide-react';
import getCaretCoordinates from 'textarea-caret';

const lightBgs = ['#fdfaf6', '#fcf8f2', '#f9f5f0', '#fdfbf7', '#faf6f0'];
const darkBgs = ['#1a1918', '#1c1b1a', '#181818', '#1e1d1c', '#1b1b1b'];

function App() {
  const { 
    notes, currentNote, currentNoteId, setCurrentNoteId, 
    createNote, createChapter, updateCurrentNote, deleteNote, 
    reorderNotes, createSnapshot, restoreSnapshot 
  } = useNotes();
  const [isDark, setIsDark] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(20);
  const [readerTheme, setReaderTheme] = useState('paper');
  const [showReaderSettings, setShowReaderSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isGrammarMode, setIsGrammarMode] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dialogState, setDialogState] = useState({ isOpen: false });
  const textareaRef = useRef(null);
  const editorWrapperRef = useRef(null);

  // Initialize tracker with current note data
  const { text, humanScore, eventLog, pastedChunks, organicKeys, handleKeyDown, handlePaste, handleChange } = useKeystrokeTracker(
    currentNote?.content || '',
    currentNote?.eventLog || [],
    currentNote?.humanScore || 0,
    currentNote?.pastedChunks || 0,
    currentNote?.organicKeys || 0
  );

  // Auto-save: debounced save to localStorage via updateCurrentNote
  useEffect(() => {
    if (!currentNoteId) return;
    const timer = setTimeout(() => {
      const tagsMatch = text.match(/#[\wÀ-ú]+/g) || [];
      const tags = [...new Set(tagsMatch.map(t => t.toLowerCase()))];
      
      updateCurrentNote({
        content: text,
        eventLog,
        humanScore,
        pastedChunks,
        organicKeys,
        tags
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [text, humanScore, pastedChunks, organicKeys, currentNoteId]);

  // If no note is selected, select the first one or create one
  useEffect(() => {
    if (!currentNoteId && notes.length > 0) {
      setCurrentNoteId(notes[0].id);
    } else if (notes.length === 0) {
      createNote();
    }
  }, [notes, currentNoteId]);

  const bgArray = isDark ? darkBgs : lightBgs;
  const currentBg = currentNote ? bgArray[currentNote.bgIndex % bgArray.length] : bgArray[0];

  useEffect(() => {
    document.body.className = isDark ? 'theme-dark' : 'theme-light';
    document.body.style.backgroundColor = currentBg;
  }, [isDark, currentBg]);

  const getStatus = () => {
    if (text.length === 0) return { label: 'Aguardando digitação', class: '' };
    if (humanScore < 50) return { label: `Escrita Orgânica: ${Math.floor(humanScore)}%`, class: 'suspicious' };
    if (humanScore > 90) return { label: `Escrita Orgânica: ${Math.floor(humanScore)}%`, class: 'verified' };
    return { label: `Escrita Orgânica: ${Math.floor(humanScore)}%`, class: '' };
  };

  const status = getStatus();

  // Scroll Progress and Reading Time
  useEffect(() => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper || (!isReaderMode && !isFocusMode)) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [isReaderMode, isFocusMode]);

  // Typewriter Mode sync
  useEffect(() => {
    if (!isTypewriterMode || !textareaRef.current || !editorWrapperRef.current) return;
    
    const syncCaret = () => {
      try {
        const caret = getCaretCoordinates(textareaRef.current, textareaRef.current.selectionStart);
        const wrapper = editorWrapperRef.current;
        const textareaRect = textareaRef.current.getBoundingClientRect();
        
        // Posição Y do cursor em relação à tela (viewport)
        const caretYOnScreen = textareaRect.top + caret.top;
        
        // A "linha de visão" fixa (metade da tela)
        const targetY = window.innerHeight * 0.5;
        
        // A digitação SEMPRE fica na mesma linha de visão
        const delta = caretYOnScreen - targetY;
        
        // Evita rolagens microscópicas que causam tremor
        if (Math.abs(delta) > 5) {
          wrapper.scrollBy({ top: delta, behavior: 'smooth' });
        }
      } catch (e) {
        console.error("Caret sync failed", e);
      }
    };
    
    syncCaret();
    
    const el = textareaRef.current;
    
    let syncTimeout;
    const debouncedSync = () => {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(syncCaret, 100); // Suave delay de 100ms para classe
    };

    el.addEventListener('keyup', debouncedSync);
    // Removido evento de click para que o simples ato de clicar em outro parágrafo não puxe a tela violentamente
    return () => {
      clearTimeout(syncTimeout);
      el.removeEventListener('keyup', debouncedSync);
    };
  }, [text, isTypewriterMode]);


  // Auto-resize textarea to avoid double scrollbars and layout shifts
  useEffect(() => {
    const el = textareaRef.current;
    const wrapper = editorWrapperRef.current;
    if (el && !isReaderMode) {
      // Guardar a posição atual de rolagem para evitar o solavanco (snap)
      const scrollPos = wrapper ? wrapper.scrollTop : 0;
      
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
      
      // Restaurar imediatamente a rolagem antes que o navegador "pinte" a tela
      if (wrapper) {
        wrapper.scrollTop = scrollPos;
      }
    }
  }, [text, isReaderMode, currentNoteId]);


  const getReadingTime = () => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/).length;
    const minutes = noOfWords / wordsPerMinute;
    return Math.ceil(minutes);
  };

  const handleExport = async () => {
    if (!text || !currentNote?.title?.trim()) {
      setDialogState({
        isOpen: true,
        type: 'alert',
        message: 'Por favor, defina um título para o documento antes de salvar/exportar.',
        onConfirm: () => setDialogState({ isOpen: false })
      });
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString();
      const title = currentNote.title.trim();
      const signature = await generateProofSignature(title, text, eventLog, timestamp);
      
      const proofData = {
        version: "2.0",
        title,
        timestamp,
        stats: {
          length: text.length,
          events: eventLog.length,
          humanScore: Math.floor(humanScore),
          pastedChunks
        },
        signature,
        eventLog
      };

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const formattedTime = `${dateStr} ${hours}h${mins}m${secs}s`;
      const fileNameBase = `${title} - ${formattedTime}`;

      const txtBlob = new Blob([text], { type: 'text/plain' });
      const txtUrl = URL.createObjectURL(txtBlob);
      const txtLink = document.createElement('a');
      txtLink.href = txtUrl;
      txtLink.download = `${fileNameBase}.txt`;
      document.body.appendChild(txtLink);
      txtLink.click();
      txtLink.remove();

      const proofBlob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
      const proofUrl = URL.createObjectURL(proofBlob);
      const proofLink = document.createElement('a');
      proofLink.href = proofUrl;
      proofLink.download = `${fileNameBase}.proof.json`;
      document.body.appendChild(proofLink);
      proofLink.click();
      proofLink.remove();

      URL.revokeObjectURL(txtUrl);
      URL.revokeObjectURL(proofUrl);
    } catch (e) {
      console.error(e);
      setDialogState({
        isOpen: true,
        type: 'alert',
        message: 'Erro ao gerar assinatura e salvar.',
        onConfirm: () => setDialogState({ isOpen: false })
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleInsertMarkdown = (prefix, suffix, defaultText) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const textToInsert = selectedText || defaultText;
    const newText = text.substring(0, start) + prefix + textToInsert + suffix + text.substring(end);
    
    handleChange({ target: { value: newText } });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + textToInsert.length);
    }, 0);
  };

  // Atalhos Globais
  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === 'Escape') {
        setIsReaderMode(false);
        setIsFocusMode(false);
        setShowVerifier(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNote();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [text, currentNote, eventLog, humanScore, pastedChunks, isExporting, createNote]);

  return (
    <div className={`app-layout ${isReaderMode ? `reader-mode theme-${readerTheme}` : ''} ${isFocusMode ? 'focus-mode' : ''} ${isTypewriterMode ? 'typewriter-mode' : ''}`}>
      {(isReaderMode || isFocusMode) && (
        <div className="reader-progress-bar" style={{ width: `${scrollProgress}%` }} />
      )}
      <Sidebar 
        notes={notes} 
        currentNoteId={currentNoteId} 
        onCreate={createNote} 
        onCreateChapter={createChapter}
        onSelect={setCurrentNoteId} 
        onReorder={reorderNotes}
        onDeleteRequest={(id) => {
          setDialogState({
            isOpen: true,
            type: 'confirm',
            title: 'Deletar anotação',
            message: 'Tem certeza que deseja deletar esta anotação permanentemente?',
            onConfirm: () => {
              deleteNote(id);
              setDialogState({ isOpen: false });
            },
            onCancel: () => setDialogState({ isOpen: false })
          });
        }} 
      />
      
      <main className="main-editor-area">
        <header className="top-toolbar">
          <div className="toolbar-left">
            <button className="icon-btn" onClick={() => setIsFocusMode(true)} title="Modo Foco (Edição em tela cheia)">
              <Maximize2 size={20} />
            </button>
            <button className="icon-btn" onClick={() => setIsReaderMode(true)} title="Modo Leitor (Apenas leitura)">
              <BookOpen size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <button className={`icon-btn ${showAudioPlayer ? 'active' : ''}`} onClick={() => setShowAudioPlayer(!showAudioPlayer)} title="Áudio Ambiente">
                <Headphones size={20} />
              </button>
              <AudioPlayer isOpen={showAudioPlayer} onClose={() => setShowAudioPlayer(false)} />
            </div>
            <button className={`icon-btn ${isTypewriterMode ? 'active' : ''}`} onClick={() => setIsTypewriterMode(!isTypewriterMode)} title="Modo Máquina de Escrever">
              <Focus size={20} />
            </button>
            <button className={`icon-btn ${showSnapshotModal ? 'active' : ''}`} onClick={() => setShowSnapshotModal(true)} title="Histórico de Versões">
              <History size={20} />
            </button>
            <button className={`icon-btn ${isGrammarMode ? 'active' : ''}`} onClick={() => setIsGrammarMode(!isGrammarMode)} title="Alternar Marcador Gramatical">
              <Highlighter size={20} />
            </button>
            <button className="icon-btn" onClick={() => setShowVerifier(true)} title="Verificar Autoria">
              <ShieldCheck size={20} />
            </button>
          </div>
          <div className="toolbar-right">
            <div className={`badge ${status.class}`} title="Índice de Autoria Humana">
              <span className="badge-dot"></span>
              {status.label}
            </div>
            <button className="icon-btn" onClick={() => setIsDark(!isDark)} title="Alternar Tema">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn outline-btn" onClick={handleExport} disabled={text.length === 0 || isExporting}>
              <Download size={16} />
              {isExporting ? '...' : 'Gerar Certificado'}
            </button>
          </div>
        </header>

        <div className="editor-content-wrapper" ref={editorWrapperRef}>
          {isReaderMode && (
            <div className="reader-meta-info">
              <span>{getReadingTime()} min de leitura</span>
              <button className="reader-settings-toggle" onClick={() => setShowReaderSettings(!showReaderSettings)}>
                <Settings size={18} />
              </button>
              <ReaderSettings 
                isOpen={showReaderSettings} 
                onClose={() => setShowReaderSettings(false)}
                fontSize={readerFontSize}
                setFontSize={setReaderFontSize}
                theme={readerTheme}
                setTheme={setReaderTheme}
              />
            </div>
          )}
          {currentNote ? (
            <div className="editor-container-inner">
              {!isReaderMode && (
                <input
                  type="text"
                  className="editor-title-input"
                  placeholder="Título do Documento..."
                  value={currentNote.title || ''}
                  onChange={(e) => updateCurrentNote({ title: e.target.value })}
                />
              )}
              {isGrammarMode ? (
                <GrammarViewer text={text} />
              ) : isReaderMode ? (
                <article className="reader-article" style={{ fontSize: `${readerFontSize}px` }}>
                  <h1 className="reader-title">{currentNote.title || 'Sem Título'}</h1>
                  <div className="reader-body">
                    {text.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ) : (
                <>
                  <MarkdownToolbar onInsert={handleInsertMarkdown} />
                  <textarea
                    ref={textareaRef}
                    className="editor-textarea"
                    placeholder="Comece a escrever sua obra..."
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    spellCheck="false"
                  />
                  <TextStatistics 
                    text={text} 
                    goal={currentNote?.wordGoal} 
                    onSetGoal={(goal) => updateCurrentNote({ wordGoal: goal })}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="empty-state">Selecione ou crie uma anotação.</div>
          )}
        </div>
        
        {/* Botões flutuantes para sair */}
        <button 
          className={`floating-exit-btn ${(isReaderMode || isFocusMode) ? 'visible' : ''}`}
          onClick={() => { setIsReaderMode(false); setIsFocusMode(false); }}
          title="Sair do Modo Expandido (Esc)"
        >
          <Minimize2 size={24} />
        </button>
      </main>

      {showVerifier && <VerifierModal onClose={() => setShowVerifier(false)} />}
      <CustomDialog {...dialogState} />
      <CustomCursor />
    </div>
  );
}

export default App;
