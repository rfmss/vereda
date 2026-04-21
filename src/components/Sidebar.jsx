import React from 'react';
import { Plus, Trash2, GripVertical, FolderPlus } from 'lucide-react';
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
        <div className="note-item-meta">
          <span>{new Date(note.lastModified).toLocaleDateString()}</span>
          <button 
            className="delete-btn"
            onClick={(e) => { 
              e.stopPropagation(); 
              onDeleteRequest(note.id);
            }}
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

export function Sidebar({ notes, currentNoteId, onCreate, onCreateChapter, onSelect, onDeleteRequest, onReorder, onUpdateTitle }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = notes.findIndex((n) => n.id === active.id);
      const newIndex = notes.findIndex((n) => n.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">Vereda</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => onCreateChapter()} className="icon-btn" data-tooltip="Novo Divisor de Capítulo">
            <FolderPlus size={18} strokeWidth={2} />
          </button>
          <button onClick={() => onCreate()} className="icon-btn" data-tooltip="Nova Anotação">
            <Plus size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="note-list">
        {notes.length === 0 && <p className="empty-msg">Nenhuma anotação.</p>}
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={notes.map(n => n.id)}
            strategy={verticalListSortingStrategy}
          >
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
