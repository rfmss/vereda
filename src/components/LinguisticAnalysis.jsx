import React, { useState } from 'react';

export function LinguisticAnalysis({ text, onClose }) {
  const [selectedWord, setSelectedWord] = useState({
    text: 'do chão',
    pos: 'Substantivo',
    lema: 'chão',
    gender: 'Masculino',
    number: 'Singular',
    formation: 'de + o',
    definition: 'Classe de palavras com que se nomeiam os seres em geral (pessoas, animais, coisas, lugares, sentimentos).',
    tipologia: 'Neste contexto, "chão" é um substantivo comum, simples, primitivo e concreto.',
    examples: ['sertão', 'vento', 'silêncio']
  });

  const [activeTab, setActiveTab] = useState('morfologia');

  // Simple POS tagging mock
  const verbs = ['Olhava', 'Sentia', 'varrer', 'pareciam', 'orar', 'esperando', 'teimava', 'não chegar', 'erguia', 'marcando', 'Saber', 'ler', 'exigia'];
  const nouns = ['sertão', 'vento', 'poeira', 'do chão', 'árvores', 'silêncio', 'chuva', 'buriti', 'caminho', 'das águas', 'guardião', 'da vida', 'farol', 'vastidão', 'paisagem', 'paciência', 'olhar'];
  const adjectives = ['imenso', 'vazio', 'quente', 'fina', 'retorcidas', 'solitário', 'majestoso', 'profundas', 'oculta', 'verde', 'cinzenta', 'demorado'];

  const renderAnnotatedText = () => {
    if (!text) return null;
    
    const words = text.split(/(\s+)/);
    
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      
      if (verbs.includes(cleanWord)) {
        return (
          <span 
            key={i} 
            className="bg-primary-fixed-dim/30 text-on-primary-fixed-variant rounded-sm px-1 cursor-pointer hover:bg-primary-fixed transition-colors border-b border-primary-fixed"
            onClick={() => setSelectedWord({
              text: word,
              pos: 'Verbo',
              lema: cleanWord.toLowerCase(),
              gender: '-',
              number: '-',
              formation: 'Primitiva',
              definition: 'Classe de palavras que indicam ação, estado ou fenômeno da natureza.',
              tipologia: 'Verbo de ação no pretérito imperfeito.',
              examples: ['olhava', 'sentia', 'varrer']
            })}
          >
            {word}
          </span>
        );
      }
      if (nouns.includes(cleanWord)) {
        return (
          <span 
            key={i} 
            className={`bg-secondary-fixed-dim/20 text-on-secondary-fixed rounded-sm px-1 cursor-pointer hover:bg-secondary-fixed transition-colors ${selectedWord.text === word ? 'ring-2 ring-outline-variant bg-surface-container' : ''}`}
            onClick={() => setSelectedWord({
              text: word,
              pos: 'Substantivo',
              lema: cleanWord.toLowerCase(),
              gender: 'Masculino',
              number: 'Singular',
              formation: 'Primitiva',
              definition: 'Classe de palavras com que se nomeiam os seres em geral (pessoas, animais, coisas, lugares, sentimentos).',
              tipologia: 'Substantivo comum, simples e concreto.',
              examples: ['sertão', 'vento', 'buriti']
            })}
          >
            {word}
          </span>
        );
      }
      if (adjectives.includes(cleanWord)) {
        return (
          <span 
            key={i} 
            className="bg-tertiary-fixed-dim/20 text-on-tertiary-fixed rounded-sm px-1 cursor-pointer hover:bg-tertiary-fixed transition-colors"
            onClick={() => setSelectedWord({
              text: word,
              pos: 'Adjetivo',
              lema: cleanWord.toLowerCase(),
              gender: 'Uniforme',
              number: 'Singular',
              formation: 'Primitiva',
              definition: 'Classe de palavras que atribui características, qualidades ou estados aos substantivos.',
              tipologia: 'Adjetivo qualificativo.',
              examples: ['imenso', 'vazio', 'solitário']
            })}
          >
            {word}
          </span>
        );
      }
      
      return <span key={i}>{word}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex bg-background animate-in fade-in duration-500 overflow-hidden">
      {/* SideNavBar (Internal Analysis Tabs) */}
      <nav className="w-64 border-r border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-950 flex flex-col pt-20 shrink-0">
        <div className="px-6 mb-8">
          <h2 className="text-stone-800 dark:text-stone-100 font-bold text-sm tracking-wider uppercase">Análise</h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">Processamento Vereda</p>
        </div>
        <div className="flex-1 flex flex-col gap-1 font-sans text-xs uppercase tracking-widest font-medium">
          {[
            { id: 'morfologia', icon: 'segment', label: 'Morfologia' },
            { id: 'sintaxe', icon: 'account_tree', label: 'Sintaxe' },
            { id: 'semantica', icon: 'psychology', label: 'Semântica' },
            { id: 'lexico', icon: 'format_quote', label: 'Léxico' },
            { id: 'estatistica', icon: 'bar_chart', label: 'Estatística' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 ease-out border-l-2 ${activeTab === tab.id ? 'border-primary bg-stone-200/50 dark:bg-stone-900 text-primary dark:text-emerald-400' : 'border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900/50'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-auto border-t border-stone-200 dark:border-stone-800 pt-2 pb-4">
          <button className="w-full flex items-center gap-3 text-stone-500 dark:text-stone-400 px-6 py-4 hover:bg-stone-100 dark:hover:bg-stone-900/50 transition-all font-sans text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Exportar
          </button>
          <button className="w-full flex items-center gap-3 text-stone-500 dark:text-stone-400 px-6 py-4 hover:bg-stone-100 dark:hover:bg-stone-900/50 transition-all font-sans text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Ajustes
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full bg-background relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-[#F2EFE9] dark:bg-stone-900 flex justify-between items-center px-12 shrink-0">
          <div className="flex items-center gap-12">
            <div className="text-2xl font-serif font-semibold text-primary dark:text-emerald-500 italic">Vereda</div>
            <nav className="flex items-center gap-8 font-serif text-stone-500">
              <button className="hover:text-stone-800" onClick={onClose}>Escrita</button>
              <button className="text-primary border-b-2 border-primary pb-1 font-bold">Estrutura</button>
              <button className="hover:text-stone-800">Revisão</button>
              <button className="hover:text-stone-800">Arquivo</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
             <button className="p-2 rounded-full hover:bg-stone-200/50 text-primary"><span className="material-symbols-outlined text-[20px]">analytics</span></button>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500"><span className="material-symbols-outlined text-[20px]">close</span></button>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Annotated Editor Canvas */}
          <main className="flex-1 overflow-y-auto bg-white dark:bg-stone-900 relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-surface/50 to-transparent h-16 z-0"></div>
            <article className="max-w-container-max-width mx-auto px-gutter py-margin-focus font-body-reading text-body-reading text-on-surface dark:text-stone-200 leading-relaxed text-justify relative z-10 selection:bg-primary-fixed selection:text-on-primary-fixed">
              <h1 className="font-display-lg text-5xl font-bold mb-12 text-on-background dark:text-white">O Buriti e a Vereda</h1>
              <div className="space-y-8 first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                <p className="indent-8">{renderAnnotatedText()}</p>
                <span className="inline-block w-[2px] h-[1em] bg-on-surface-variant align-middle animate-pulse ml-1"></span>
              </div>
            </article>
          </main>

          {/* Right Column (Metrics & Inspector) */}
          <aside className="w-[340px] border-l border-stone-200 dark:border-stone-800 bg-[#F6F3F2] dark:bg-stone-950 flex flex-col shrink-0 overflow-y-auto">
            <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <h3 className="font-h2 text-lg font-bold text-on-surface dark:text-stone-100">Inspeção Lexical</h3>
              <p className="font-helper-text text-xs text-on-surface-variant dark:text-stone-400 mt-1">Análise morfológica contextual</p>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Selected Item Card (Bento Style) */}
              <div className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-fixed/20 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="font-label-caps text-[10px] text-secondary dark:text-orange-400 mb-2 uppercase font-bold tracking-widest">{selectedWord.pos}</div>
                <div className="font-display-lg text-3xl leading-tight text-on-surface dark:text-stone-100 mb-6 font-bold italic tracking-tight">"{selectedWord.text}"</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1">LEMA</span>
                    <span className="font-body-ui text-sm text-on-surface dark:text-stone-200">{selectedWord.lema}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1">GÊNERO</span>
                    <span className="font-body-ui text-sm text-on-surface dark:text-stone-200">{selectedWord.gender}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1">NÚMERO</span>
                    <span className="font-body-ui text-sm text-on-surface dark:text-stone-200">{selectedWord.number}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1">FORMAÇÃO</span>
                    <span className="font-body-ui text-sm text-on-surface dark:text-stone-200">{selectedWord.formation}</span>
                  </div>
                </div>
              </div>

              {/* Density Metrics (Bento Style) */}
              <div className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm">
                <h4 className="font-body-ui text-sm font-bold text-on-surface dark:text-stone-100 mb-4 flex items-center justify-between">
                  Densidade do Trecho
                  <span className="material-symbols-outlined text-[18px] text-stone-400">monitoring</span>
                </h4>
                <div className="space-y-4">
                  {[
                    { label: 'Substantivos', value: 42, color: 'bg-secondary' },
                    { label: 'Verbos', value: 28, color: 'bg-primary' },
                    { label: 'Adjetivos', value: 18, color: 'bg-tertiary' }
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-widest">
                        <span className="text-on-surface-variant dark:text-stone-400">{metric.label}</span>
                        <span className="text-on-surface dark:text-stone-200">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-900 rounded-full h-1.5">
                        <div className={`${metric.color} h-1.5 rounded-full`} style={{ width: `${metric.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academia Gramatical (Bento Style) */}
              <div className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm">
                <h4 className="font-body-ui text-sm font-bold text-on-surface dark:text-stone-100 mb-3 flex items-center justify-between">
                  Academia Gramatical
                  <span className="material-symbols-outlined text-[18px] text-stone-400">school</span>
                </h4>
                <div className="font-body-reading text-[18px] leading-snug text-secondary dark:text-orange-400 mb-4 italic">
                  A âncora da frase, o {selectedWord.pos.toLowerCase()} dá nome ao mundo ao seu redor.
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1 uppercase tracking-widest">Definição</span>
                    <p className="font-body-ui text-xs text-on-surface dark:text-stone-200 leading-relaxed">
                      {selectedWord.definition}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1 uppercase tracking-widest">Tipologia</span>
                    <p className="font-body-ui text-xs text-on-surface dark:text-stone-200 leading-relaxed">
                      {selectedWord.tipologia}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-stone-400 block mb-1 uppercase tracking-widest">Exemplos no Texto</span>
                    <ul className="list-disc list-inside font-body-ui text-xs text-secondary dark:text-orange-400 space-y-1 mt-1">
                      {selectedWord.examples.map(ex => <li key={ex}>{ex}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer StatusBar */}
        <footer className="h-10 bg-[#E4E2E1] dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 shrink-0 text-stone-500 dark:text-stone-400 font-helper-text text-[11px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>Processamento Vereda: Sincronizado</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">edit_document</span>
              {text?.split(/\s+/).length || 0} palavras
            </span>
            <span>Ln 12, Col 4</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
