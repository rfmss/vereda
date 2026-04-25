import React from 'react';

export function ReviewSidebar({ isOpen, onClose, text, goal }) {
  const getStats = () => {
    if (!text) return { words: 0, readTime: 0, sentences: [] };
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return { 
      words: words.length, 
      readTime: Math.ceil(words.length / 200),
      sentences: sentences.map(s => s.trim().split(/\s+/).length)
    };
  };

  const stats = getStats();
  const progress = Math.min(100, (stats.words / (goal || 500)) * 100);

  // Regionalisms detection
  const regionalisms = [
    'UMBUZEIRO', 'ALPERCATA', 'BORNAL', 'RAPADURA', 'PEIXEIRA', 'MORMAÇO', 
    'VIXE', 'OXENTE', 'MANDACARU', 'XIQUEXIQUE', 'CAATINGA', 'SERTÃO'
  ];
  const detectedRegionalisms = regionalisms.filter(r => 
    text?.toUpperCase().includes(r)
  );

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-0 flex flex-col h-full py-6 w-sidebar-width border-l border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-950 z-20 shrink-0 animate-in slide-in-from-right duration-500">
      <div className="px-6 mb-8 flex items-center justify-between">
        <h2 className="font-h2 text-h2 text-primary dark:text-stone-100 text-[20px]">Análise Literária</h2>
        <button 
          className="material-symbols-outlined text-on-surface-variant dark:text-stone-400 cursor-pointer hover:text-primary dark:hover:text-emerald-400 transition-colors p-1 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800 focus:outline-none" 
          onClick={onClose}
        >
          close
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-6 scrollbar-hide">
        {/* Métrica de Ritmo */}
        <section className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-stone-200/50 dark:border-stone-800">
          <h3 className="font-body-ui text-body-ui font-semibold text-on-surface dark:text-stone-200 mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px] text-surface-tint">waves</span>
            Ritmo do Texto
          </h3>
          <div className="h-20 flex items-end justify-between space-x-1 mb-2">
            {stats.sentences.slice(-12).map((len, i) => (
              <div 
                key={i}
                className={`w-full rounded-t transition-all duration-500 ${len < 10 ? 'bg-secondary' : 'bg-primary-container'}`} 
                style={{ height: `${Math.min(100, (len / 30) * 100)}%` }}
                title={`${len} palavras`}
              ></div>
            ))}
            {stats.sentences.length === 0 && (
              <div className="w-full h-px bg-stone-100 dark:bg-stone-800"></div>
            )}
          </div>
          <div className="flex justify-between font-helper-text text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-stone-500">
            <span>Staccato</span>
            <span>Fluxo</span>
          </div>
        </section>

        {/* Legibilidade Flesch-BR */}
        <section className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-stone-200/50 dark:border-stone-800">
          <h3 className="font-body-ui text-body-ui font-semibold text-on-surface dark:text-stone-200 mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px] text-surface-tint">speed</span>
            Legibilidade
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="3" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary-container" strokeWidth="3" strokeDasharray="68, 100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-primary dark:text-emerald-500">68</div>
            </div>
            <div>
              <p className="font-body-ui text-sm text-on-surface dark:text-stone-200 font-medium">Prosa Literária</p>
              <p className="font-helper-text text-xs text-on-surface-variant dark:text-stone-400">Padrão desafiador adulto.</p>
            </div>
          </div>
        </section>

        {/* Laboratório de Estilo */}
        <section className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-stone-200/50 dark:border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body-ui text-body-ui font-semibold text-on-surface dark:text-stone-200 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px] text-surface-tint">science</span>
              Estilo
            </h3>
            <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full">Alertas</span>
          </div>
          <ul className="space-y-3">
            <li className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded border-l-2 border-secondary">
              <span className="font-helper-text text-[11px] font-bold text-on-surface dark:text-stone-200 block mb-1">Ritmo Lento</span>
              <p className="font-helper-text text-xs text-on-surface-variant dark:text-stone-400">Sentenças longas seguidas podem cansar o leitor.</p>
            </li>
            {text?.includes('então') && (
              <li className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded border-l-2 border-stone-400">
                <span className="font-helper-text text-[11px] font-bold text-on-surface dark:text-stone-200 block mb-1">Palavra de Enchimento</span>
                <p className="font-helper-text text-xs text-on-surface-variant dark:text-stone-400">"então" identificado. Considere remover para concisão.</p>
              </li>
            )}
          </ul>
        </section>

        {/* Voz Brasileira */}
        <section className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-stone-200/50 dark:border-stone-800">
          <h3 className="font-body-ui text-body-ui font-semibold text-on-surface dark:text-stone-200 mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px] text-surface-tint">record_voice_over</span>
            Voz Brasileira
          </h3>
          <div className="flex flex-wrap gap-2">
            {detectedRegionalisms.length > 0 ? detectedRegionalisms.map(r => (
              <span key={r} className="px-2 py-1 bg-tertiary-fixed dark:bg-stone-800 text-on-tertiary-fixed dark:text-stone-300 rounded font-label-caps text-[10px] border border-tertiary-fixed-dim dark:border-stone-700">
                {r}
              </span>
            )) : (
              <p className="font-helper-text text-xs text-stone-400 italic">Nenhum regionalismo detectado ainda.</p>
            )}
          </div>
        </section>

        {/* Metas de Escrita */}
        <section className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-stone-200/50 dark:border-stone-800 mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-caps text-[10px] uppercase text-stone-400">Progresso</span>
            <span className="font-bold text-on-surface dark:text-stone-200 text-sm">{stats.words} / {goal || 500}</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary dark:bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </section>
      </div>
      
      <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 mt-auto">
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 text-center">Vereda Intelligence • 2026</p>
      </div>
    </aside>
  );
}
