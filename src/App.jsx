import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from './hooks/useNotes';
import { useEditorModes } from './hooks/useEditorModes';
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
import { AudioPlayer } from './components/AudioPlayer';
import { Maximize2, Minimize2, Highlighter, ShieldCheck, Sun, Moon, Download, Settings, BookOpen, Keyboard, Headphones, Terminal, Columns } from 'lucide-react';
import getCaretCoordinates from 'textarea-caret';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { RichTextEditor } from './components/RichTextEditor';
import { DictionaryTooltip } from './components/DictionaryTooltip';
import { OfflineBanner } from './components/OfflineBanner';
import { BookTemplate } from './components/BookTemplate';
import { CharacterSheet } from './components/CharacterSheet';
import { PlannerView } from './components/PlannerView';

const lightBgs = ['#fdfaf6', '#fcf8f2', '#f9f5f0', '#fdfbf7', '#faf6f0'];
const darkBgs = ['#1a1918', '#1c1b1a', '#181818', '#1e1d1c', '#1b1b1b'];

// Cinematic Scroll state
let cinematicScrollId = null;

const cinematicScroll = (element, targetScroll) => {
  cancelAnimationFrame(cinematicScrollId);
  const startScroll = element.scrollTop;
  const distance = targetScroll - startScroll;
  
  if (Math.abs(distance) < 2) return;
  
  const duration = Math.min(Math.max(Math.abs(distance) * 1.5, 250), 1200);
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
    element.scrollTop = startScroll + distance * ease;
    
    if (progress < 1) {
      cinematicScrollId = requestAnimationFrame(animate);
    }
  };
  
  cinematicScrollId = requestAnimationFrame(animate);
};

const LITERARY_QUOTES = [
  { text: "Tudo é ousadia para quem nada teme.", author: "Machado de Assis" },
  { text: "Liberdade é pouco. O que eu desejo ainda não tem nome.", author: "Clarice Lispector" },
  { text: "Viver é muito perigoso... Porque aprender a viver é que é o viver mesmo.", author: "Guimarães Rosa" },
  { text: "A vida é o que fazemos dela. As viagens são os viajantes. O que vemos não é o que vemos, senão o que somos.", author: "Fernando Pessoa" },
  { text: "O que não tem solução, solucionado está.", author: "Ariano Suassuna" },
  { text: "A palavra é o meu domínio sobre o mundo.", author: "Clarice Lispector" },
  { text: "Não sou nada. Nunca serei nada. Não posso querer ser nada. À parte isso, tenho em mim todos os sonhos do mundo.", author: "Fernando Pessoa" },
  { text: "Escrever é esquecer. A literatura é a maneira mais agradável de ignorar a vida.", author: "Fernando Pessoa" }
];

function EmptyState() {
  const quote = React.useMemo(() => LITERARY_QUOTES[Math.floor(Math.random() * LITERARY_QUOTES.length)], []);
  
  return (
    <div className="empty-state-inspirador">
      <div className="quote-container">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
      <div className="empty-state-hint">
        Selecione uma obra na lateral ou comece uma nova jornada.
      </div>
    </div>
  );
}

