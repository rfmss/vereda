import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { ReviewSidebar } from './components/ReviewSidebar';
import { ReaderView } from './components/ReaderView';
import { ProjectBible } from './components/ProjectBible';
import { LinguisticAnalysis } from './components/LinguisticAnalysis';
import { BrandingView } from './components/BrandingView';
import { PersonaMappingView } from './components/PersonaMappingView';
import { SanctuaryView } from './components/SanctuaryView';
import { BookAnatomyView } from './components/BookAnatomyView';
import { TemplateLibrary } from './components/TemplateLibrary';
import { SplashScreen } from './components/SplashScreen';
import { DictionarySidebar } from './components/DictionarySidebar';
import { RightPanel } from './components/RightPanel';

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
  const quote = useMemo(() => LITERARY_QUOTES[Math.floor(Math.random() * LITERARY_QUOTES.length)], []);
  
  return (
    <div className="h-full flex items-center justify-center p-12 text-center">
      <div className="max-w-xl space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-6">
          <p className="text-3xl md:text-4xl font-display-lg italic text-stone-700 dark:text-stone-200 leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-primary opacity-60">
            — {quote.author}
          </p>
        </div>
        <div className="h-px w-24 bg-stone-200 dark:bg-stone-800 mx-auto" />
        <div className="text-sm font-medium text-stone-400 uppercase tracking-widest flex items-center justify-center gap-3">
          <span className="material-symbols-outlined">west</span>
          Selecione uma obra na lateral para começar
        </div>
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
    isGrammarMode, setIsGrammarMode, toggleGrammar,
    exitSpecialModes
  } = useEditorModes();

  const [showVerifier, setShowVerifier] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isReviewSidebarOpen, setIsReviewSidebarOpen] = useState(false);
  const [isBibleOpen, setIsBibleOpen] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isPersonaMappingOpen, setIsPersonaMappingOpen] = useState(false);
  const [isSanctuaryOpen, setIsSanctuaryOpen] = useState(false);
  const [isBookAnatomyOpen, setIsBookAnatomyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('notas');
  const [selectedDictWord, setSelectedDictWord] = useState('');
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleOpenDictionary = (word = '') => {
    setSelectedDictWord(word);
    setIsRightPanelOpen(true);
    setRightPanelTab('dicionario');
    setIsBibleOpen(false);
    setIsReviewSidebarOpen(false);
    setIsAnalysisMode(false);
    setIsReviewSidebarOpen(false);
    setIsAnalysisMode(false);
  };

  const [dialogState, setDialogState] = useState({ isOpen: false });
  const [guideDismissed, setGuideDismissed] = useState(false); 

  const handleToggleReview = () => {
    setIsReviewSidebarOpen(!isReviewSidebarOpen);
    if (!isReviewSidebarOpen) {
      setIsReaderMode(false);
      setIsGrammarMode(false);
    }
  };

  const handleExitSpecial = () => {
    exitSpecialModes();
    setIsReviewSidebarOpen(false);
  };
  const [isWriting, setIsWriting] = useState(false);
  const writingTimerRef = useRef(null);
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
    
    // Detecção de escrita para modo invisível
    setIsWriting(true);
    if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
    writingTimerRef.current = setTimeout(() => setIsWriting(false), 2500);

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
    return () => {
      clearTimeout(timer);
      if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
    };
  }, [text, currentNoteId]);

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


  const handleTiptapKeydown = () => {
    // Modo Máquina de Escrever removido
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
  }, [text, currentNote, eventLog, humanScore, pastedChunks, organicKeys, updateCurrentNote]);


  return (
    <>
      <OfflineBanner />
      <div className={`flex flex-col h-screen overflow-hidden font-body-ui text-body-ui bg-background text-on-background ${isDark ? 'dark' : ''} ${isWriting && isFocusMode ? 'ui-recede' : ''}`}>
        
        {/* TopAppBar */}
        <header className="bg-[#F2EFE9] dark:bg-stone-950 text-[#2E4D43] dark:text-emerald-500 font-serif tracking-tight flex justify-between items-center w-full px-8 h-16 border-b border-stone-200 dark:border-stone-800 z-50 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tighter text-[#2E4D43] dark:text-emerald-400 font-serif tracking-tight antialiased">
              {currentNote?.genreName === 'Organize-se' ? 'Organize-se' : 'Vereda'}
            </h1>
            <nav className="hidden md:flex gap-6 items-center">
            <button 
              className={`h-full flex items-center pt-1 border-b-2 transition-all duration-300 ${!isReaderMode && !isReviewSidebarOpen && !isAnalysisMode ? 'text-[#2E4D43] dark:text-emerald-400 border-[#2E4D43] dark:border-emerald-400 font-bold' : 'text-stone-500 dark:text-stone-500 border-transparent hover:text-[#2E4D43]'}`}
              onClick={() => { exitSpecialModes(); setIsReviewSidebarOpen(false); setIsAnalysisMode(false); }}
            >
              Write
            </button>
            <button 
              className={`h-full flex items-center pt-1 border-b-2 transition-all duration-300 ${isAnalysisMode ? 'text-[#2E4D43] dark:text-emerald-400 border-[#2E4D43] dark:border-emerald-400 font-bold' : 'text-stone-500 dark:text-stone-500 border-transparent hover:text-[#2E4D43]'}`}
              onClick={() => { setIsAnalysisMode(!isAnalysisMode); setIsReviewSidebarOpen(false); setIsReaderMode(false); }}
            >
              Analyze
            </button>
            <button 
              className={`h-full flex items-center pt-1 border-b-2 transition-all duration-300 ${isReviewSidebarOpen ? 'text-[#2E4D43] dark:text-emerald-400 border-[#2E4D43] dark:border-emerald-400 font-bold' : 'text-stone-500 dark:text-stone-500 border-transparent hover:text-[#2E4D43]'}`}
              onClick={() => { setIsReviewSidebarOpen(!isReviewSidebarOpen); setIsAnalysisMode(false); setIsReaderMode(false); }}
            >
              Review
            </button>
            <button 
              className={`h-full flex items-center pt-1 border-b-2 transition-all duration-300 ${isReaderMode ? 'text-[#2E4D43] dark:text-emerald-400 border-[#2E4D43] dark:border-emerald-400 font-bold' : 'text-stone-500 dark:text-stone-500 border-transparent hover:text-[#2E4D43]'}`}
              onClick={() => { toggleReader(); setIsReviewSidebarOpen(false); setIsAnalysisMode(false); }}
            >
              Read
            </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* PoHW Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-fixed/30 border border-primary-fixed">
              <span className="material-symbols-outlined text-[16px] text-[#2E4D43] dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-helper-text text-[11px] text-[#2E4D43] dark:text-emerald-400 font-bold uppercase tracking-widest">Human Integrity: 98%</span>
            </div>
            
            <button className="text-stone-500 hover:text-[#2E4D43] transition-colors p-2 rounded-full hover:bg-black/5" onClick={() => setIsAnalysisMode(true)}>
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </button>

            <button className="flex items-center gap-2 px-5 py-2 bg-primary dark:bg-emerald-600 text-on-primary dark:text-white rounded-DEFAULT font-body-ui text-sm transition-all hover:bg-primary/90 shadow-sm hover:shadow-md active:scale-95" onClick={() => setIsVerifierOpen(true)}>
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Certificar Obra
            </button>

            <div className="flex items-center gap-1 border-l border-stone-200 dark:border-stone-800 ml-2 pl-2">
              <button className="text-stone-500 hover:text-[#2E4D43] transition-colors p-2 rounded-full hover:bg-black/5" onClick={() => setIsDark(!isDark)}>
                <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <button className="text-stone-500 hover:text-[#2E4D43] transition-colors p-2 rounded-full hover:bg-black/5">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Editor Toolbar (Minimalist PoHW) */}
        <div className="w-full flex justify-center border-b border-stone-100 dark:border-stone-900 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm z-10">
          <div className="w-full max-w-container-max-width flex items-center justify-between py-2 px-gutter md:px-0">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <button className="p-2 rounded hover:bg-surface-container dark:hover:bg-stone-800 transition-colors" title="Bold"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
              <button className="p-2 rounded hover:bg-surface-container dark:hover:bg-stone-800 transition-colors" title="Italic"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
              <div className="w-px h-4 bg-outline-variant/30 mx-2"></div>
              <button className="p-2 rounded hover:bg-surface-container dark:hover:bg-stone-800 transition-colors" title="List"><span className="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
              <button className="p-2 rounded hover:bg-surface-container dark:hover:bg-stone-800 transition-colors" title="Quote"><span className="material-symbols-outlined text-[20px]">format_quote</span></button>
            </div>
            <div className="font-helper-text text-[11px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-emerald-500 animate-pulse"></span>
              Monitoramento Ativo
            </div>
          </div>
        </div>

        {/* Layout Container */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            notes={notes} 
            currentNoteId={currentNoteId}
            onCreate={(genre) => createNote('', genre || null)}
            onCreateChapter={createChapter}
            onSelect={setCurrentNoteId}
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
            onReorder={reorderNotes}
            onUpdateTitle={(id, title) => updateNote(id, { title })}
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
            isDark={isDark}
            setIsDark={setIsDark}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            onOpenVerifier={() => setIsVerifierOpen(true)}
            onOpenBranding={() => setIsBrandingOpen(true)}
            onOpenPersonaMapping={() => setIsPersonaMappingOpen(true)}
            onOpenSanctuary={() => setIsSanctuaryOpen(true)}
            onOpenBookAnatomy={() => setIsBookAnatomyOpen(true)}
            onOpenDictionary={(w) => {
              if (w === '') setIsDictionaryOpen(!isDictionaryOpen);
              else handleOpenDictionary(w);
            }}
            isDictionaryOpen={isDictionaryOpen}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-surface dark:bg-stone-900">
            <DictionaryTooltip />
            
            <div className={`flex-1 overflow-y-auto px-gutter md:px-0 scroll-smooth bg-background ${isReaderMode ? `reader-mode theme-${readerTheme}` : ''} ${isFocusMode ? 'focus-mode' : ''}`} ref={editorWrapperRef}>
              <div className="max-w-container-max-width mx-auto py-margin-focus relative">
                
                {/* Floating Toolbar (Contextual) */}
                {!isReaderMode && !isTerminalMode && currentNote && currentNote.genreName !== 'Organize-se' && (
                  <div id="floating-toolbar" className="absolute -left-16 top-32 hidden lg:flex flex-col gap-2 bg-white dark:bg-stone-800 shadow-sm border border-outline-variant/30 dark:border-stone-700 rounded p-2 text-on-surface-variant dark:text-stone-300 z-20">
                    <button className="p-1 hover:bg-surface-variant dark:hover:bg-stone-700 rounded hover:text-primary dark:hover:text-emerald-400 transition-colors" title="Bold" onClick={() => handleInsertMarkdown('**', '**', 'negrito')}>
                      <span className="material-symbols-outlined text-[20px]">format_bold</span>
                    </button>
                    <button className="p-1 hover:bg-surface-variant dark:hover:bg-stone-700 rounded hover:text-primary dark:hover:text-emerald-400 transition-colors" title="Italic" onClick={() => handleInsertMarkdown('*', '*', 'itálico')}>
                      <span className="material-symbols-outlined text-[20px]">format_italic</span>
                    </button>
                    <button className="p-1 hover:bg-surface-variant dark:hover:bg-stone-700 rounded hover:text-primary dark:hover:text-emerald-400 transition-colors" title="Quote" onClick={() => handleInsertMarkdown('> ', '', 'citação')}>
                      <span className="material-symbols-outlined text-[20px]">format_quote</span>
                    </button>
                    <div className="w-full h-px bg-outline-variant/50 dark:bg-stone-700 my-1"></div>
                    <button className="p-1 hover:bg-surface-variant dark:hover:bg-stone-700 rounded hover:text-primary dark:hover:text-emerald-400 transition-colors" title="Export" onClick={handleExport}>
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </div>
                )}

                {currentNote ? (
                  <article className="prose prose-stone max-w-none dark:prose-invert">
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
                      <div className="border-b border-outline-variant/30 pb-4 mb-8">
                        <input
                          className="w-full bg-transparent border-none focus:ring-0 p-0 font-display-lg text-display-lg text-on-surface placeholder:text-outline-variant/50"
                          placeholder={currentNote.titlePlaceholder || "Chapter Title"}
                          value={currentNote.title || ''}
                          onChange={(e) => updateCurrentNote({ title: e.target.value })}
                          type="text"
                        />
                      </div>
                    )}

                    {isGrammarMode ? (
                      <GrammarViewer text={text} />
                    ) : (currentNote.genreName === 'Ficha de Personagem' || currentNote.genreName === 'Organize-se') ? null : (
                      <>
                        {currentNote.genrePlaceholder && text.length === 0 && !guideDismissed && (
                          <div 
                            className="genre-guide-banner !border-primary/20 !bg-primary/5"
                            onClick={() => setGuideDismissed(true)}
                          >
                            <div className="genre-guide-header-label">
                              <span className="genre-guide-chip !bg-primary">{currentNote.genreName}</span>
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
                              onKeyDown={handleKeyDown}
                            />
                          ) : (
                            <textarea
                              ref={textareaRef}
                              className="w-full bg-transparent border-none focus:ring-0 font-body-reading text-body-reading text-on-surface min-h-[500px] resize-none p-0"
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
                  </article>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* Quick Access Floating Buttons (Terminal, Theme, Audio) */}
            <div className="fixed bottom-12 right-20 flex flex-col gap-3 z-30">
              <button className={`p-3 rounded-full shadow-lg transition-all ${showAudioPlayer ? 'bg-primary text-on-primary' : 'bg-white dark:bg-stone-800 text-on-surface-variant'}`} onClick={() => setShowAudioPlayer(!showAudioPlayer)}>
                <span className="material-symbols-outlined">headphones</span>
              </button>
              <button className={`p-3 rounded-full shadow-lg transition-all ${isTerminalMode ? 'bg-primary text-on-primary' : 'bg-white dark:bg-stone-800 text-on-surface-variant'}`} onClick={toggleTerminal}>
                <span className="material-symbols-outlined">terminal</span>
              </button>
            </div>
            
            <AudioPlayer isOpen={showAudioPlayer} onClose={() => setShowAudioPlayer(false)} />
          </main>

          <RightPanel 
            isOpen={true} // Always open for the hover effect
          />
        </div>
        <CustomDialog {...dialogState} />
        <CustomCursor />
        {isVerifierOpen && <VerifierModal onClose={() => setIsVerifierOpen(false)} />}
        {isBrandingOpen && <BrandingView onClose={() => setIsBrandingOpen(false)} />}
        {isPersonaMappingOpen && <PersonaMappingView onClose={() => setIsPersonaMappingOpen(false)} />}
        {isSanctuaryOpen && <SanctuaryView onClose={() => setIsSanctuaryOpen(false)} />}
        {isBookAnatomyOpen && <BookAnatomyView onClose={() => setIsBookAnatomyOpen(false)} />}
        {isAnalysisMode && <LinguisticAnalysis text={text} onClose={() => setIsAnalysisMode(false)} />}
        {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}

        {/* Footer: Metas & Status */}
        <footer className="bg-[#FDFCFB] dark:bg-stone-950 text-[#2E4D43] dark:text-emerald-400 font-serif text-[11px] uppercase tracking-widest fixed bottom-0 w-full border-t border-stone-100 dark:border-stone-900 subtle border-t flat no shadows flex justify-between items-center px-12 h-10 w-full z-20 shrink-0">
          <div className="hidden">
            Vereda © 2024
          </div>
          <div className="flex items-center gap-8 w-full justify-between">
            <span className="text-[#2E4D43] font-bold cursor-default hover:text-[#2E4D43] transition-colors">
                Meta: 1.250 / 5.000 palavras
            </span>
            <div className="flex items-center gap-6">
              <span className="text-stone-400 cursor-default hover:text-[#2E4D43] transition-colors">
                  Tempo: 45min
              </span>
              <span className="text-stone-400 cursor-default hover:text-[#2E4D43] transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                Sincronizado
              </span>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation (Hidden on md+) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-[#2E4D43] dark:bg-stone-950 rounded-t-xl shadow-[0px_-4px_20px_rgba(0,0,0,0.1)]">
          <button 
            className={`flex flex-col items-center justify-center p-2 transition-all duration-150 ${!isReviewSidebarOpen ? 'text-white bg-white/10 rounded-lg scale-95' : 'text-[#F2EFE9]/60 hover:text-white'}`}
            onClick={handleExitSpecial}
          >
            <span className="material-symbols-outlined mb-1 text-[20px]">edit_note</span>
            <span className="font-label-caps text-[10px] uppercase tracking-widest font-bold">Manuscrito</span>
          </button>
          <button 
            className={`flex flex-col items-center justify-center p-2 transition-all duration-150 ${isReviewSidebarOpen ? 'text-white bg-white/10 rounded-lg scale-95' : 'text-[#F2EFE9]/60 hover:text-white'}`}
            onClick={handleToggleReview}
          >
            <span className="material-symbols-outlined mb-1 text-[20px]">auto_stories</span>
            <span className="font-label-caps text-[10px] uppercase tracking-widest font-bold">Revisar</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center text-[#F2EFE9]/60 p-2 hover:text-white transition-opacity duration-150"
            onClick={() => setIsSidebarCollapsed(false)}
          >
            <span className="material-symbols-outlined mb-1 text-[20px]">track_changes</span>
            <span className="font-label-caps text-[10px] uppercase tracking-widest font-bold">Menu</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default App;
