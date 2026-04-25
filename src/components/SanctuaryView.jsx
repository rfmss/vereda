import React, { useState } from 'react';

export function SanctuaryView({ onClose }) {
  const [timer, setTimer] = useState('45:00');
  const [activeRoutine, setActiveRoutine] = useState('anchor');

  return (
    <div className="fixed inset-0 bg-background z-[150] flex overflow-hidden animate-in fade-in duration-500">
      {/* SideNavBar (Sanctuary Context) */}
      <nav className="w-64 border-r border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-900 flex flex-col pt-12 shrink-0">
        <div className="px-6 mb-8">
          <span className="font-serif font-bold text-xl text-[#2E4D43] dark:text-emerald-500 italic">Vereda</span>
          <div className="mt-4 flex items-center gap-3">
            <img 
              alt="Mentor" 
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/50" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSE7ETjEGvc7qRx98wFKq_0U7btvU9K0RFAYvc8ACZ3cAsQPezqWbHGHSk_EjEERguoaAfSSXxaJ0JcIl1ACTAmxtQehwR7RYRNIevXOTgPkk2-CVlXT5f-r_-HJBYlKjpkKUtz0kU1M1fEVa2sfozXeZJJMYWHiRiTZLDQwY_fVeZFnXJCkzP-a_6ooKT4Md-GOppAV6OCMyphUTA4QPTcmdH-ZvDjpfjzCwAzY7w78GhO6P9ZlygF3IzAhBZl2NPi-n6kRBbgEuS" 
            />
            <div className="text-[11px] font-bold text-[#2E4D43] dark:text-emerald-400 uppercase tracking-widest leading-tight">O caminho do escritor</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 px-2 font-serif">
          {[
            { id: 'dashboard', icon: 'space_dashboard', label: 'Painel', active: true },
            { id: 'timer', icon: 'timer', label: 'Temporizador' },
            { id: 'routines', icon: 'auto_stories', label: 'Rotinas' },
            { id: 'neuro', icon: 'psychology', label: 'Neurociência' },
            { id: 'env', icon: 'psychology_alt', label: 'Ambiente' }
          ].map(item => (
            <button 
              key={item.id}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${item.active ? 'bg-[#EAE7E0] dark:bg-stone-800 text-[#2E4D43] dark:text-emerald-400 font-bold border-l-4 border-[#2E4D43]' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 mt-auto border-t border-stone-200 dark:border-stone-800">
          <button className="w-full bg-[#2E4D43] text-white font-body-ui text-sm py-3 rounded-lg hover:bg-emerald-900 transition-colors shadow-md active:scale-95">
            Iniciar Sessão de Foco
          </button>
          <div className="mt-6 flex flex-col gap-1">
            <button className="flex items-center gap-4 px-4 py-2 text-stone-500 hover:text-stone-800 text-xs">
              <span className="material-symbols-outlined text-sm">help_outline</span> Suporte
            </button>
            <button className="flex items-center gap-4 px-4 py-2 text-stone-500 hover:text-stone-800 text-xs">
              <span className="material-symbols-outlined text-sm">inventory_2</span> Arquivo
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-background overflow-y-auto">
        {/* TopBar Actions */}
        <div className="flex justify-end items-center w-full px-12 py-6 gap-6 text-on-surface-variant sticky top-0 bg-background/80 backdrop-blur-md z-20">
          <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">visibility</span></button>
          <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">settings</span></button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-12 py-12 space-y-16">
          {/* Header Section */}
          <section className="text-center space-y-4">
            <h1 className="font-display-lg text-5xl font-bold text-on-background">Santuário do Escritor</h1>
            <p className="font-body-reading text-2xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Abrace o ritmo de sprints focados. Evite a ansiedade do relógio; veja-o como um recipiente gentil para o seu fluxo.</p>
          </section>

          {/* Focus & Time Management */}
          <section className="bg-surface-container-low dark:bg-stone-900/50 rounded-3xl p-10 border border-outline-variant/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[140px] text-primary">timer</span>
            </div>
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 bg-primary-container/10 text-primary px-4 py-1.5 rounded-full font-label-caps text-[10px] uppercase tracking-widest font-bold mb-6">
                <span className="material-symbols-outlined text-sm">schedule</span> Ciclo da Vereda
              </div>
              <h2 className="font-h1 text-3xl font-bold text-on-surface mb-4">Trabalho Profundo</h2>
              <p className="font-body-reading text-xl text-on-surface-variant mb-10 leading-relaxed italic">"O rascunho inicial é um ecossistema frágil; proteja-o ferozmente através do tempo dedicado."</p>
              
              <div className="bg-white dark:bg-stone-900 rounded-[24px] p-10 flex flex-col items-center justify-center border border-outline-variant/20 shadow-2xl">
                <div className="font-display-lg text-8xl font-black text-primary dark:text-emerald-500 mb-2 tracking-tighter tabular-nums">{timer}</div>
                <div className="font-helper-text text-sm text-stone-400 uppercase tracking-widest font-bold mb-10">Status: Prévio ao Fluxo</div>
                <div className="flex gap-4 w-full">
                  <button className="flex-1 bg-primary text-white font-body-ui font-bold py-4 rounded-xl hover:bg-emerald-900 transition-all shadow-lg active:scale-95">Iniciar Fluxo</button>
                  <button className="flex-1 border-2 border-primary text-primary font-body-ui font-bold py-4 rounded-xl hover:bg-primary/5 transition-all active:scale-95">Descanso</button>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Grid: Environment & Neuroscience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Creative Environment */}
            <section className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-outline-variant/20 shadow-xl hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-secondary-container/20 rounded-2xl flex items-center justify-center mb-8 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">chair</span>
              </div>
              <h3 className="font-h2 text-2xl font-bold text-on-surface mb-4">O Espaço de Trabalho</h3>
              <p className="font-body-ui text-on-surface-variant mb-8 leading-relaxed">Mantenha seu altar literário sagrado e livre de ruídos digitais.</p>
              <ul className="space-y-4">
                {['Elimine a poluição visual', 'Otimize a iluminação natural', 'Use ferramentas analógicas'].map(tip => (
                  <li key={tip} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> {tip}
                  </li>
                ))}
              </ul>
            </section>

            {/* Neuroscience & Writing */}
            <section className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-outline-variant/20 shadow-xl hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-tertiary-container/10 rounded-2xl flex items-center justify-center mb-8 text-tertiary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <h3 className="font-h2 text-2xl font-bold text-on-surface mb-4">Mente e Dopamina</h3>
              <p className="font-body-ui text-on-surface-variant mb-8 leading-relaxed">Cultive o ócio criativo para permitir a incubação de ideias.</p>
              <div className="bg-stone-50 dark:bg-stone-800 p-6 rounded-2xl border-l-4 border-tertiary shadow-sm">
                <p className="font-body-reading text-xl leading-relaxed italic text-on-surface">"A mente precisa de espaço vazio para vagar antes de poder construir novos mundos."</p>
              </div>
            </section>
          </div>

          {/* The Inner Circle (Mentor's Advice) */}
          <section className="relative rounded-[32px] overflow-hidden min-h-[450px] flex items-center bg-stone-200">
            <img 
              alt="Misty landscape" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0553_M7mEvEIqa986xFJjQdvFUvyvlKcSNHogfurKZSlfoWdlbcS-sF-EfUQmtRx8WRefCVtWEuNr_6avz_65dhh0GnWr3g6QgEARQzIFeZ_8gAKFzUXiINMud6cDSBKlabDJai2vq-0EVVkKTuHZFcMYXhonVQvfXehMOonmuO36CVBSDq14AyiRqKsfKBzFO5_hmzNb8qOTzePOyCMwVMaFJeUBIY9ZCnmYuQ8WvzTdQkiIcZVGNm3VJiPMVy3yTV2AEMZntdxE" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
            <div className="relative z-10 p-12 md:p-20 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full font-label-caps text-[10px] uppercase tracking-widest font-bold mb-6">
                <span className="material-symbols-outlined text-sm">vpn_key</span> Conselho do Mentor
              </div>
              <h2 className="font-h1 text-4xl font-bold text-on-surface mb-8">O Círculo Interno</h2>
              <div className="space-y-6 font-body-reading text-xl text-on-surface-variant leading-relaxed italic">
                <p>"Confie em seus instintos acima de tudo. O rascunho inicial é um ecossistema frágil; proteja-o ferozmente."</p>
                <p>"Seja altamente seletivo com leitores beta. Aprenda a distinguir entre preferência pessoal e percepção estrutural."</p>
                <p>"Mantenha o silêncio necessário para a criação. Não fale sobre a história antes de escrevê-la."</p>
              </div>
            </div>
          </section>

          {/* Routine Builder */}
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-10 border border-outline-variant/20 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="font-h1 text-3xl font-bold text-on-surface mb-2">A Hora Sagrada</h2>
                <p className="font-body-ui text-on-surface-variant">Estabeleça uma janela inegociável para o seu ofício diário.</p>
              </div>
              <button className="bg-transparent border-2 border-primary text-primary font-body-ui font-bold px-8 py-3 rounded-xl hover:bg-primary/5 transition-all">Configurar Rotina</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'dawn', icon: 'wb_twilight', label: 'Sessão da Alvorada', time: '05:00 - 07:00' },
                { id: 'anchor', icon: 'light_mode', label: 'Âncora do Meio-dia', time: '12:00 - 14:00', active: true },
                { id: 'night', icon: 'nights_stay', label: 'Coruja Noturna', time: '22:00 - 00:00' }
              ].map(routine => (
                <div 
                  key={routine.id}
                  onClick={() => setActiveRoutine(routine.id)}
                  className={`p-8 rounded-2xl border-2 transition-all cursor-pointer group ${routine.id === activeRoutine ? 'border-primary bg-primary/5' : 'border-transparent bg-stone-50 dark:bg-stone-800 hover:border-stone-200'}`}
                >
                  {routine.id === activeRoutine && (
                    <div className="flex justify-end text-primary mb-[-24px]">
                      <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                    </div>
                  )}
                  <div className={`mb-4 transition-transform group-hover:scale-110 origin-left ${routine.id === activeRoutine ? 'text-primary' : 'text-stone-400'}`}>
                    <span className="material-symbols-outlined text-4xl">{routine.icon}</span>
                  </div>
                  <h4 className="font-h2 text-xl text-on-surface mb-1 font-bold">{routine.label}</h4>
                  <p className="font-helper-text text-sm text-stone-400 font-bold tracking-widest">{routine.time}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
