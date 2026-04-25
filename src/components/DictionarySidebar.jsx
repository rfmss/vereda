import React, { useState } from 'react';

export function DictionarySidebar({ isOpen, onClose, initialWord = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialWord);

  // Mock dictionary data
  const dictionaryData = {
    'efêmero': {
      phonetic: "/e'fêmero/",
      etymology: 'Do grego ephémeros',
      pos: 'Adjetivo',
      editorialNote: 'Pense no adjetivo como o tempero da frase: use com moderação para não esconder o sabor principal.',
      meanings: [
        {
          definition: 'Que tem a duração de apenas um dia; que dura muito pouco.',
          example: 'A glória dos homens é uma ilusão efêmera.'
        },
        {
          definition: 'De caráter passageiro, transitório, fugaz.',
          example: 'Sentia uma alegria efêmera ao observar o pôr do sol.'
        }
      ],
      synonyms: ['breve', 'fugaz', 'passageiro', 'transitório'],
      antonyms: ['duradouro', 'eterno', 'permanente']
    }
  };

  const activeWord = dictionaryData[searchTerm.toLowerCase()] || null;

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-16 flex flex-col h-[calc(100vh-64px)] w-[380px] bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 z-40 animate-in slide-in-from-right duration-500 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Search Header */}
      <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 sticky top-0 z-10">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-stone-400 text-[20px]">search</span>
          <input 
            className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-lg pl-10 pr-4 py-2.5 font-body-ui text-sm text-on-surface dark:text-stone-200 focus:ring-1 focus:ring-primary-container placeholder-stone-400" 
            placeholder="Buscar no dicionário..." 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dictionary Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {activeWord ? (
          <>
            <header>
              <h2 className="font-display-lg text-4xl text-on-surface dark:text-white tracking-tight mb-2 italic">{searchTerm}</h2>
              <div className="flex items-center gap-3 font-body-ui text-xs text-stone-400">
                <span>{activeWord.phonetic}</span>
                <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                <span className="italic">{activeWord.etymology}</span>
              </div>
            </header>

            <div>
              <span className="inline-flex items-center px-2.5 py-1 bg-secondary/10 dark:bg-orange-950/30 text-secondary dark:text-orange-400 font-label-caps text-[10px] uppercase tracking-widest rounded font-bold">
                {activeWord.pos}
              </span>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800 border-l-2 border-secondary dark:border-orange-500 p-4 rounded-r-lg">
              <p className="font-body-ui text-xs text-stone-500 dark:text-stone-400 italic leading-relaxed">
                "{activeWord.editorialNote}"
              </p>
            </div>

            <div className="space-y-6">
              {activeWord.meanings.map((m, i) => (
                <div key={i}>
                  <div className="flex gap-3">
                    <span className="font-label-caps text-[10px] text-primary dark:text-emerald-500 mt-1 shrink-0 font-bold">{i + 1}.</span>
                    <p className="font-body-ui text-sm text-on-surface dark:text-stone-200 leading-relaxed">{m.definition}</p>
                  </div>
                  <p className="ml-5 mt-2 font-body-ui text-xs text-stone-500 dark:text-stone-400 italic border-l border-stone-200 dark:border-stone-700 pl-3">
                    "{m.example}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-5">
              <div>
                <h3 className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest mb-3 font-bold">Sinônimos</h3>
                <div className="flex flex-wrap gap-2">
                  {activeWord.synonyms.map(s => (
                    <span key={s} className="px-3 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-on-surface dark:text-stone-300 font-body-ui text-xs hover:border-primary-container cursor-pointer transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest mb-3 font-bold">Antônimos</h3>
                <div className="flex flex-wrap gap-2">
                  {activeWord.antonyms.map(a => (
                    <span key={a} className="px-3 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-on-surface dark:text-stone-300 font-body-ui text-xs hover:border-primary-container cursor-pointer transition-colors">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-stone-300 dark:text-stone-700 text-center gap-4 py-20">
            <span className="material-symbols-outlined text-6xl">menu_book</span>
            <p className="font-label-caps text-xs">Busque por palavras para ver definições e sinônimos</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex justify-center">
        <button 
          onClick={onClose}
          className="text-stone-400 hover:text-primary transition-colors flex items-center gap-2 font-label-caps text-[10px] tracking-widest font-bold"
        >
          FECHAR DICIONÁRIO
        </button>
      </div>
    </aside>
  );
}