function App() {
  const { 
    notes, currentNote, currentNoteId, setCurrentNoteId, 
    createNote, createChapter, updateCurrentNote, updateNote, deleteNote, 
    reorderNotes, importNotes
  } = useNotes();
  const [isDark, setIsDark] = useState(false);
  const {
    isFocusMode, setIsFocusMode, toggleFocus,
    isReaderMode, setIsReaderMode, toggleReader,
    isTerminalMode, setIsTerminalMode, toggleTerminal,
    isTypewriterMode, setIsTypewriterMode, toggleTypewriter,
    isGrammarMode, setIsGrammarMode, toggleGrammar,
    exitSpecialModes
  } = useEditorModes();

  const [readerFontSize, setReaderFontSize] = useState(20);
  const [readerTheme, setReaderTheme] = useState('paper');
  const [showReaderSettings, setShowReaderSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showVerifier, setShowVerifier] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dialogState, setDialogState] = useState({ isOpen: false });
  const [guideDismissed, setGuideDismissed] = useState(false); 
  const textareaRef = useRef(null);
  const tiptapRef = useRef(null);
  const editorWrapperRef = useRef(null);

  const { text, humanScore, eventLog, pastedChunks, organicKeys, handleKeyDown, handlePaste, handleChange } = useKeystrokeTracker(
    currentNote?.content || '',
    currentNote?.eventLog || [],
    currentNote?.humanScore || 0,
    currentNote?.pastedChunks || 0,
    currentNote?.organicKeys || 0
  );

  useEffect(() => {
    setGuideDismissed(false);
  }, [currentNoteId]);

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
    let className = isDark ? 'theme-dark' : 'theme-light';
    if (isTerminalMode) {
      className += ' theme-terminal';
      document.body.style.backgroundColor = '#0a0a0a';
    } else {
      document.body.style.backgroundColor = currentBg;
    }
    document.body.className = className;
  }, [isDark, currentBg, isTerminalMode]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (dialogState.isOpen) setDialogState({ ...dialogState, isOpen: false });
        else if (showVerifier) setShowVerifier(false);
        else if (isReaderMode || isFocusMode) {
          exitSpecialModes();
        }
      }
      
      if (e.key === 'Enter' && dialogState.isOpen && dialogState.onConfirm) {
        dialogState.onConfirm();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [dialogState, showVerifier, isReaderMode, isFocusMode]);

  const getStatus = () => {
    if (text.length === 0) return { label: 'Em espera', class: '' };
    if (humanScore < 50) return { label: `Análise: ${Math.floor(humanScore)}%`, class: 'suspicious' };
    if (humanScore > 90) return { label: `Integridade: OK`, class: 'verified' };
    return { label: `Humano: ${Math.floor(humanScore)}%`, class: '' };
  };

  const status = getStatus();

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

  useEffect(() => {
    if (!isTypewriterMode || !textareaRef.current || !editorWrapperRef.current) return;
    
    const syncCaret = () => {
      try {
        const wrapper = editorWrapperRef.current;
        if (!wrapper) return;
        const wrapperRect = wrapper.getBoundingClientRect();
        let absoluteCaretY;

        if (isTerminalMode && textareaRef.current) {
          const caret = getCaretCoordinates(textareaRef.current, textareaRef.current.selectionStart);
          const textareaRect = textareaRef.current.getBoundingClientRect();
          const absoluteTextareaTop = (textareaRect.top - wrapperRect.top) + wrapper.scrollTop;
          absoluteCaretY = absoluteTextareaTop + caret.top;
        } else if (!isTerminalMode && tiptapRef.current) {
          const view = tiptapRef.current.view;
          if (!view || !view.state) return;
          const { head } = view.state.selection;
          const coords = view.coordsAtPos(head);
          absoluteCaretY = (coords.top - wrapperRect.top) + wrapper.scrollTop;
        } else {
          return;
        }
        
        const targetScroll = absoluteCaretY - (wrapper.clientHeight / 2);
        cinematicScroll(wrapper, targetScroll);
      } catch (e) {
        console.error("Caret sync failed", e);
      }
    };
    
    syncCaret();
    
    const el = textareaRef.current;
    
    let syncTimeout;
    const debouncedSync = () => {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(syncCaret, 50);
    };

    if (el) {
      el.addEventListener('keyup', debouncedSync);
      el.addEventListener('click', debouncedSync);
    }
    
    return () => {
      clearTimeout(syncTimeout);
      if (el) {
        el.removeEventListener('keyup', debouncedSync);
        el.removeEventListener('click', debouncedSync);
      }
    };
  }, [text, isTypewriterMode, isTerminalMode]);

  const handleTiptapKeydown = () => {
    if (isTypewriterMode) {
      const wrapper = editorWrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const view = tiptapRef.current?.view;
      if (view) {
          const { head } = view.state.selection;
          const coords = view.coordsAtPos(head);
          const absoluteCaretY = (coords.top - wrapperRect.top) + wrapper.scrollTop;
          const targetScroll = absoluteCaretY - (wrapper.clientHeight / 2);
          cinematicScroll(wrapper, targetScroll);
      }
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    const wrapper = editorWrapperRef.current;
    if (el && !isReaderMode) {
      const scrollPos = wrapper ? wrapper.scrollTop : 0;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
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

  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === 'Escape') {
        exitSpecialModes();
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
    <>
      <OfflineBanner />
      <div className={`app-layout ${isReaderMode ? `reader-mode theme-${readerTheme}` : ''} ${isFocusMode ? 'focus-mode' : ''} ${isTypewriterMode ? 'typewriter-mode' : ''} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {(isReaderMode || isFocusMode) && (
          <div className="reader-progress-bar" style={{ width: `${scrollProgress}%` }} />
        )}
        
        <Sidebar 
          notes={notes} 
          currentNoteId={currentNoteId} 
          onCreate={(genre) => createNote('', genre || null)}
          onCreateChapter={createChapter}
          onSelect={setCurrentNoteId} 
          onReorder={reorderNotes}
          onUpdateTitle={(id, title) => updateNote(id, { title })}
          onImportNotes={importNotes}
          onAlertRequest={(msg) => setDialogState({
            isOpen: true,
            type: 'alert',
            message: msg,
            onConfirm: () => setDialogState({ isOpen: false })
          })}
          onImportRequest={(importedNotes) => {
            setDialogState({
              isOpen: true,
              type: 'confirm',
              title: 'Restaurar Backup',
              message: `⚠️ ATENÇÃO: Importar este backup vai APAGAR todas as ${notes.length} anotações atuais e substituir pelas ${importedNotes.length} do arquivo. Esta ação não pode ser desfeita. Deseja continuar?`,
              onConfirm: () => {
                importNotes(importedNotes);
                setDialogState({ isOpen: false });
              },
              onCancel: () => setDialogState({ isOpen: false })
            });
          }}
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

        <div 
          className="sidebar-edge-trigger" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          data-tooltip={isSidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </div>
        
        <main className="main-editor-area">
          <DictionaryTooltip />
          <header className="top-toolbar">
            <div className="toolbar-left">
              <button className={`icon-btn sidebar-toggle-btn ${isSidebarCollapsed ? 'collapsed' : ''}`} onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} data-tooltip="Alternar Menu Lateral">
                <Columns size={20} />
              </button>
              <button className="icon-btn" onClick={toggleFocus} data-tooltip="Modo Foco (Edição em tela cheia)">
                <Maximize2 size={20} />
              </button>
              <button className="icon-btn" onClick={toggleReader} data-tooltip="Modo Leitor (Apenas leitura)">
                <BookOpen size={20} />
              </button>
              <div style={{ position: 'relative' }}>
                <button className={`icon-btn ${showAudioPlayer ? 'active' : ''}`} onClick={() => setShowAudioPlayer(!showAudioPlayer)} data-tooltip="Áudio Ambiente">
                  <Headphones size={20} />
                </button>
                <AudioPlayer isOpen={showAudioPlayer} onClose={() => setShowAudioPlayer(false)} />
              </div>
              <button className={`icon-btn ${isTypewriterMode ? 'active' : ''}`} onClick={toggleTypewriter} data-tooltip="Modo Máquina de Escrever">
                <Keyboard size={20} />
              </button>
              <button className={`icon-btn ${isGrammarMode ? 'active' : ''}`} onClick={toggleGrammar} data-tooltip="Alternar Marcador Gramatical">
                <Highlighter size={20} />
              </button>
              <button className="icon-btn" onClick={() => setShowVerifier(true)} data-tooltip="Verificar Autoria">
                <ShieldCheck size={20} />
              </button>
            </div>
            <div className="toolbar-right">
              <div className={`badge ${status.class}`} data-tooltip="Índice de Autoria Humana">
                <span className="badge-dot"></span>
                {status.label}
              </div>
              <button className={`icon-btn ${isTerminalMode ? 'active' : ''}`} onClick={toggleTerminal} data-tooltip="Modo Terminal">
                <Terminal size={20} />
              </button>
              <button className="icon-btn" onClick={() => setIsDark(!isDark)} data-tooltip="Alternar Tema">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="icon-btn outline-btn" onClick={handleExport} data-tooltip="Gerar Certificado de Autoria Humana (Proof of Writing)">
                <Download size={18} />
                <span>Certificar</span>
              </button>
            </div>
          </header>

          <div className={`editor-content-wrapper ${currentNote?.genreName === 'Livro (Template Completo)' ? 'paged-mode' : ''}`} ref={editorWrapperRef}>
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
                {/* Book Template: Páginas reais editáveis para o gênero Livro */}
                {currentNote.genreName === 'Livro (Template Completo)' && (
                  <BookTemplate
                    bookPages={currentNote.bookPages || {}}
                    onUpdatePages={(pages) => updateCurrentNote({ bookPages: pages })}
                  />
                )}

                {currentNote.genreName === 'Ficha de Personagem' && (
                  <CharacterSheet
                    characterData={currentNote.characterData || {}}
                    onUpdateCharacter={(data) => updateCurrentNote({ characterData: data })}
                  />
                )}

                {currentNote.genreName === 'Organize-se' && (
                  <PlannerView
                    noteContent={currentNote.content || ''}
                    onUpdateContent={(json) => updateCurrentNote({ content: json })}
                  />
                )}
                
                {!isReaderMode && currentNote.genreName !== 'Ficha de Personagem' && currentNote.genreName !== 'Organize-se' && (
                  <input
                    type="text"
                    className="editor-title-input"
                    placeholder={currentNote.titlePlaceholder || "Título do Documento..."}
                    value={currentNote.title || ''}
                    onChange={(e) => updateCurrentNote({ title: e.target.value })}
                  />
                )}
                
                {isGrammarMode ? (
                  <GrammarViewer text={text} />
                ) : isReaderMode ? (
                  <article className="reader-article" style={{ fontSize: `${readerFontSize}px` }}>
                    <h1 className="reader-title">{currentNote.title || 'Sem Título'}</h1>
                    <div className="reader-body markdown-preview">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{text}</ReactMarkdown>
                    </div>
                  </article>
                ) : (currentNote.genreName === 'Ficha de Personagem' || currentNote.genreName === 'Organize-se') ? null : (
                  <>
                    {!isTerminalMode && <MarkdownToolbar editor={tiptapRef.current} onInsert={handleInsertMarkdown} />}
                    {currentNote.genrePlaceholder && text.length === 0 && !guideDismissed && (
                      <div 
                        className="genre-guide-banner"
                        onClick={() => {
                          setGuideDismissed(true);
                          setTimeout(() => {
                            if (isTerminalMode) textareaRef.current?.focus();
                            else tiptapRef.current?.view.focus();
                          }, 10);
                        }}
                        data-tooltip="Clique para ocultar este guia"
                      >
                        <div className="genre-guide-header-label">
                          <span className="genre-guide-chip">{currentNote.genreName}</span>
                          guia de escrita • clique para ocultar
                        </div>
                        <div className="genre-guide-markdown">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{currentNote.genrePlaceholder}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    <div className="editor-textarea-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {!isTerminalMode ? (
                        <RichTextEditor
                          content={text}
                          onChange={handleChange}
                          editorRef={tiptapRef}
                          onKeyDown={(e) => {
                            handleTiptapKeydown();
                            handleKeyDown(e);
                          }}
                          onClick={handleTiptapKeydown}
                        />
                      ) : (
                        <textarea
                          ref={textareaRef}
                          className="editor-textarea"
                          placeholder={currentNote.genrePlaceholder || 'Comece a escrever sua obra…'}
                          value={text}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          onPaste={handlePaste}
                          spellCheck="false"
                        />
                      )}
                    </div>
                    <TextStatistics
                      text={text}
                      goal={currentNote?.wordGoal}
                      onSetGoal={(goal) => updateCurrentNote({ wordGoal: goal })}
                    />
                  </>
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
          
          <button 
            className={`floating-exit-btn ${(isReaderMode || isFocusMode) ? 'visible' : ''}`}
            onClick={exitSpecialModes}
            data-tooltip="Sair do Modo Expandido (Esc)"
          >
            <Minimize2 size={24} />
          </button>
        </main>

        {showVerifier && <VerifierModal onClose={() => setShowVerifier(false)} />}
        <CustomDialog {...dialogState} />
        <CustomCursor />
      </div>
    </>
  );
}

export default App;
