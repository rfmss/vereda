import React, { useState } from 'react';

export function ProjectBible({ isOpen, onClose, characters = [], locations = [], notes = [] }) {
  const [activeTab, setActiveTab] = useState('characters');

  if (!isOpen) return null;

  // Mock data if none provided
  const displayCharacters = characters.length > 0 ? characters : [
    {
      id: 1,
      name: 'Maria das Graças',
      role: 'Protagonista',
      description: 'Mulher forte, endurecida pela seca. Busca água para sua família enquanto espera o retorno do marido.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCZ8-1HZoEQBWZ8BYT0NbiP00SYQku-vxh935WTU_QkUL2rm9AZNnkSILrX7mSOB3156EMwp4d7Ar9a_3DOLKLGgvk9MOXa33Cb0hYg6RW7J-esKXLGyUlGmddZt6VBuf-5nVaMVi9LH-_mvFW2nPQZemAukCp2GA5JauEzn-6SIcxTS0f1La7z5U8RCt543VyXchOxYBpWFs1gVmAf_5_hGNiwRP8WHtC4kSJ3w8-NTJkSRPjSD7vWV6EnIa-rWzupCWEAowKdxub'
    },
    {
      id: 2,
      name: 'João de Deus',
      role: 'Antagonista',
      description: 'Dono das terras vizinhas, controla o único poço artesiano da região e cobra caro pela água.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxnHWmwmvw52oIsO1UVx4FWa29lhRA0w4HhJBvgl_XFXik3AcnEkT1K2v-E2jy4qCLYb-nxGbNeTeCAXFjwO_rxi8lDzJjZ6ZEHYlqvTs1tWSm18oK8jo0Jj1Adwav83qL5D3RS2ePXjJemO58UfG--dvyET4MFj5MzxFHYVB84GFDLBeHej8pbx3THlXWZTVV4e5QfbdAeQccZD2GRYrpDqU1duFujvqOF2415DzbEr1cxhGJO4yTjJIpayqqfMi8IwQgrtbQvlb4'
    }
  ];

  return (
    <aside className="fixed right-0 top-16 flex flex-col h-[calc(100vh-64px)] w-[320px] bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 z-40 animate-in slide-in-from-right duration-500">
      {/* Tabs */}
      <div className="flex border-b border-stone-100 dark:border-stone-800 px-2 pt-2 bg-[#F2EFE9] dark:bg-stone-950">
        <button 
          onClick={() => setActiveTab('characters')}
          className={`flex-1 pb-2 border-b-2 font-label-caps text-[10px] flex flex-col items-center gap-1 transition-colors ${activeTab === 'characters' ? 'border-primary text-primary' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          <span className="material-symbols-outlined text-[20px]">person_search</span>
          PERSONAGENS
        </button>
        <button 
          onClick={() => setActiveTab('locations')}
          className={`flex-1 pb-2 border-b-2 font-label-caps text-[10px] flex flex-col items-center gap-1 transition-colors ${activeTab === 'locations' ? 'border-primary text-primary' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          <span className="material-symbols-outlined text-[20px]">map</span>
          LUGARES
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`flex-1 pb-2 border-b-2 font-label-caps text-[10px] flex flex-col items-center gap-1 transition-colors ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          NOTAS
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-stone-900">
        {activeTab === 'characters' && (
          <>
            {displayCharacters.map(char => (
              <div key={char.id} className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 shadow-sm hover:border-primary transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <img src={char.avatar} alt={char.name} className="w-12 h-12 rounded-full object-cover border border-stone-200 dark:border-stone-600" />
                  <div>
                    <h4 className="font-h2 text-sm font-bold text-on-surface dark:text-stone-100">{char.name}</h4>
                    <span className={`font-label-caps text-[9px] uppercase px-2 py-0.5 rounded-full ${char.role === 'Protagonista' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-fixed text-on-primary-fixed'}`}>
                      {char.role}
                    </span>
                  </div>
                </div>
                <p className="font-body-ui text-xs text-on-surface-variant dark:text-stone-400 line-clamp-3 leading-relaxed">
                  {char.description}
                </p>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-stone-200 dark:border-stone-800 text-stone-400 hover:text-primary hover:border-primary transition-all rounded-xl flex items-center justify-center gap-2 font-body-ui text-sm">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Novo Personagem
            </button>
          </>
        )}

        {activeTab === 'locations' && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 opacity-50">
            <span className="material-symbols-outlined text-4xl">map</span>
            <p className="font-label-caps text-xs">Mapeie seu mundo</p>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 opacity-50">
            <span className="material-symbols-outlined text-4xl">sticky_note_2</span>
            <p className="font-label-caps text-xs">Anotações do projeto</p>
          </div>
        )}
      </div>

      {/* Footer / Close */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-center">
        <button 
          onClick={onClose}
          className="text-stone-400 hover:text-primary transition-colors flex items-center gap-2 font-label-caps text-[10px]"
        >
          FECHAR BÍBLIA
        </button>
      </div>
    </aside>
  );
}
