import React, { useState } from 'react';

export function TemplateLibrary({ onSelectTemplate, onClose, isOpen }) {
  const [activeCategory, setActiveCategory] = useState('ficcao');

  if (!isOpen) return null;

  const categories = [
    { id: 'ficcao', icon: 'book_5', label: 'Ficção Narrativa' },
    { id: 'dramaturgia', icon: 'theater_comedy', label: 'Dramaturgia' },
    { id: 'nao-ficcao', icon: 'menu_book', label: 'Não Ficção' },
    { id: 'digitais', icon: 'devices', label: 'Nativos Digitais' }
  ];

  const templates = {
    ficcao: [
      {
        id: 'romance-curto',
        title: 'Romance Curto',
        description: 'Estrutura clássica em prosa com foco no desenvolvimento de personagens e arco narrativo condensado.',
        focus: ['Densidade Semântica', 'Ritmo de Prosa'],
        preview: 'classic'
      },
      {
        id: 'conto',
        title: 'Conto Literário',
        description: 'Formato conciso focado em um único evento central ou conflito, ideal para antologias e revistas.',
        focus: ['Economia de Palavras', 'Tensão Narrativa'],
        preview: 'concise'
      },
      {
        id: 'jornada',
        title: 'Jornada do Herói',
        description: 'Template estrutural baseado no monomito, organizando a narrativa em 12 estágios clássicos.',
        focus: ['Parsing Estrutural', 'Mapeamento de Arcos'],
        preview: 'steps'
      }
    ]
  };

  const renderPreview = (type) => {
    switch (type) {
      case 'classic':
        return (
          <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-4 mb-6 border border-stone-200 dark:border-stone-700 flex flex-col gap-2">
            <div className="h-2 w-3/4 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mb-2"></div>
            <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full"></div>
            <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full"></div>
            <div className="h-1.5 w-5/6 bg-stone-200 dark:bg-stone-700 rounded-full"></div>
          </div>
        );
      case 'concise':
        return (
          <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-4 mb-6 border border-stone-200 dark:border-stone-700 flex flex-col gap-2">
            <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full mt-4"></div>
            <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full"></div>
            <div className="h-1.5 w-11/12 bg-stone-200 dark:bg-stone-700 rounded-full"></div>
          </div>
        );
      case 'steps':
        return (
          <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-4 mb-6 border border-stone-200 dark:border-stone-700 flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stone-400 dark:bg-stone-500"></div>
                <div className="h-1.5 w-3/4 bg-stone-200 dark:bg-stone-700 rounded-full"></div>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex bg-background animate-in slide-in-from-bottom duration-500">
      {/* Sidebar Navigation */}
      <nav className="w-72 border-r border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-950 flex flex-col pt-20">
        <div className="px-8 mb-8">
          <h2 className="text-lg font-bold text-primary dark:text-emerald-500">Biblioteca</h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 uppercase tracking-widest font-bold">Templates Profissionais</p>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-4 px-8 py-3 transition-all duration-200 border-l-2 ${activeCategory === cat.id ? 'border-primary bg-stone-200/50 dark:bg-stone-900 text-primary dark:text-emerald-400 font-bold' : 'border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900/50'}`}
            >
              <span className="material-symbols-outlined">{cat.icon}</span>
              <span className="font-serif text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto p-8 flex flex-col gap-2">
          <button onClick={onClose} className="w-full py-2 bg-primary text-white rounded-full font-label-caps text-[10px] tracking-widest hover:opacity-90 transition-opacity">
            VOLTAR AO EDITOR
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 bg-white dark:bg-stone-900">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="font-display-lg text-5xl text-on-surface dark:text-white mb-4">
              {categories.find(c => c.id === activeCategory)?.label}
            </h1>
            <p className="font-body-reading text-xl text-stone-500 dark:text-stone-400 max-w-2xl">
              Selecione um template para aplicar as regras de formatação e análise do mercado profissional.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(templates[activeCategory] || []).map(template => (
              <div 
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group relative flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-h2 text-xl font-bold text-on-surface dark:text-stone-100">{template.title}</h3>
                    <span className="material-symbols-outlined text-primary dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </div>
                  {renderPreview(template.preview)}
                  <p className="font-body-ui text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-6">
                    {template.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-stone-200 dark:border-stone-700">
                  <span className="font-label-caps text-[10px] text-secondary dark:text-orange-400 uppercase font-bold tracking-widest block mb-2">Foco da Ferramenta</span>
                  <div className="flex flex-wrap gap-2">
                    {template.focus.map(f => (
                      <span key={f} className="px-2 py-1 rounded bg-secondary/10 dark:bg-orange-950/20 text-secondary dark:text-orange-300 font-body-ui text-[10px] font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Close Header for top AppBar consistency */}
      <header className="fixed top-0 left-72 right-0 h-16 flex items-center justify-end px-12 z-50">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>
    </div>
  );
}
