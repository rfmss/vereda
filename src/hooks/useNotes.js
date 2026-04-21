import { useState, useEffect } from 'react';

export function useNotes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('pohw_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [currentNoteId, setCurrentNoteId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('pohw_notes', JSON.stringify(notes));
    } catch (e) {
      console.warn("Storage is full or inaccessible", e);
    }
  }, [notes]);

  const createNote = (title = '', genre = null) => {
    const newNote = {
      id: Date.now().toString(),
      title: title || (genre ? genre.title : ''),
      // Se o gênero tiver initialContent (como o template de livro), usamos ele.
      // Caso contrário, começa vazio.
      content: genre && genre.initialContent ? genre.initialContent : '',
      genrePlaceholder: genre ? genre.placeholder : null,
      genreName: genre ? genre.name : null,
      titlePlaceholder: genre ? genre.titlePlaceholder : null,
      eventLog: [],
      humanScore: 0,
      pastedChunks: 0,
      wordGoal: 0,
      snapshots: [],
      lastModified: Date.now(),
      bgIndex: Math.floor(Math.random() * 5)
    };
    setNotes(prev => [newNote, ...prev]);
    setCurrentNoteId(newNote.id);
    return newNote;
  };

  const updateCurrentNote = (updates) => {
    if (!currentNoteId) return;
    setNotes(prev => prev.map(note => 
      note.id === currentNoteId 
        ? { ...note, ...updates, lastModified: Date.now() } 
        : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (currentNoteId === id) {
      setCurrentNoteId(null);
    }
  };

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, lastModified: Date.now() } 
        : note
    ));
  };

  const createChapter = (title = 'Novo Capítulo') => {
    const newChapter = {
      id: Date.now().toString(),
      title: title,
      isChapter: true,
      lastModified: Date.now()
    };
    setNotes(prev => [...prev, newChapter]);
    return newChapter;
  };

  const reorderNotes = (oldIndex, newIndex) => {
    setNotes((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  };

  const createSnapshot = (noteId, content, title) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      const finalContent = content !== undefined ? content : note.content;
      const finalTitle = title !== undefined ? title : note.title;
      const snapshot = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content: finalContent,
        title: finalTitle,
        words: finalContent.trim().split(/\s+/).filter(w => w.length > 0).length
      };
      return { ...note, snapshots: [snapshot, ...(note.snapshots || [])] };
    }));
  };

  const restoreSnapshot = (noteId, snapshotId) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      const snapshot = (note.snapshots || []).find(s => s.id === snapshotId);
      if (!snapshot) return note;
      return { ...note, content: snapshot.content, title: snapshot.title, lastModified: Date.now() };
    }));
  };

  const importNotes = (importedNotes) => {
    setNotes(importedNotes);
    setCurrentNoteId(importedNotes[0]?.id || null);
  };

  const currentNote = notes.find(n => n.id === currentNoteId) || null;

  return {
    notes,
    currentNote,
    currentNoteId,
    setCurrentNoteId,
    createNote,
    createChapter,
    updateCurrentNote,
    updateNote,
    deleteNote,
    reorderNotes,
    createSnapshot,
    restoreSnapshot,
    importNotes,
  };
}
