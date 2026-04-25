import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, GripVertical, FolderPlus, BookOpen, Feather, X, HardDrive, Download, Upload, Search, Calendar } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Catalogo de Generos Literarios ---
const GENRE_CATALOG = [
  {
    group: 'Narrativo',
    icon: 'book_5',
    color: '#d4845a',
    genres: [
      {
        name: 'Romance',
        title: 'Sem título',
        titlePlaceholder: 'Morro dos Sopros Uivantes',
        description: 'Narrativa longa e complexa',
        placeholder:
          'Comece pelo momento em que tudo muda.\n\nNão pela infância. Não pela cidade. Pelo instante exato em que o personagem percebe que não pode mais voltar ao que era antes.\n\n**Esse é o seu ponto zero.**\n\nA pergunta do romance não é *o que acontece* — é *em quem ele se transforma* ao longo do caminho. Construa esse arco. O resto vem sozinho.',
      },
      {
        name: 'Conto',
        title: 'Sem título',
        titlePlaceholder: 'O Alienista de Bolso',
        description: 'Um único momento, uma única virada',
        placeholder:
          'Um flash fotográfico no escuro: você não vê tudo — só o que importa.\n\nO conto não explica. Ele ilumina.\n\n**Uma única cena. Um único conflito.** Uma virada que o leitor não vê vir — mas que, ao olhar para trás, percebe que sempre esteve ali.\n\nQual é a cena que te assombra? Escreva só ela.',
      },
      {
        name: 'Crônica',
        title: 'Sem título',
        titlePlaceholder: 'Segunda-Feira às Três da Tarde',
        description: 'O cotidiano como matéria literária',
        placeholder:
          'O ordinário, encarado de frente, sempre revela o extraordinário.\n\nA crônica começa onde todo mundo está — no ônibus, na fila, no silêncio de uma cozinha — e termina onde ninguém esperava chegar.\n\n**Seu olhar é o instrumento.** Pegue um momento banal desta semana e empurre-o até que ele revele algo sobre o que significa estar vivo agora, aqui, neste país.',
      },
    ],
  },
  {
    group: 'Híbridos & Modernos',
    icon: 'auto_stories',
    color: '#7a8fc4',
    genres: [
      {
        name: 'Autoficção',
        title: 'Sem título',
        titlePlaceholder: 'Em Busca do Tempo que Perdi no Sofá',
        description: 'Memória real + liberdade ficcional',
        placeholder:
          'Sua memória é matéria-prima, não prisão.\n\nAutoficção não é confissão — é *traição estratégica* da verdade para encontrar uma verdade maior.\n\nComece com um detalhe físico real: uma xícara quebrada, o cheiro de um apartamento, o som da voz de alguém que você amou.\n\n**Traia os fatos. Honre o sentimento.**',
      },
      {
        name: 'Newsletter / Ensaio',
        title: 'Sem título',
        titlePlaceholder: 'Cartas de um Escritor em Pânico',
        description: 'Voz direta e opinativa',
        placeholder:
          'Você tem uma ideia que não para de voltar. Escreva para essa pessoa específica: aquela com quem você gostaria de sentar e explicar o que descobriu.\n\n**Não informe — conecte.**\n\nGancho pessoal → Tese clara → Uma história que a ilustra → Pergunta que convida à resposta. Uma ideia por texto. Sem exceções.',
      },
      {
        name: 'Poesia',
        title: 'Sem título',
        titlePlaceholder: 'Onze Formas de Dizer Adeus',
        description: 'Linguagem no limite da linguagem',
        placeholder:
          'O poema não diz — ele *mostra*.\n\nEsqueça as rimas forçadas. Pense em ritmo, em imagem, em silêncio. Pense no que uma palavra faz quando está sozinha numa linha.\n\n**Escreva a coisa mais difícil de dizer.** Depois tire metade das palavras. O que sobrar é o poema.',
      },
    ],
  },
  {
    group: 'Roteiros',
    icon: 'movie_edit',
    color: '#f59e0b',
    genres: [
      {
        name: 'Roteiro de Novela',
        title: 'Sem título',
        titlePlaceholder: 'O Outro Lado do Paraíso',
        description: 'Dramaturgia seriada, atos e cenas',
        placeholder:
          '<center>**CAPÍTULO 1**</center>\n\n**INT. SALA DE ESTAR — DIA**\n\nA primeira cena é um contrato de alma. Ela diz ao espectador exatamente o que ele vai sentir nos próximos meses.\n\n<center>**PERSONAGEM**</center>\n<center>— Não pode ser verdade.</center>\n\n<center>**OUTRO PERSONAGEM**</center>\n<center>— E no entanto é.</center>\n\n---\n\n**Formato:** Slug em MAIÚSCULO. Ação em parágrafo normal. Nome do personagem e fala centralizados (estilo dramaturgia brasileira).',
      },
      {
        name: 'Roteiro de Minissérie',
        title: 'Sem título',
        titlePlaceholder: 'Impuros — O Começo',
        description: 'Formato fechado, 4–8 episódios',
        placeholder:
          '**EXT. CIDADE — NOITE — TEASER**\n\nUma imagem. Um som. Uma pergunta sem resposta. O teaser é o anzol que prende o espectador antes mesmo dos créditos.\n\n<center>**VOZ DO PERSONAGEM (V.O.)**</center>\n<center>— Tem coisas que a gente só entende quando é tarde demais.</center>\n\n---\n\n**Estrutura:** Ep. 1 (A Ruptura) → Eps. 2-4 (A Escalada) → Ep. Final (O Abismo ou a Redenção). Cada episódio é um filme em miniatura.',
      },
      {
        name: 'Roteiro de Documentário',
        title: 'Sem título',
        titlePlaceholder: 'Sobre o Mar e Outros Silêncios',
        description: 'Narração, entrevistas e imagens',
        placeholder:
          'B-ROLL: Imagem que ancora o tema no mundo concreto.\n\nNARRADOR (OFF)\n— A primeira frase que contextualiza e já provoca.\n\nENTREVISTADO — função ou relação com o tema:\n*"A fala que nenhum roteirista poderia ter inventado."*\n\n---\n\n**Escaleta:** Sinopse → Personagem âncora humano → Virada no primeiro terço → Chamada à reflexão no final.\n\nDocumentário não é sobre o tema — é sobre as pessoas que vivem dentro dele.',
      },
    ],
  },
  {
    group: 'Redes & Voz',
    icon: 'share_reviews',
    color: '#34d399',
    genres: [
      {
        name: 'Mastodon / Fediverso',
        title: 'Sem título',
        titlePlaceholder: 'O Elefante na Sala',
        description: 'Contexto e respiro visual',
        placeholder:
          'Aqui não existe algoritmo te vigiando. Escreva para pessoas reais que *escolheram* te ouvir — e trate essa escolha como o privilégio que ela é.\n\n**Três regras:** Use Aviso de Conteúdo (CW) para tópicos sensíveis. Descreva imagens com Alt-Text — é cuidado, não burocracia. Uma boa thread vale mais que dez posts vazios.',
      },
      {
        name: 'Nostr / Bluesky',
        title: 'Sem título',
        titlePlaceholder: 'Protocolo de Intenções',
        description: 'Soberania e fluxo de consciência',
        placeholder:
          'Sua identidade é sua chave. Sua palavra é sua marca.\n\nSem algoritmo de distribuição, o que te mantém relevante é a qualidade e a consistência com que você aparece.\n\n**Comece com uma pergunta que você mesmo não sabe responder.** O engajamento aqui é conversa — não curtida.',
      },
    ],
  },
  {
    group: 'Profissional & Estrutura',
    icon: 'architecture',
    color: '#a78bfa',
    genres: [
      {
        name: 'Reportagem / Jornalismo',
        title: 'Fato em Foco',
        titlePlaceholder: 'A Cidade que Ninguém Viu',
        description: 'Fatos, lide e pirâmide invertida',
        placeholder:
          'O fato em primeiro lugar. Sempre.\n\n**Pirâmide invertida:** Quem, o quê, quando, onde, como e por quê — no primeiro parágrafo. Contexto e detalhes em ordem decrescente de importância.\n\nA história humana por trás dos dados é o que transforma uma notícia em memória. Encontre o rosto por trás do número.',
      },
      {
        name: 'Ficha de Personagem',
        title: 'Ficha de Personagem',
        titlePlaceholder: 'Nome do Personagem',
        description: 'Construção completa de personagem',
        placeholder: null,
      },
      {
        name: 'Livro (Template Completo)',
        title: 'Título do meu Livro',
        titlePlaceholder: 'Dom Casmurro e o Sumário Perdido',
        description: 'Estrutura completa: da capa ao fim',
        placeholder: null,
      },
    ],
  },
  {
    group: 'Organização & Vida',
    icon: 'calendar_today',
    color: '#ec4899',
    genres: [
      {
        name: 'Organize-se',
        title: 'Minha Organização',
        titlePlaceholder: 'Metas e Sonhos',
        description: 'Calendário anual com notas e metas',
        placeholder: null,
      },
    ],
  },
];

