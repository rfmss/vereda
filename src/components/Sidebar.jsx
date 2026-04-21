import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, GripVertical, FolderPlus, BookOpen, Feather, Theater, X } from 'lucide-react';
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
          '# A Jornada do Herói (ou Anti-Herói)\n\n"Toda grande história é sobre alguém que quer algo e encontra um obstáculo intransponível."\n\n**O Desafio:** Defina o "E se?" da sua história. E se um homem comum descobrisse que o tempo está parando?\n\n**Estrutura de Ouro:**\n• **Incidente Incitante:** O evento que tira o personagem da zona de conforto.\n• **Ponto de Não Retorno:** Onde ele decide que não pode mais voltar atrás.\n• **Clímax Emocional:** Onde o desejo e a realidade colidem.\n\n**Neuro-Gatilho:** *Identificação Projetiva.* O leitor precisa sentir que a dor do personagem é a dele.',
      },
      {
        name: 'Conto',
        title: 'Sem título',
        titlePlaceholder: 'O Alienista de Bolso',
        description: 'Um único momento, uma única virada',
        placeholder:
          '# O Instantâneo da Alma\n\n"O conto é uma fotografia, não um filme. Foque no que a lente não mostra."\n\n**O Desafio:** Escreva uma cena onde um silêncio diz mais do que mil palavras.\n\n**Estrutura de Ouro:**\n• **Unidade de Efeito:** Todo elemento deve levar à mesma emoção final.\n• **Economia de Meios:** Sem descrições inúteis. Se há uma arma na parede, ela deve disparar.\n• **Epifania:** O momento em que algo muda para sempre na mente do leitor.\n\n**Neuro-Gatilho:** *Efeito Zeigarnik.* Deixe um loop aberto na mente do leitor para que ele termine de escrever o conto na própria cabeça.',
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
          '# A Verdade como Matéria-Prima\n\n"Sua memória é o campo de batalha. Não tenha medo de trair a verdade para encontrar a sinceridade."\n\n**O Desafio:** Transforme um trauma ou alegria real em um personagem que não é você, mas sente como você.\n\n**Estrutura de Ouro:**\n• **Voz Confessional:** O tom deve ser de segredo compartilhado.\n• **O Detalhe Cru:** Escolha um objeto real da sua casa para ancorar a cena.\n• **O Ponto de Virada:** Onde o "eu" da vida real tomou uma decisão diferente do "eu" do papel.\n\n**Modelo Mental:** *Vulnerabilidade como Autoridade.* O cérebro humano se conecta instantaneamente com a falha exposta, não com a perfeição simulada.',
      },
      {
        name: 'Newsletter / Ensaio',
        title: 'Sem título',
        titlePlaceholder: 'Cartas de um Escritor em Pânico',
        description: 'Voz direta e opinativa',
        placeholder:
          '# O Diálogo Privado em Público\n\n"Escrever uma newsletter é enviar uma carta para mil amigos que você ainda não conhece."\n\n**O Desafio:** Explique uma ideia complexa através de uma anedota pessoal de café da manhã.\n\n**Estrutura de Ouro:**\n• **O Gancho (Subject Line):** Gere uma curiosidade de baixa carga cognitiva.\n• **A Tese:** Qual é a única coisa que o leitor deve levar daqui hoje?\n• **Call to Connection:** Termine com uma pergunta que peça uma resposta real, não um like.\n\n**Neuro-Gatilho:** *Reciprocidade Social.* Entregue valor antes de pedir atenção.',
      },
    ],
  },
  {
    group: 'Redes Federadas',
    icon: Plus,
    color: '#34d399',
    genres: [
      {
        name: 'Mastodon / Fediverso',
        title: 'Sem título',
        titlePlaceholder: 'O Elefante na Sala',
        description: 'Contexto e respiro visual',
        placeholder:
          '# Escrita Descentralizada\n\n"No Fediverso, a atenção não é roubada por algoritmos; ela é conquistada pela utilidade."\n\n**O Desafio:** Escreva para humanos, respeitando a etiqueta do Content Warning (CW).\n\n**Modelos Mentais:**\n• **Ancoragem de Contexto:** Evite o "Context Collapse". Defina seu nicho na primeira linha.\n• **Alt-Text Empathy:** Descrever imagens aumenta a oxitocina da comunidade e a acessibilidade real.\n• **Thread de Valor:** Se for longo, use o modelo 1/x com resumo no topo.\n\n**Neuro-Gatilho:** *Processamento Pré-atentativo.* Use quebras de linha para tornar o texto legível "antes de ler".',
      },
      {
        name: 'Nostr / Bluesky',
        title: 'Sem título',
        titlePlaceholder: 'Protocolo de Intenções',
        description: 'Soberania e fluxo de consciência',
        placeholder:
          '# O Protocolo da Verdade\n\n"A soberania digital começa na forma como você estrutura seus pensamentos."\n\n**O Desafio:** Escreva um "Post-it" mental que ressoe com a identidade soberana.\n\n**Estrutura de Ouro:**\n• **Assinatura de Voz:** No Nostr, sua chave é sua identidade. No texto, sua consistência é sua confiança.\n• **O Gatilho da Curiosidade:** Comece com uma afirmação contraintuitiva.\n• **Engajamento Honestos:** Não use "threads" caça-cliques. Use profundidade real.\n\n**Neuro-Gatilho:** *Dopamina de Descoberta.* O cérebro federado busca o novo, não o repetitivo.',
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
export function Sidebar({ notes, currentNoteId, onCreate, onCreateChapter, onSelect, onDeleteRequest, onReorder, onUpdateTitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hint, setHint] = useState(false);       // tooltip de dica
  const holdTimer = useRef(null);
  const holdFired = useRef(false);               // evita click após long-press
  const btnRef = useRef(null);

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

    const fallbackTimer = setTimeout(async () => {
      const names = await caches.keys();
      if (names.length > 0) setForceReady(true);
    }, 5000);
    return () => clearTimeout(fallbackTimer);
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

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">Vereda</h2>
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

      <div className="note-list">
        {notes.length === 0 && <p className="empty-msg">Nenhuma anotação.</p>}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={notes.map(n => n.id)} strategy={verticalListSortingStrategy}>
            {notes.map(note => (
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
    </div>
  );
}
