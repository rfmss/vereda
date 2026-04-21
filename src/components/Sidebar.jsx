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
const GENRE_CATALOG = [
  {
    group: 'Narrativo',
    icon: BookOpen,
    color: '#d4845a',
    genres: [
      {
        name: 'Romance',
        title: 'Sem título',
        description: 'Narrativa longa e complexa',
        placeholder:
          'Apresente seu protagonista. Qual é o maior desejo dele? Qual obstáculo se coloca em seu caminho?\n\nO romance vive de tensão. Coloque seu personagem numa situação impossível — e veja o que ele faz.',
      },
      {
        name: 'Novela',
        title: 'Sem título',
        description: 'Extensão média, ritmo acelerado',
        placeholder:
          'Comece in medias res — no meio da ação. A novela não tem tempo a perder.\n\nQual é o conflito central? Apresente-o nas primeiras linhas.',
      },
      {
        name: 'Conto',
        title: 'Sem título',
        description: 'Um único momento, uma única virada',
        placeholder:
          'Menos é mais. Um único instante, um único personagem, uma única revelação.\n\nO conto perfeito cabe numa página e dura uma vida inteira.',
      },
      {
        name: 'Crônica',
        title: 'Sem título',
        description: 'O cotidiano com profundidade',
        placeholder:
          'O que você viu hoje que merecia ser guardado?\n\nA crônica transforma o ordinário em extraordinário. Comece com uma cena simples — e vá fundo.',
      },
      {
        name: 'Epopeia',
        title: 'Sem título',
        description: 'Feitos heroicos em verso longo',
        placeholder:
          'Invoque a musa. Declare o tema.\n\n"Canto o herói que..." — o leitor precisa saber, desde a primeira linha, que algo grandioso está por vir.',
      },
    ],
  },
  {
    group: 'Lírico',
    icon: Feather,
    color: '#7a8fc4',
    genres: [
      {
        name: 'Poema',
        title: 'Sem título',
        description: 'Versos e estrofes livres',
        placeholder:
          'Escolha uma imagem. Deixe-a respirar em versos.\n\nO poema não explica — ele mostra. Cada palavra carrega peso; nenhuma é acidente.',
      },
      {
        name: 'Soneto',
        title: 'Sem título',
        description: '14 versos, uma ideia inteira',
        placeholder:
          'Dois quartetos, dois tercetos. Uma ideia inteira.\n\nQuarteto I: apresente o tema.\nQuarteto II: desenvolva a tensão.\nTerceto I: o giro inesperado.\nTerceto II: o verso que fecha tudo.',
      },
      {
        name: 'Canção',
        title: 'Sem título',
        description: 'Para ser cantado, para ser sentido',
        placeholder:
          'Deixe o ritmo guiar as palavras. Repita o que importa.\n\nO refrão é a emoção central — encontre-o primeiro. Depois construa o mundo ao redor.',
      },
    ],
  },
  {
    group: 'Dramático',
    icon: Theater,
    color: '#8b7355',
    genres: [
      {
        name: 'Tragédia',
        title: 'Sem título',
        description: 'Grandeza e queda fatal',
        placeholder:
          'Apresente o herói no auge. O declínio virá.\n\nHamártia: qual é o defeito fatal? O que ele não consegue ver em si mesmo?\n\nPersonagem A — \nPersonagem B — ',
      },
      {
        name: 'Comédia',
        title: 'Sem título',
        description: 'O riso como espelho',
        placeholder:
          'O riso revela verdades. Qual é o equívoco que vai desencadear tudo?\n\nA comédia exige ritmo. Cada réplica deve ser mais surpreendente que a anterior.\n\nPersonagem A — \nPersonagem B — ',
      },
      {
        name: 'Drama Histórico',
        title: 'Sem título',
        description: 'O passado como palco',
        placeholder:
          'O passado como palco. Qual evento histórico vive aqui?\n\nA história já aconteceu — mas os personagens ainda não sabem o que vai acontecer. Esse é o drama.\n\nCenário: \nÉpoca: ',
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

  // ── Long-press logic ────────────────────────────────────────────────────────
  const startHold = (e) => {
    // Ignora cliques que vêm do dnd-kit (drag start)
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
    if (holdFired.current) return; // long-press já abriu o menu
    onCreate();                    // click simples → nota em branco
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