// --- SortableNoteItem ---
function SortableNoteItem({ note, currentNoteId, onSelect, onDeleteRequest, onUpdateTitle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  const isActive = currentNoteId === note.id;

  if (note.isChapter) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="flex items-center gap-2 px-6 py-2 mt-4 text-primary dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest opacity-60"
        {...attributes}
      >
        <div className="cursor-grab hover:text-primary transition-colors" {...listeners}>
          <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
        </div>
        <input
          className="bg-transparent border-none p-0 focus:ring-0 w-full text-[10px] font-black uppercase tracking-widest"
          value={note.title}
          onChange={(e) => onUpdateTitle && onUpdateTitle(note.id, e.target.value)}
          spellCheck="false"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-error transition-all"
          onClick={(e) => { e.stopPropagation(); onDeleteRequest(note.id); }}
        >
          <span className="material-symbols-outlined text-[14px]">delete</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="pl-12 pr-4 py-1 flex flex-col gap-2"
      onClick={() => onSelect(note.id)}
    >
      <div className={`group flex items-center justify-between py-2 pl-3 pr-2 transition-all cursor-pointer border-l-4 ${
        isActive 
          ? 'text-[#2E4D43] dark:text-emerald-400 bg-[#EAE7E0] dark:bg-stone-900/50 border-[#2E4D43] dark:border-emerald-500 font-bold rounded-r-lg' 
          : 'text-stone-500 dark:text-stone-400 border-transparent hover:bg-[#EAE7E0]/50 dark:hover:bg-stone-900/30'
      }`}>
        <div className="flex-1 min-width-0">
          <div className="text-sm truncate">
            {String(note.title || '').trim() ? note.title : 'Sem título'}
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="cursor-grab text-stone-300 hover:text-stone-500" {...attributes} {...listeners}>
            <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
          </div>
          <button
            className="text-stone-300 hover:text-error"
            onClick={(e) => { e.stopPropagation(); onDeleteRequest(note.id); }}
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- GenreMenu ---
function GenreMenu({ isOpen, onSelect, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.genre-menu')) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="genre-menu fixed left-[290px] top-20 w-72 bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 rounded-lg z-[100] overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Gêneros</span>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"><X size={16} /></button>
      </div>
      <div className="max-h-[400px] overflow-y-auto p-2 space-y-4">
        {GENRE_CATALOG.map(group => {
          return (
            <div key={group.group} className="space-y-1">
              <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter" style={{ color: group.color }}>
                <span className="material-symbols-outlined text-[14px]">{group.icon}</span>
                {group.group}
              </div>
              {group.genres.map(genre => (
                <button
                  key={genre.name}
                  className="w-full text-left px-3 py-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group"
                  onClick={() => { onSelect(genre); onClose(); }}
                >
                  <div className="text-sm font-semibold text-stone-700 dark:text-stone-200 group-hover:text-primary transition-colors">{genre.name}</div>
                  <div className="text-[10px] text-stone-400 italic line-clamp-1">{genre.description}</div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Sidebar ---
export function Sidebar({ 
  notes, currentNoteId, onCreate, onCreateChapter, onSelect, 
  onDeleteRequest, onReorder, onUpdateTitle, onImportNotes,
  onImportRequest, onAlertRequest, isDark, setIsDark,
  isSidebarCollapsed, setIsSidebarCollapsed,
  onOpenVerifier,
  onOpenBranding,
  onOpenPersonaMapping,
  onOpenSanctuary,
  onOpenBookAnatomy,
  onOpenDictionary, isDictionaryOpen
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const holdTimer = useRef(null);
  const holdFired = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const filteredNotes = useCallback(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.trim().toLowerCase();
    const isHashtag = query.startsWith('#');
    const term = isHashtag ? query.slice(1) : query;
    return notes.filter(note => {
      if (note.isChapter) return false;
      if (note.tags && note.tags.some(t => t.toLowerCase().includes(term))) return true;
      if (String(note.title || '').toLowerCase().includes(term)) return true;
      if (String(note.genreName || '').toLowerCase().includes(term)) return true;
      return false;
    });
  }, [notes, searchQuery]);

  const visibleNotes = filteredNotes();
  const isFiltering = searchQuery.trim().length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = notes.findIndex((n) => n.id === active.id);
      const newIndex = notes.findIndex((n) => n.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  const startHold = () => {
    holdFired.current = false;
    holdTimer.current = setTimeout(() => {
      holdFired.current = true;
      setMenuOpen(true);
    }, 480);
  };

  const cancelHold = () => clearTimeout(holdTimer.current);

  const handleClick = () => {
    if (holdFired.current) return;
    onCreate();
  };

  const handleExportAll = () => {
    const d = new Date();
    const filename = `vereda-backup-${d.getTime()}.json`;
    const payload = { vereda_backup: true, exported_at: d.toISOString(), notes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.vereda_backup && onImportRequest) onImportRequest(data.notes);
      } catch {
        if (onAlertRequest) onAlertRequest('Erro ao ler o arquivo.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <nav className={`fixed left-0 top-0 flex flex-col h-full py-6 w-sidebar-width border-r border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-950 z-20 shrink-0 transition-all duration-500 ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
      
      <button 
        className="absolute top-6 right-2 text-on-surface-variant hover:text-primary transition-colors p-1" 
        onClick={() => setIsSidebarCollapsed(true)}
        title="Recolher painel"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Sidebar Header */}
      <div className="p-6 pb-2 border-b border-stone-200/50 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif font-bold text-lg text-[#2E4D43] dark:text-emerald-500 font-h2 text-h2 truncate">Vereda</h2>
          <span className="bg-primary/10 dark:bg-emerald-500/10 text-[#2E4D43] dark:text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-primary/20">PoHW</span>
        </div>
        <p className="font-helper-text text-xs text-stone-500 truncate">Human Integrity Verified</p>
      </div>

      {/* Primary Action */}
      <div className="px-4 mb-6">
        <button 
          className="w-full bg-primary dark:bg-emerald-600 text-on-primary dark:text-white py-2.5 px-4 rounded hover:bg-primary-container dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onClick={handleClick}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Novo Capítulo
        </button>
      </div>

      <GenreMenu
        isOpen={menuOpen}
        onSelect={(g) => onCreate(g)}
        onClose={() => setMenuOpen(false)}
      />

      {/* Navigation & List */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 mb-4">
          <li>
            <button 
              className={`w-full border-l-2 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center group transition-all ${!isDictionaryOpen ? 'border-[#2E4D43] dark:border-emerald-500 bg-[#2E4D43]/5 text-[#2E4D43] dark:text-emerald-400' : 'border-transparent text-stone-600 dark:text-stone-400'}`}
              onClick={() => onOpenDictionary('')}
            >
              <span className={`material-symbols-outlined mr-3 text-lg opacity-80 group-hover:opacity-100 transition-opacity ${!isDictionaryOpen ? 'fill' : ''}`}>menu_book</span>
              <span className="font-body-ui text-body-ui">Manuscript</span>
            </button>
          </li>
          <li>
            <button 
              className="w-full text-stone-600 dark:text-stone-400 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-2 border-transparent flex items-center group transition-colors"
              onClick={onOpenVerifier}
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-80 transition-opacity">gavel</span>
              <span className="font-body-ui text-body-ui">Cartório Digital</span>
            </button>
          </li>
          <li>
            <button 
              className="w-full text-stone-600 dark:text-stone-400 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-2 border-transparent flex items-center group transition-colors"
              onClick={onOpenBranding}
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-80 transition-opacity">rocket_launch</span>
              <span className="font-body-ui text-body-ui">Trilha do Lançamento</span>
            </button>
          </li>
          <li>
            <button 
              className="w-full text-stone-600 dark:text-stone-400 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-2 border-transparent flex items-center group transition-colors"
              onClick={onOpenPersonaMapping}
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-80 transition-opacity">groups</span>
              <span className="font-body-ui text-body-ui">Personas</span>
            </button>
          </li>
          <li>
            <button 
              className="w-full text-stone-600 dark:text-stone-400 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-2 border-transparent flex items-center group transition-colors"
              onClick={onOpenSanctuary}
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-80 transition-opacity">spa</span>
              <span className="font-body-ui text-body-ui">Santuário</span>
            </button>
          </li>
          <li>
            <button 
              className="w-full text-stone-600 dark:text-stone-400 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-2 border-transparent flex items-center group transition-colors"
              onClick={onOpenBookAnatomy}
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-80 transition-opacity">menu_book</span>
              <span className="font-body-ui text-body-ui">Anatomia do Livro</span>
            </button>
          </li>
          <li>
            <button 
              className="w-full text-stone-600 dark:text-stone-400 pl-4 py-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-2 border-transparent flex items-center group transition-colors"
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-80 transition-opacity">edit_note</span>
              <span className="font-body-ui text-body-ui">Notes</span>
            </button>
          </li>
        </ul>

        <div className="px-6 mb-4 mt-8 flex justify-between items-center">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant dark:text-stone-400 uppercase tracking-widest text-[10px]">Capítulos</h3>
          <button className="material-symbols-outlined text-stone-400 hover:text-primary text-sm" onClick={() => onCreateChapter()}>add</button>
        </div>

        <div className="space-y-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={visibleNotes.map(n => n.id)} strategy={verticalListSortingStrategy}>
                {visibleNotes.map(note => (
                  <SortableNoteItem
                    key={note.id}
                    note={note}
                    currentNoteId={currentNoteId}
                    onSelect={onSelect}
                    onDeleteRequest={onDeleteRequest}
                    onUpdateTitle={onUpdateTitle}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {notes.length === 0 && (
              <div className="px-8 py-4 text-xs text-stone-400 italic">Nenhuma obra iniciada...</div>
            )}
        </div>

        <div className="px-6 mt-8 mb-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant dark:text-stone-400 uppercase tracking-widest text-[10px]">Documentos</h3>
        </div>
        <button className="w-full flex items-center gap-3 px-8 py-3 text-stone-500 dark:text-stone-400 opacity-70 hover:bg-[#EAE7E0] dark:hover:bg-stone-900 transition-all cursor-pointer rounded-r-lg group" onClick={() => onCreateChapter()}>
          <span className="material-symbols-outlined text-lg opacity-60 group-hover:opacity-100 transition-opacity">inventory_2</span>
          <span className="font-body-ui text-body-ui">Arquivo Geral</span>
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-950">
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center px-3 py-2 rounded text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors group" onClick={handleExportAll}>
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-100">cloud_upload</span>
              <span className="font-helper-text text-xs">Backup</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center px-3 py-2 rounded text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors group" onClick={() => fileInputRef.current?.click()}>
              <span className="material-symbols-outlined mr-3 text-lg opacity-60 group-hover:opacity-100">restore</span>
              <span className="font-helper-text text-xs">Restore</span>
            </button>
          </li>
        </ul>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </nav>
  );
}
