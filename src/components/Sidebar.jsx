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

// ─── Catálogo de Gêneros Literários ──────────────────────────────────────────
// placeholder: texto "fantasma" que ensina o escritor. NUNCA entra no content.
const GENRE_CATALOG = [
  {
    group: 'Narrativo',
    icon: BookOpen,
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
    icon: Feather,
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
    icon: Feather,
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
    icon: Plus,
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
    icon: HardDrive,
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
    icon: Calendar,
    color: '#ec4899',
    genres: [
      {
        name: 'Planner 2026',
        title: 'Meu Planejamento 2026',
        titlePlaceholder: 'Metas e Sonhos 2026',
        description: 'Calendário anual com notas adesivas',
        placeholder: null,
      },
    ],
  },
];

// ─── SortableNoteItem ─────────────────────────────────────────────────────────
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

  if (note.isChapter) {
    return (
      <div ref={setNodeRef} style={style} className="chapter-divider" {...attributes}>
        <div className="chapter-drag-handle" {...listeners}>
          <GripVertical size={14} />
        </div>
        <input
          className="chapter-title-input"
          value={note.title}
          onChange={(e) => onUpdateTitle && onUpdateTitle(note.id, e.target.value)}
          spellCheck="false"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="delete-btn chapter-delete"
          onClick={(e) => { e.stopPropagation(); onDeleteRequest(note.id); }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`note-item ${currentNoteId === note.id ? 'active' : ''}`}
      onClick={() => onSelect(note.id)}
    >
      <div className="note-drag-handle" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <div className="note-item-content">
        <div className="note-item-title">
          {String(note.title || '').trim() ? note.title : 'Sem título'}
        </div>
        {note.genreName && (
          <div className="note-genre-badge">{note.genreName}</div>
        )}
        <div className="note-item-meta">
          <span>{new Date(note.lastModified).toLocaleDateString()}</span>
          <button
            className="delete-btn"
            onClick={(e) => { e.stopPropagation(); onDeleteRequest(note.id); }}
            data-tooltip="Deletar"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="note-tag">{tag}</span>
            ))}
            {note.tags.length > 3 && <span className="note-tag">+{note.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GenreMenu ────────────────────────────────────────────────────────────────
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
    <div className="genre-menu" role="menu" aria-label="Escolha um gênero literário">
      {/* Cabeçalho */}
      <div className="genre-menu-header">
        <span>Escolha um gênero</span>
        <button className="genre-menu-close" onClick={onClose}><X size={14} /></button>
      </div>

      <div className="genre-menu-content">
        {GENRE_CATALOG.map(group => {
          const GroupIcon = group.icon;
          return (
            <div key={group.group} className="genre-group">
              <div className="genre-group-label" style={{ color: group.color }}>
                <GroupIcon size={12} strokeWidth={2.5} />
                {group.group}
              </div>
              {group.genres.map(genre => (
                <button
                  key={genre.name}
                  className="genre-item"
                  role="menuitem"
                  onClick={() => { onSelect(genre); onClose(); }}
                >
                  <span className="genre-item-name">{genre.name}</span>
                  <span className="genre-item-desc">{genre.description}</span>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ 
  notes, currentNoteId, onCreate, onCreateChapter, onSelect, 
  onDeleteRequest, onReorder, onUpdateTitle, onImportNotes,
  onImportRequest, onAlertRequest 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hint, setHint] = useState(false);       // tooltip de dica
  const holdTimer = useRef(null);
  const holdFired = useRef(false);               // evita click após long-press
  const btnRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // ─── Filtragem de notas ───────────────────────────────────────
  const filteredNotes = useCallback(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.trim().toLowerCase();
    const isHashtag = query.startsWith('#');
    const term = isHashtag ? query.slice(1) : query;
    return notes.filter(note => {
      // Capítulos sempre aparecem para manter contexto visual
      if (note.isChapter) return true;
      // Busca em tags
      if (note.tags && note.tags.some(t => t.toLowerCase().includes(term))) return true;
      // Busca em título
      if (String(note.title || '').toLowerCase().includes(term)) return true;
      // Busca em nome do gênero
      if (String(note.genreName || '').toLowerCase().includes(term)) return true;
      return false;
    });
  }, [notes, searchQuery]);

  const visibleNotes = filteredNotes();
  const isFiltering = searchQuery.trim().length > 0;
  const matchCount = isFiltering ? visibleNotes.filter(n => !n.isChapter).length : null;

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

  const startHold = (e) => {
    holdFired.current = false;
    holdTimer.current = setTimeout(() => {
      holdFired.current = true;
      setMenuOpen(true);
    }, 480);
  };

  const cancelHold = () => {
    clearTimeout(holdTimer.current);
  };

  const handleClick = () => {
    if (holdFired.current) return;
    onCreate();
  };

  const handleGenreSelect = (genre) => {
    onCreate(genre);
  };

  // ─── Export / Import ─────────────────────────────────────────────
  const fileInputRef = useRef(null);

  const handleExportAll = () => {
    const pad = (n) => String(n).padStart(2, '0');
    const d = new Date();
    const time = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const filename = `vereda-backup-${time}-${date}.json`;
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

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.vereda_backup || !Array.isArray(data.notes)) {
          if (onAlertRequest) onAlertRequest('Arquivo inválido. Use um backup exportado pelo Vereda.');
          return;
        }
        
        if (onImportRequest) {
          onImportRequest(data.notes);
        }
      } catch {
        if (onAlertRequest) onAlertRequest('Erro ao ler o arquivo. Certifique-se de que é um JSON válido.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">
          Vereda
          <span className="logo-sub">Para Escritores Brasileiros</span>
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={() => onCreateChapter()}
            className="icon-btn"
            data-tooltip="Novo Divisor de Capítulo"
          >
            <FolderPlus size={18} strokeWidth={2} />
          </button>

          {/* Botão + com long-press */}
          <div className="new-note-btn-wrapper">
            <button
              ref={btnRef}
              className={`icon-btn new-note-btn ${menuOpen ? 'active' : ''}`}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onClick={handleClick}
              onMouseEnter={() => setHint(true)}
              onMouseLeave={() => { setHint(false); cancelHold(); }}
              data-tooltip=""
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Plus size={20} strokeWidth={2} />
            </button>

            {/* Hint de dica */}
            {hint && !menuOpen && (
              <div className="new-note-hint">
                Nova anotação
                <span className="hint-hold">Segure para mais opções</span>
              </div>
            )}

            {/* Menu de gêneros */}
            <GenreMenu
              isOpen={menuOpen}
              onSelect={handleGenreSelect}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* ─── Barra de Busca ─────────────────────────────────── */}
      <div className={`sidebar-search ${isFiltering ? 'sidebar-search--active' : ''}`}>
        <Search size={13} className="sidebar-search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="sidebar-search-input"
          placeholder="Buscar por título ou #tag…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          spellCheck="false"
          aria-label="Filtrar anotações"
        />
        {isFiltering && (
          <button
            className="sidebar-search-clear"
            onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
            aria-label="Limpar busca"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Contador de resultados */}
      {isFiltering && (
        <div className="sidebar-search-results">
          {matchCount === 0
            ? 'Nenhuma anotação encontrada'
            : `${matchCount} anotaç${matchCount === 1 ? 'ão' : 'ões'} encontrada${matchCount === 1 ? '' : 's'}`
          }
        </div>
      )}

      <div className="note-list">
        {notes.length === 0 && <p className="empty-msg">Nenhuma anotação.</p>}
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
      </div>

      {/* Rodapé discreto: Backup & Restaurar */}
      <div className="sidebar-footer">
        <button
          className="sidebar-footer-btn"
          onClick={handleExportAll}
          data-tooltip="Exportar Backup (.json)"
        >
          <Download size={14} strokeWidth={2.5} />
          <span>Backup</span>
        </button>
        <button
          className="sidebar-footer-btn sidebar-footer-btn--import"
          onClick={handleImportClick}
          data-tooltip="Restaurar Backup (Sobrescreve tudo!)"
        >
          <Upload size={14} strokeWidth={2.5} />
          <span>Restaurar</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
