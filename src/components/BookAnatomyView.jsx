import React from 'react';

export function BookAnatomyView({ onClose }) {
  return (
    <div className="fixed inset-0 bg-background z-[150] overflow-y-auto animate-in fade-in duration-500 selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full border-b border-[#2E4D43]/10 bg-[#F2EFE9]/90 backdrop-blur-sm z-50 transition-all duration-300">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
          <div className="font-serif text-2xl italic text-[#2E4D43] dark:text-emerald-500 font-bold tracking-tight">Vereda</div>
          <nav className="hidden md:flex space-x-8 font-serif text-xs tracking-widest uppercase font-bold">
            <a className="text-[#2E4D43]/60 hover:text-[#2E4D43] dark:text-emerald-400/60 dark:hover:text-emerald-400 transition-colors duration-300" href="#revestimento">External</a>
            <a className="text-[#2E4D43]/60 hover:text-[#2E4D43] dark:text-emerald-400/60 dark:hover:text-emerald-400 transition-colors duration-300" href="#portal">Pre-textual</a>
            <a className="text-[#2E4D43] border-b-2 border-[#2E4D43] dark:text-emerald-400 dark:border-emerald-400 pb-1 opacity-70 transition-opacity" href="#miolo">Textual</a>
            <a className="text-[#2E4D43]/60 hover:text-[#2E4D43] dark:text-emerald-400/60 dark:hover:text-emerald-400 transition-colors duration-300" href="#encerramento">Post-textual</a>
          </nav>
          <div className="flex items-center space-x-4 text-[#2E4D43] dark:text-emerald-500">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-emerald-400/10">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[100px]">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-gutter max-w-4xl mx-auto py-20">
          <h1 className="font-display-lg text-6xl text-primary dark:text-emerald-500 mb-6 font-bold leading-tight">Anatomia do Objeto Livro</h1>
          <p className="font-body-reading text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
            Uma exploração aprofundada dos elementos estruturais que compõem o livro, desde sua capa até o colofão.
          </p>
        </section>

        {/* Section 1: O Revestimento */}
        <section className="py-32 relative overflow-hidden" id="revestimento">
          <div 
            className="h-full w-full opacity-10 absolute inset-0 z-0 pointer-events-none" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-qtrmi55H3uhh53qtliy5GK1TMiIlv_yHbmRh4CM2B37t2BEfRdHwKmrJi4D40wvIh20kLPPwoS_IFFSf037Pgi5fodNdc7G-Lc5-akDgh3fnx91J1SEJcrnKQsnEG3bEc76ujTR7NzKG_GIMuOtaf4AjCjB6aBGyKQiJYoAQ3wlMGT51_atWMa32tVbm9OIRgYKNGzc05kYdVurxK3X4KU5PvMsB04k3WGqEIKn2bJ9qk8TO4Vt_4yF_yr5Z_5BwEOQNi04rVv-x')",
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed'
            }}
          ></div>
          <div className="max-w-4xl mx-auto px-gutter relative z-10 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-12 rounded-xl border border-outline-variant/30 shadow-2xl">
            <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500 mb-12 border-b border-outline-variant/20 pb-4">O Revestimento (External Elements)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  { title: 'Front Cover (Capa)', desc: 'A face principal do livro, projetada para proteger o miolo e atrair o leitor. Geralmente contém o título, autor e identidade visual.' },
                  { title: 'Spine (Lombada)', desc: 'A parte que une as páginas. Exibe informações essenciais para identificação na estante.' },
                  { title: 'Back Cover (Quarta Capa)', desc: 'O verso do livro. Freqüentemente apresenta sinopses, resenhas ou informações biográficas.' }
                ].map(item => (
                  <div key={item.title}>
                    <h3 className="font-h2 text-2xl font-bold text-primary-container dark:text-emerald-400 mb-2">{item.title}</h3>
                    <p className="font-body-reading text-xl text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="aspect-[3/4] bg-surface-container-high dark:bg-stone-800 rounded-lg shadow-2xl flex items-center justify-center p-8 relative overflow-hidden">
                <img 
                  alt="3D Book Render" 
                  className="w-full h-full object-cover rounded-sm absolute inset-0 opacity-80 mix-blend-multiply" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb1HqBgKoS59BCVullnNye0FbvzND7lnRtpXQd1d7loLPezlR_pXqPQ4GPAU4K2dfRKRCUWTm7_ZRcqfChjGzj1uv-rH05-DIbXxKb6OWyZ-nNWZnG60spQ11w6XW-gjTaoUKjTCA9JWTEDz-uXKwGi0ZkUChsoX0RS_YseD4x9AAHO7c5wegNwULvy279C8qPBvYAnqJ3pjk6ihecODGIwMlaoS8JMw6Uuf0pdjLxzsSCZpypZXsPd3xuDfcPqnNNMmNHtOo3oB38" 
                />
                <div className="absolute inset-0 border border-primary/20 m-4 rounded-sm"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: O Portal */}
        <section className="py-24 bg-stone-50 dark:bg-stone-950" id="portal">
          <div className="max-w-4xl mx-auto px-gutter">
            <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500 mb-16 text-center">O Portal (Pre-textual Elements)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Folha de Rosto', desc: 'A página principal de identificação, contendo o título completo, autor, editora e local de publicação.' },
                { title: 'Ficha Catalográfica', desc: 'O registro oficial da obra, contendo dados essenciais para catalogação em bibliotecas.' },
                { title: 'Dedicatória', desc: 'Uma breve homenagem do autor a pessoas ou entidades significativas para a criação da obra.' },
                { title: 'Epígrafe', desc: 'Uma citação, geralmente de outro autor, que estabelece o tom ou o tema da obra que se segue.' }
              ].map(item => (
                <div key={item.title} className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-outline-variant/30 hover:border-primary transition-all shadow-sm">
                  <h3 className="font-h2 text-2xl font-bold text-primary dark:text-emerald-500 mb-3 font-serif italic">{item.title}</h3>
                  <p className="font-body-ui text-lg text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: O Miolo */}
        <section className="py-24" id="miolo">
          <div className="max-w-[900px] mx-auto px-gutter">
            <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500 mb-16 text-center">O Miolo (Textual Elements)</h2>
            <div className="bg-white dark:bg-stone-900 border border-outline-variant/20 p-12 md:p-16 rounded-xl shadow-2xl relative">
              <div className="flex justify-between items-center mb-16 pb-4 border-b border-outline-variant/30">
                <span className="font-label-caps text-xs text-stone-400 uppercase tracking-widest font-bold">Capítulo 1</span>
                <span className="font-label-caps text-xs text-stone-400 font-bold">12</span>
              </div>
              <h3 className="font-display-lg text-5xl text-primary dark:text-emerald-400 mb-8 text-center font-bold">Aberturas e Alinhamentos</h3>
              <div className="space-y-8 font-body-reading text-2xl text-on-surface-variant text-justify leading-relaxed">
                <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:mr-4 first-letter:float-left first-letter:leading-none">
                  O texto principal, ou miolo, é o coração do livro. A tipografia e o layout são meticulosamente planejados para proporcionar a melhor experi\u00eancia de leitura. O alinhamento justificado cria blocos de texto uniformes, enquanto as margens generosas evitam a fadiga visual.
                </p>
                <p>
                  Cabeçalhos correntes orientam o leitor através das seções, e a numeração das páginas (fólios) ancora o texto no espaço físico. Cada elemento serve a um propósito funcional, mantendo a estética silenciosa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: O Encerramento */}
        <section className="py-24 bg-stone-50 dark:bg-stone-950" id="encerramento">
          <div className="max-w-4xl mx-auto px-gutter text-center">
            <h2 className="font-h1 text-4xl font-bold text-primary dark:text-emerald-500 mb-12">O Encerramento (Post-textual Elements)</h2>
            <div className="flex flex-col space-y-8 max-w-xl mx-auto">
              {[
                { title: 'Bibliography (Bibliografia)', desc: 'Lista de fontes consultadas, essencial para trabalhos acadêmicos.' },
                { title: 'Index (Índice remissivo)', desc: 'Guia alfabético detalhado de termos e conceitos.' },
                { title: 'Colophon (Colofão)', desc: 'A nota final detalhando os aspectos da produção do livro, como tipografia e papel.' }
              ].map(item => (
                <div key={item.title} className="pb-8 border-b border-outline-variant/30 last:border-0">
                  <h4 className="font-h2 text-2xl font-bold text-primary-container dark:text-emerald-400 mb-2">{item.title}</h4>
                  <p className="font-body-ui text-lg text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F2EFE9] dark:bg-stone-900 w-full border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-serif font-black text-2xl text-[#2E4D43] dark:text-emerald-500 italic">Vereda</div>
          <p className="font-serif italic text-stone-600 dark:text-stone-400 text-sm text-center">
            © 2024 Vereda. Carving literary paths through the sertão.
          </p>
          <nav className="flex gap-8 font-serif text-xs uppercase tracking-widest font-bold">
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">Bibliography</button>
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">Index</button>
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">Colophon</button>
            <button className="text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">Privacy</button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
