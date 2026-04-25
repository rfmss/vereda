import React from 'react';

export function BrandingView({ onClose }) {
  return (
    <div className="fixed inset-0 bg-background z-[150] overflow-y-auto animate-in fade-in duration-500 selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <nav className="bg-[#F2EFE9]/80 backdrop-blur-sm dark:bg-stone-950/80 docked full-width top-0 z-50 sticky border-b border-stone-200/50 dark:border-stone-800/50 shadow-sm shadow-black/[0.02] duration-500 ease-in-out flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-serif italic font-semibold text-[#2E4D43] dark:text-emerald-500 font-body-reading">Vereda Escritores</div>
        <div className="hidden md:flex space-x-8">
          <button className="text-stone-500 hover:text-[#2E4D43] transition-colors font-body-ui">Sobre</button>
          <button className="text-stone-500 hover:text-[#2E4D43] transition-colors font-body-ui">Aprendizado</button>
          <button className="text-[#2E4D43] font-bold border-b-2 border-[#2E4D43] pb-1 font-body-ui">Branding</button>
          <button className="text-stone-500 hover:text-[#2E4D43] transition-colors font-body-ui">Assessoria</button>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose}
            className="text-[#2E4D43] hover:bg-emerald-900/5 dark:hover:bg-emerald-400/5 rounded transition-all p-2 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <button className="bg-primary text-on-tertiary px-6 py-2 rounded font-body-ui hover:bg-primary-container transition-colors">Entrar</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header 
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAj4UYr8-YUm09-s_vWzeMO90irK6DfGdCpy-CGrDmIfzw-fuwvVvd0-B4olAiNBDLmnQ7JskgWPuZ-FhV0WtEayn_qDTRL-OkVTL2dbE6-dLBagA6bNSxdE97A2gldgNhjwj01jEevgZQlxAoh7o8mDnsWMM-IA_H69myLo-AwEQXfCgfHXYh0ZD52Kjs-Yic2rhB3Jp1-wtvXyrYMwylWcuuvFW5LagLiUYWDLEJyi5Ae8KwIFFrrZWtjvzdiWDfP5E6z7nmkJ0eg')" }}
      >
        <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-container-max-width px-gutter mx-auto flex flex-col items-center gap-8">
          <span className="font-label-caps text-label-caps text-secondary tracking-[0.15em] uppercase border-b border-secondary pb-2">O Caminho do Autor</span>
          <h1 className="font-display-lg text-6xl text-primary dark:text-emerald-500 leading-tight">Sua Voz no Mundo:<br/><span className="italic font-light">Trilha do Lançamento</span></h1>
          <p className="font-body-reading text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Navegue pelas águas do mercado editorial com propósito. Da concepção da sua marca pessoal à amplificação da sua mensagem através de redes e assessoria consciente.
          </p>
          <button className="mt-8 bg-primary text-on-tertiary font-body-ui text-lg px-8 py-4 rounded-full hover:bg-primary-container transition-colors flex items-center gap-2 shadow-lg">
            Iniciar a Trilha <span className="material-symbols-outlined">arrow_downward</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-gutter py-24 space-y-32">
        {/* Branding Section */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className="space-y-4">
              <span className="font-label-caps text-label-caps text-secondary uppercase flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-sm">badge</span> Identidade
              </span>
              <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500">Guia de Personal Branding</h2>
              <p className="font-body-reading text-xl text-on-surface-variant leading-relaxed">
                Sua voz literária não termina no último ponto final. Ela se estende para como você se apresenta ao mundo. Construa uma marca pessoal autêntica que ressoe com seus leitores.
              </p>
            </div>
            <div className="grid gap-6">
              {[
                { icon: 'record_voice_over', title: 'Tom de Voz', desc: 'Defina a persona narrativa da sua comunicação pública. Acadêmico, poético, provocativo ou acolhedor?', color: 'bg-secondary-container text-on-secondary-container' },
                { icon: 'palette', title: 'Estética Visual', desc: 'Cores, tipografia e estilo fotográfico que complementam a atmosfera das suas obras.', color: 'bg-tertiary-container text-on-tertiary-container' },
                { icon: 'description', title: 'O Manifesto', desc: 'A declaração das suas intenções literárias. O porquê você escreve e para quem.', color: 'bg-primary-container text-on-primary-container' }
              ].map(item => (
                <div key={item.title} className="bg-surface-container-low dark:bg-stone-900 p-6 rounded-2xl border border-surface-variant flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className={`p-3 ${item.color} rounded-xl shrink-0`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-body-ui font-bold text-primary dark:text-emerald-500 mb-1">{item.title}</h3>
                    <p className="font-helper-text text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                alt="Aesthetic moodboard" 
                className="object-cover w-full h-full" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFKBn0FBrJfLIUBtf6KdYSw96_DPn2fSdxyNoitxDmaSH1LS4Hc3XDvqEzqVm2rKc0NxNQmeg8BtP6DBbM_tBvZFpn4fAOXP3ohVDb3MFVB3dx2r_jd64ZRuyb3c9MjRVWmhdsmeeMkV24hHunK6yeTd-v_aCtgtOWIr_LWBYtqS2uyBJ4JvC_w5s7ZI8M9qCKkhp-i0tmph3flxQVxf6-QCaNkmIDdOOO-AgRjvUdyISrxhxOObEsyFjCesId5f0yY1mStMMjGNio" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                <p className="font-body-reading text-xl text-white italic">"A marca do autor é a promessa implícita feita ao leitor antes mesmo da primeira página ser aberta."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Redes Sociais Section */}
        <section className="flex flex-col items-center space-y-16">
          <div className="text-center max-w-3xl space-y-6">
            <span className="font-label-caps text-label-caps text-secondary uppercase flex items-center justify-center gap-2 font-bold">
              <span className="material-symbols-outlined text-sm">hub</span> Ecossistema Digital
            </span>
            <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500">Navegando nas Redes</h2>
            <p className="font-body-reading text-xl text-on-surface-variant leading-relaxed">
              Entenda a dinâmica entre as grandes praças públicas e os jardins murados. Onde sua voz ecoa mais longe e onde ela cria raízes mais profundas?
            </p>
          </div>
          <div className="w-full grid lg:grid-cols-2 gap-8">
            {/* Redes de Massa */}
            <div className="bg-surface-container dark:bg-stone-900 p-8 rounded-3xl border border-surface-variant relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined">public</span>
                  </div>
                  <h3 className="font-h2 text-2xl font-bold text-primary dark:text-emerald-500">Redes de Massa</h3>
                </div>
                <p className="font-body-ui text-on-surface-variant leading-relaxed">X/Twitter, Instagram, TikTok. A praça do mercado, ruidosa mas vital para descoberta inicial.</p>
                <div className="space-y-4 pt-4">
                  {[
                    { label: 'Alcance Potencial', value: '80%', color: 'bg-secondary' },
                    { label: 'Engajamento Profundo', value: '25%', color: 'bg-secondary/50' },
                    { label: 'Controle Autoral', value: '20%', color: 'bg-secondary/30' }
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between font-label-caps text-xs text-on-surface dark:text-stone-300 mb-1 font-bold uppercase">
                        <span>{stat.label}</span>
                        <span>{stat.value === '80%' ? 'Alto' : stat.value === '25%' ? 'Médio' : 'Baixo'}</span>
                      </div>
                      <div className="h-2 bg-surface-variant dark:bg-stone-800 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Redes Federadas */}
            <div className="bg-primary dark:bg-emerald-950 p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 space-y-6 text-on-primary">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined">diversity_3</span>
                  </div>
                  <h3 className="font-h2 text-2xl font-bold text-white">Redes Federadas</h3>
                </div>
                <p className="font-body-ui text-primary-fixed-dim leading-relaxed italic">Mastodon, Bluesky, Newsletters. Jardins cultivados, focados em comunidade e soberania digital.</p>
                <div className="space-y-4 pt-4">
                  {[
                    { label: 'Alcance Potencial', value: '40%', color: 'bg-primary-fixed' },
                    { label: 'Engajamento Profundo', value: '80%', color: 'bg-primary-fixed' },
                    { label: 'Controle Autoral', value: '100%', color: 'bg-primary-fixed' }
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between font-label-caps text-xs text-white mb-1 font-bold uppercase">
                        <span>{stat.label}</span>
                        <span>{stat.value === '100%' ? 'Pleno' : stat.value === '80%' ? 'Alto' : 'Médio'}</span>
                      </div>
                      <div className="h-2 bg-primary-container rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assessoria Midiática Section */}
        <section className="bg-surface-container-low dark:bg-stone-900 rounded-[32px] p-8 md:p-16 border border-surface-variant flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-64 md:w-64 md:h-80 bg-white dark:bg-stone-800 shadow-2xl rounded-2xl border border-surface-variant p-4 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-4 text-center gap-4">
                <span className="material-symbols-outlined text-5xl text-secondary">newsmode</span>
                <h4 className="font-body-ui text-lg font-bold text-primary dark:text-emerald-500 uppercase leading-tight">Media Kit<br/>Literário</h4>
                <div className="w-16 h-1 bg-secondary/30 rounded-full"></div>
                <p className="font-helper-text text-xs text-outline italic">Template Profissional</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-8">
            <span className="font-label-caps text-label-caps text-secondary uppercase flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-sm">campaign</span> Eco Midiático
            </span>
            <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500">Assessoria & Media Kit</h2>
            <p className="font-body-reading text-xl text-on-surface-variant leading-relaxed">
              Apresente sua obra para a imprensa e influenciadores literários de forma profissional. Um Media Kit bem estruturado é a sua carta de apresentação para o mundo.
            </p>
            <ul className="space-y-6 pt-4">
              {[
                { title: 'Release de Lançamento', desc: 'Sinopse atraente, ganchos para pautas atuais e informações técnicas do livro.' },
                { title: 'Fotos em Alta Resolução', desc: 'Retratos autorais profissionais e mockups de qualidade da capa do livro.' },
                { title: 'Mapeamento de Influenciadores', desc: 'Como identificar e abordar booktubers e bookstagrammers do seu nicho.' }
              ].map(item => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
                  <div>
                    <strong className="font-body-ui text-lg text-primary dark:text-emerald-500 block mb-1">{item.title}</strong>
                    <span className="font-helper-text text-sm text-on-surface-variant leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-24 border-t border-surface-variant">
          <h2 className="font-display-lg text-5xl font-bold text-primary dark:text-emerald-500 mb-6">Pronto para o Próximo Capítulo?</h2>
          <p className="font-body-reading text-2xl text-on-surface-variant max-w-2xl mx-auto mb-12">
            Transforme sua escrita em uma presença estabelecida. Junte-se à Vereda e inicie sua jornada de publicação e divulgação consciente.
          </p>
          <button className="bg-primary text-on-tertiary font-body-ui text-lg font-bold px-12 py-6 rounded-full hover:bg-primary-container transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-3">
            Publicar e Divulgar <span className="material-symbols-outlined">rocket_launch</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F2EFE9] dark:bg-stone-950 w-full border-t border-stone-200 dark:border-stone-800 mt-20">
        <div className="max-w-7xl mx-auto px-12 py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="font-serif font-black text-2xl text-emerald-900 dark:text-emerald-500 mb-4 md:mb-0 italic tracking-tighter">Vereda</div>
          <p className="font-serif italic text-stone-600 dark:text-stone-400 text-sm text-center md:text-left mb-4 md:mb-0 max-w-md">
            © 2024 Vereda. Cultivando a literatura independente através da tecnologia calma e do esforço humano verificado.
          </p>
          <div className="flex gap-8">
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm transition-colors uppercase tracking-widest font-bold">Privacidade</button>
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm transition-colors uppercase tracking-widest font-bold">Termos</button>
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm transition-colors uppercase tracking-widest font-bold">Manifesto</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
