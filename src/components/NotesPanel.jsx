import React from 'react';

export function NotesPanel() {
  const notes = [
    {
      id: 1,
      type: 'Personagem',
      title: 'Diadorim',
      content: 'Enfatizar a ambiguidade nos olhos. Lembrar da descrição da fogueira do capítulo anterior.',
      color: 'secondary'
    },
    {
      id: 2,
      type: 'Cenário',
      title: 'A Vereda Torta',
      content: 'Inserir descrição do cheiro de buriti molhado quando a chuva chegar.',
      color: 'primary'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {notes.map(note => (
        <div 
          key={note.id}
          className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm relative group hover:border-primary/30 transition-all duration-300"
        >
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-stone-400 hover:text-primary">
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${note.color === 'secondary' ? 'bg-secondary/10 text-secondary dark:text-orange-400' : 'bg-primary/10 text-primary dark:text-emerald-500'}`}>
              {note.type}
            </span>
          </div>
          <h4 className="font-h2 text-sm font-bold text-on-surface dark:text-stone-100 mb-2 leading-tight">
            {note.title}
          </h4>
          <p className="font-helper-text text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {note.content}
          </p>
        </div>
      ))}

      {/* Add Note Button */}
      <button className="w-full py-4 border border-dashed border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl flex items-center justify-center gap-2 transition-all group">
        <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">add</span>
        <span className="font-label-caps text-[10px] uppercase tracking-widest font-bold">Adicionar Nota</span>
      </button>
    </div>
  );
}
