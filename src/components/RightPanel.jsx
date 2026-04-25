export function RightPanel({ isOpen }) {
  if (!isOpen) return null;

  return (
    <aside className="w-16 hover:w-80 border-l border-stone-200 dark:border-stone-800 bg-[#F6F3F2] dark:bg-stone-950 transition-all duration-500 ease-in-out group shrink-0 h-full overflow-hidden flex flex-col items-center hover:items-stretch py-8 z-30 shadow-[-1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Header / Icon */}
      <div className="px-5 mb-10 flex justify-center group-hover:justify-start items-center w-full transition-all duration-300">
        <span className="material-symbols-outlined text-stone-400 group-hover:text-primary dark:group-hover:text-emerald-500 transition-colors">lightbulb</span>
        <span className="ml-4 font-label-caps text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 dark:text-stone-400 hidden group-hover:block whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
          Referências
        </span>
      </div>

      {/* Expandable Content */}
      <div className="hidden group-hover:flex flex-col gap-5 px-5 overflow-y-auto animate-in fade-in duration-700">
        {/* Character Card */}
        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center mb-3">
            <span className="inline-flex items-center justify-center bg-secondary/10 text-secondary dark:text-orange-400 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mr-3">
              Personagem
            </span>
            <h4 className="font-body-ui text-sm font-bold text-on-surface dark:text-stone-100">Elias</h4>
          </div>
          <p className="font-helper-text text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Estoico, marcado pelo tempo. Usa um chapéu de palha desfiado. Tem um mancar distinto de uma ferida antiga.
          </p>
        </div>

        {/* Location Card */}
        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center mb-3">
            <span className="inline-flex items-center justify-center bg-primary/10 text-primary dark:text-emerald-500 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mr-3">
              Localização
            </span>
            <h4 className="font-body-ui text-sm font-bold text-on-surface dark:text-stone-100">A Vereda</h4>
          </div>
          <p className="font-helper-text text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Um leito de rio seco que serve como caminho principal. Empoeirado, cercado por vegetação morta.
          </p>
        </div>

        {/* Action Button */}
        <button className="mt-4 w-full py-3 border border-dashed border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl flex items-center justify-center gap-2 transition-all group/btn">
          <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform">add</span>
          <span className="font-label-caps text-[9px] uppercase tracking-widest font-bold">Nova Referência</span>
        </button>
      </div>

      {/* Tooltip-like hints for collapsed state */}
      <div className="mt-auto flex flex-col gap-6 pb-4 group-hover:hidden animate-in fade-in duration-500">
        <span className="material-symbols-outlined text-stone-300 dark:text-stone-700 text-lg">person</span>
        <span className="material-symbols-outlined text-stone-300 dark:text-stone-700 text-lg">landscape</span>
        <span className="material-symbols-outlined text-stone-300 dark:text-stone-700 text-lg">sticky_note_2</span>
      </div>
    </aside>
  );
}
