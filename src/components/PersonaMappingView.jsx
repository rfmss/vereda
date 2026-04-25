import React from 'react';

export function PersonaMappingView({ onClose }) {
  const personas = [
    {
      id: 1,
      name: 'A Universitária Crítica',
      age: '22-28 anos',
      interests: ['Realismo Mágico', 'Política', 'Feminismo'],
      reason: '"Busca subtextos profundos e aprecia o ritmo lento e contemplativo da sua construção de mundo."',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDdVQuzrHTXCVwu_oAvf0TSyfOmlqnJ91v734KBdVAXJQjhQh9shQvz2lBeah7aW8W2dp9Os86j7Q3nwnR9uivNQjfvSK_fy3wh5EY4mF4nhQoGZ9rzNDQEJEOktR947JfmvEU3IoCzx4WxeB-8Xp_pz7DY0tbsxo3CdLIK8-nF5uXxwXYiIwg6TpOss3J9dPWb7URa9kATMKVdMWnBL1qxrVvIqOuW-TeutDR36egdFwkShlM54x6aZLBmBp6_Rr9ZPCubAlWX0t6',
      bg: 'bg-secondary-fixed'
    },
    {
      id: 2,
      name: 'O Nostálgico Intelectual',
      age: '45-60 anos',
      interests: ['História', 'Filosofia', 'Clássicos'],
      reason: '"Conecta-se com a sua prosa rica em vocabulário e as referências intertextuais sutis presentes nos diálogos."',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAalB6yVT5Lx9qqI7P2YejSh9f4vSS4e_zw47034OpWRiVy-0NQA3wSzvryr-4Kv0Tic2M2x6R7Qn7LLhaU5IZofNkZaNuEE-5NRlO1BVfUcLJsHOMXbgnnOsjoMlT_ej9GvfyYfUao0Ce050x0UEqlLQhRjxe7FHT0Vhglhc2KZeS8QriJfb9GF0CVKuOWroQYt_sf5QxjaJu-rjHzNxcRVtN1iNNVw4umQ54Qu7FQYJ95Bq1jWdFi7nmbL2AqbwO5qVXcH8AwmeF5',
      bg: 'bg-primary-fixed'
    },
    {
      id: 3,
      name: 'A Exploradora Urbana',
      age: '28-35 anos',
      interests: ['Contemporâneo', 'Psicologia', 'Arte'],
      reason: '"Atraída pela forma crua e realista com que você descreve os dilemas da vida adulta na cidade grande."',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnFxVynS2_J5qUU0IS908H7DpUogAvVp86Rz18sAu6cwxGvh8POIip8-C_DBmk7xcyBZvecZzWioHJogODR9d6P8ZKmxv2GBNjC-RIDRgHR-jtPY2ub5_l8aS0wngDktB3uilUzBpX9-OlrFLFuXBQgpkuibTE7uFKzPtUmDJo0FMx3m0QMmk6q_ZB2CubStNtmH_DrDbi7xV4EfY8qBmRabc43t_7JMSZHP4zF49wwsvNzL36cw7NH7gmLUqp6RWM1e6xyiuqSkpD',
      bg: 'bg-tertiary-fixed'
    }
  ];

  return (
    <div className="fixed inset-0 bg-background z-[150] flex overflow-hidden animate-in fade-in duration-500">
      {/* SideNavBar (Contextual) */}
      <nav className="w-64 border-r border-outline-variant bg-surface flex flex-col py-8 shrink-0">
        <div className="px-8 mb-12">
          <h1 className="font-display-lg text-primary text-4xl italic font-semibold tracking-tight">Vereda</h1>
          <p className="font-helper-text text-on-surface-variant mt-1 text-xs uppercase tracking-widest font-bold">O Caminho do Escritor</p>
        </div>
        
        <div className="px-6 mb-10">
          <button className="w-full bg-primary-container text-on-primary-container hover:opacity-90 font-body-ui rounded py-3 px-4 text-center transition-opacity flex justify-center items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">upload</span>
            Subir Manuscrito
          </button>
        </div>

        <ul className="flex flex-col gap-1 flex-grow">
          <li>
            <button className="w-full flex items-center gap-4 px-8 py-3 text-on-surface-variant hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">book_5</span>
              <span className="font-body-ui">Biblioteca</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-4 px-8 py-3 text-primary border-l-2 border-primary bg-surface-container-lowest font-semibold">
              <span className="material-symbols-outlined fill">groups</span>
              <span className="font-body-ui">Personas</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-4 px-8 py-3 text-on-surface-variant hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">diversity_3</span>
              <span className="font-body-ui">Leitores Beta</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-4 px-8 py-3 text-on-surface-variant hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">moving</span>
              <span className="font-body-ui">Estratégia de Crescimento</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto px-0">
          <ul className="flex flex-col gap-1">
            <li>
              <button className="w-full flex items-center gap-4 px-8 py-3 text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-sm">help_outline</span>
                <span className="font-helper-text">Ajuda</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-4 px-8 py-3 text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                <span className="font-helper-text">Arquivados</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen bg-background overflow-y-auto">
        {/* TopBar Actions */}
        <div className="flex justify-end items-center w-full px-12 py-6 gap-6 text-on-surface-variant sticky top-0 bg-background/80 backdrop-blur-md z-20">
          <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">visibility</span></button>
          <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">settings</span></button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-12 pb-20 mt-12 md:mt-0">
          <header className="mb-16 max-w-2xl">
            <h1 className="font-h1 text-on-background mb-4 text-3xl font-bold">Mapeamento de Persona Literária</h1>
            <p className="font-body-reading text-on-surface-variant text-lg">Descubra quem são os leitores que se conectam profundamente com a sua voz narrativa. Nossa inteligência analisa o DNA da sua prosa.</p>
          </header>

          {/* Analysis Entry Area */}
          <section className="mb-20">
            <div className="border border-dashed border-outline-variant bg-surface-container-lowest rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container-low cursor-pointer group">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-primary-container transition-colors">cloud_upload</span>
              </div>
              <h2 className="font-h2 text-on-background mb-2">Suba seu Corpus</h2>
              <p className="font-helper-text text-on-surface-variant max-w-md mb-8">Faça o upload do seu manuscrito em andamento (PDF, DOCX) ou cole trechos significativos para iniciarmos o mapeamento.</p>
              <button className="bg-primary-container text-on-primary-container font-body-ui py-3 px-8 rounded hover:opacity-90 transition-opacity">Selecionar Arquivo</button>
            </div>
          </section>

          {/* Persona Report Dashboard (Bento Grid Style) */}
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
              <h2 className="font-h2 text-on-background">Leitores Ideais (Personas)</h2>
              <span className="font-label-caps text-on-surface-variant px-3 py-1 bg-surface-container-low rounded-full">Análise Concluída</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personas.map(persona => (
                <div key={persona.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary transition-colors">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${persona.bg} opacity-20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}></div>
                  <div className="flex items-start gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                      <img alt="Retrato" className="w-full h-full object-cover grayscale opacity-80 transition-all group-hover:grayscale-0" src={persona.image} />
                    </div>
                    <div>
                      <h3 className="font-h2 text-lg text-on-background leading-tight">{persona.name}</h3>
                      <p className="font-helper-text text-on-surface-variant">{persona.age}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-label-caps text-on-surface-variant mb-3">Interesses Chave</h4>
                    <div className="flex flex-wrap gap-2">
                      {persona.interests.map(interest => (
                        <span key={interest} className={`${persona.bg} text-on-tertiary-fixed font-helper-text text-xs px-2 py-1 rounded`}>{interest}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-label-caps text-on-surface-variant mb-2">Por que ela leria você?</h4>
                    <p className="font-body-reading text-sm text-on-background leading-relaxed italic">"{persona.reason}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Section Grid (Beta Readers & Growth) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Beta Readers Profile */}
            <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">diversity_3</span>
                <h2 className="font-h2 text-on-background">Perfil de Leitor Beta</h2>
              </div>
              <p className="font-body-ui text-on-surface-variant mb-6">Com base nas personas, busque leitores beta que tenham paciência para narrativas não-lineares e sejam ativos em clubes de leitura universitários.</p>
              <div className="bg-surface-container-lowest p-4 border-l-2 border-primary">
                <h4 className="font-label-caps text-on-background mb-1">Dica de Recrutamento</h4>
                <p className="font-helper-text text-on-surface-variant">Priorize a 'Universitária Crítica' para a primeira rodada. Eles detectarão furos de roteiro com mais precisão.</p>
              </div>
            </section>

            {/* Growth Strategy */}
            <section className="bg-primary-container text-on-primary-container rounded-xl p-8 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="material-symbols-outlined text-9xl">moving</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary-fixed text-2xl">moving</span>
                  <h2 className="font-h2 text-on-primary-container">Estratégia de Escala</h2>
                </div>
                <p className="font-body-ui mb-6 opacity-90">Do nicho ao público amplo. Como expandir seu alcance literário sem perder a essência da sua voz.</p>
                <ul className="space-y-4 font-helper-text opacity-90">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-1 text-primary-fixed">check_circle</span>
                    <span>Foco Inicial: Revistas literárias independentes e zines online focados em realismo mágico.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-1 text-primary-fixed">check_circle</span>
                    <span>Expansão: Adaptar o tom reflexivo para ensaios curtos em plataformas como Medium ou Substack.</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
