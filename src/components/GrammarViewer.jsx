import React, { useMemo, useState } from 'react';
import { analyzeText } from '../utils/posTagger';

const classColors = {
  substantivo: '#99462a', // secondary
  artigo: '#45655a', // surface-tint
  adjetivo: '#2e4d43', // primary-container
  pronome: '#9bbdb0', // on-primary-container
  verbo: '#762c12', // on-secondary-container
  adverbio: '#613d38', // on-tertiary-fixed-variant
  conjuncao: '#482824', // tertiary
  interjeicao: '#ba1a1a', // error
  numeral: '#7a2f15', // on-secondary-fixed-variant
  preposicao: '#414845', // on-surface-variant
  punctuation: 'inherit'
};

const classLabels = {
  substantivo: 'Substantivo',
  artigo: 'Artigo',
  adjetivo: 'Adjetivo',
  pronome: 'Pronome',
  verbo: 'Verbo',
  adverbio: 'Advérbio',
  conjuncao: 'Conjunção',
  interjeicao: 'Interjeição',
  numeral: 'Numeral',
  preposicao: 'Preposição'
};

const grammarAcademyData = {
  substantivo: {
    title: 'Substantivo',
    friendlyDesc: 'Se o seu texto fosse um corpo, o Substantivo seria o esqueleto. Ele dá nome a tudo: pessoas, lugares, objetos e até o que a gente só sente.',
    desc: 'Palavra variável que nomeia os seres em geral (pessoas, animais, objetos, lugares, sentimentos, estados, qualidades e ações). É o núcleo de funções sintáticas fundamentais.',
    classifications: [
      { type: 'Comum / Próprio', details: 'Comum nomeia a espécie (cidade, homem). Próprio nomeia um ser específico (Paris, João).' },
      { type: 'Concreto / Abstrato', details: 'Concreto tem existência independente (mesa, mar). Abstrato depende de outro ser (amor, beleza).' },
      { type: 'Primitivo / Derivado', details: 'Primitivo não vem de outra palavra (pedra). Derivado vem (pedregulho).' }
    ],
    examples: [
      { base: 'A ', highlight: 'esperança', rest: ' é uma virtude poderosa.' },
      { base: 'O ', highlight: 'vento', rest: ' soprava forte no sertão.' }
    ]
  },
  adjetivo: {
    title: 'Adjetivo',
    friendlyDesc: 'Se a vida fosse um filme, o Adjetivo seria a direção de arte. Ele dá aquele charme, cor e qualidades pro seu texto.',
    desc: 'Palavra que se junta ao substantivo para atribuir-lhe uma qualidade, estado ou modo de ser. Sintaticamente, funciona como adjunto adnominal ou predicativo.',
    classifications: [
      { type: 'Explicativo / Restritivo', details: 'Explicativo exprime qualidade inerente (neve branca). Restritivo exprime qualidade acidental (carro branco).' },
      { type: 'Primitivo / Derivado', details: 'Primitivo (bom, feliz). Derivado (amável, carnavalesco).' }
    ],
    examples: [
      { base: 'Que filme ', highlight: 'fantástico', rest: '!' },
      { base: 'Ela usava um vestido ', highlight: 'vermelho', rest: '.' }
    ]
  },
  verbo: {
    title: 'Verbo',
    friendlyDesc: 'O Verbo é o motor da sua história. Sem ele, nada acontece. Ele é a ação, o estado ou a mudança que move os seus personagens.',
    desc: 'Palavra de forma variável que exprime acontecimento representado no tempo (ação, estado, mudança ou fenômeno natural). Flexiona em número, pessoa, modo, tempo e voz.',
    classifications: [
      { type: 'Regular / Irregular', details: 'Regular segue o radical padrão. Irregular sofre alterações profundas (ser, ir).' },
      { type: 'Transitivo / Intransitivo', details: 'Transitivo exige complemento (comprei um livro). Intransitivo tem sentido completo (ele morreu).' }
    ],
    examples: [
      { base: 'A chuva ', highlight: 'caiu', rest: ' e ela ficou triste.' },
      { base: 'O autor ', highlight: 'escreveu', rest: ' uma obra-prima.' }
    ]
  },
  adverbio: {
    title: 'Advérbio',
    friendlyDesc: 'O Advérbio é o "ajuste fino". Ele diz onde, quando e como a ação aconteceu, mudando o tom da sua narração.',
    desc: 'Palavra invariável que modifica o sentido do verbo, do adjetivo ou de outro advérbio, indicando uma circunstância (lugar, tempo, modo, intensidade, negação, etc.).',
    classifications: [
      { type: 'Modo / Tempo', details: 'Modo (bem, mal, rapidamente). Tempo (ontem, agora, jamais).' },
      { type: 'Lugar / Intensidade', details: 'Lugar (aqui, lá, longe). Intensidade (muito, pouco, bastante).' }
    ],
    examples: [
      { base: 'Ele correu ', highlight: 'rapidamente', rest: ' para casa.' },
      { base: 'Ela chegou ', highlight: 'ontem', rest: ' à noite.' }
    ]
  },
  pronome: {
    title: 'Pronome',
    friendlyDesc: 'O Pronome é o elenco substituto. Ele evita que seu texto fique cansativo, substituindo nomes e organizando quem é quem no seu diálogo.',
    desc: 'Palavra que substitui ou acompanha o substantivo, indicando a relação das pessoas do discurso ou situando-o no tempo e no espaço.',
    classifications: [
      { type: 'Pessoal / Possessivo', details: 'Pessoal (eu, tu, ele). Possessivo (meu, seu, nosso).' },
      { type: 'Demonstrativo / Relativo', details: 'Demonstrativo (este, aquele). Relativo (que, o qual, cujo).' }
    ],
    examples: [
      { base: '', highlight: 'Ela', rest: ' trouxe o seu próprio material.' },
      { base: 'Este livro é ', highlight: 'meu', rest: '.' }
    ]
  },
  preposicao: {
    title: 'Preposição',
    friendlyDesc: 'A Preposição é o cimento. Ela une as palavras e cria pontes de sentido que mantêm o seu texto firme e coeso.',
    desc: 'Palavra invariável que liga dois termos da oração, estabelecendo entre eles uma relação de dependência e significado.',
    classifications: [
      { type: 'Essenciais', details: 'Sempre funcionam como preposição (a, de, em, por, com, para).' },
      { type: 'Acidentais', details: 'Palavras de outras classes que podem agir como preposição (como, conforme, consoante).' }
    ],
    examples: [
      { base: 'O livro está ', highlight: 'sobre', rest: ' a mesa.' },
      { base: 'Café ', highlight: 'com', rest: ' leite é clássico.' }
    ]
  },
  conjuncao: {
    title: 'Conjunção',
    friendlyDesc: 'A Conjunção é a engenharia do texto. Ela liga orações e ideias, decidindo se elas vão se somar, se opor ou se explicar.',
    desc: 'Palavra invariável que liga duas orações ou dois termos de mesma função sintática, estabelecendo relações lógicas de coordenação ou subordinação.',
    classifications: [
      { type: 'Adversativa / Aditiva', details: 'Adversativa indica oposição (mas, porém). Aditiva indica soma (e, nem).' },
      { type: 'Causal / Conclusiva', details: 'Causal indica motivo (porque). Conclusiva indica resultado (logo, portanto).' }
    ],
    examples: [
      { base: 'Estudei muito, ', highlight: 'mas', rest: ' não passei.' },
      { base: 'Saímos cedo ', highlight: 'porque', rest: ' ia chover.' }
    ]
  },
  artigo: {
    title: 'Artigo',
    friendlyDesc: 'O Artigo é a lente da câmera. Ele decide se você está focando em um personagem específico ou em qualquer um na multidão.',
    desc: 'Palavra que se antepõe ao substantivo para determiná-lo ou indeterminá-lo, indicando também o gênero e o número.',
    classifications: [
      { type: 'Definidos', details: 'Precisam o ser de forma específica (o, a, os, as).' },
      { type: 'Indefinidos', details: 'Apresentam o ser de forma genérica (um, uma, uns, umas).' }
    ],
    examples: [
      { base: '', highlight: 'O', rest: ' autor escreveu uma obra excelente.' },
      { base: 'Vi ', highlight: 'uma', rest: ' estrela cadente.' }
    ]
  },
  numeral: {
    title: 'Numeral',
    friendlyDesc: 'O Numeral é o contador da história. Ele traz precisão, ritmo e ordem para os detalhes que importam na sua cena.',
    desc: 'Palavra que indica quantidade exata de seres ou o lugar que eles ocupam numa série.',
    classifications: [
      { type: 'Cardinal / Ordinal', details: 'Cardinal indica quantidade (um, dois). Ordinal indica ordem (primeiro, décimo).' },
      { type: 'Multiplicativo', details: 'Indica aumento proporcional (dobro, triplo).' }
    ],
    examples: [
      { base: 'Foram ', highlight: 'dois', rest: ' dias de viagem.' },
      { base: 'Ele chegou em ', highlight: 'primeiro', rest: ' lugar.' }
    ]
  },
  interjeicao: {
    title: 'Interjeição',
    friendlyDesc: 'A Interjeição é a alma pura do texto. É o grito, o suspiro ou o espanto que traduz a emoção imediata de quem vive a cena.',
    desc: 'Palavra (ou locução) invariável que exprime emoções, sentimentos, estados de espírito ou apelos súbitos.',
    classifications: [
      { type: 'Alívio / Dor', details: 'Alívio (Ufa! Ah!). Dor (Ai! Ui!).' },
      { type: 'Admiração / Apelo', details: 'Admiração (Nossa! Oh!). Apelo (Psiu! Ei!).' }
    ],
    examples: [
      { base: '', highlight: 'Ufa', rest: '! O perigo passou.' },
      { base: '', highlight: 'Nossa', rest: ', que vista incrível!' }
    ]
  }
};

export function GrammarViewer({ text }) {
  const tokens = useMemo(() => analyzeText(text), [text]);
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8">
      {/* Editor/Text Display */}
      <div className="bg-white dark:bg-stone-900/50 p-8 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 font-body-reading text-body-reading leading-relaxed">
        {tokens.map((t, i) => (
          <span 
            key={i} 
            style={{ color: t.isWord ? classColors[t.tag] : 'inherit' }}
            className={`transition-all duration-200 ${t.isWord ? 'font-medium cursor-help hover:opacity-70 underline decoration-dotted decoration-2 underline-offset-4' : ''}`}
            onClick={() => t.isWord && setSelectedClass(t.tag)}
            title={t.isWord ? classLabels[t.tag] || t.tag : ''}
          >
            {t.text}
          </span>
        ))}
      </div>

      {/* Legend / Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(classColors).filter(([tag]) => tag !== 'punctuation').map(([tag, color]) => (
          <button 
            key={tag} 
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${
              selectedClass === tag 
                ? 'bg-stone-900 text-white border-stone-900 dark:bg-emerald-500 dark:text-stone-950 dark:border-emerald-500 shadow-md scale-105' 
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
            }`}
            onClick={() => setSelectedClass(selectedClass === tag ? null : tag)}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
            {classLabels[tag] || tag}
          </button>
        ))}
      </div>
      
      {/* Detail Card */}
      {selectedClass && grammarAcademyData[selectedClass] && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border-l-4 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ borderLeftColor: classColors[selectedClass] }}>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800" style={{ color: classColors[selectedClass] }}>
                <span className="material-symbols-outlined text-3xl">menu_book</span>
              </div>
              <div>
                <h4 className="text-2xl font-display-lg font-bold text-stone-800 dark:text-stone-100 italic">{grammarAcademyData[selectedClass].title}</h4>
                <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">Academia Gramatical</p>
              </div>
            </div>

            <p className="text-lg font-body-reading italic text-stone-600 dark:text-stone-300 leading-relaxed">
              "{grammarAcademyData[selectedClass].friendlyDesc}"
            </p>

            <div className="h-px bg-stone-100 dark:bg-stone-800"></div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-widest text-primary">Definição Técnica</h5>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {grammarAcademyData[selectedClass].desc}
                </p>

                {grammarAcademyData[selectedClass].classifications && (
                  <div className="space-y-3 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-primary">Tipologia</h5>
                    <div className="space-y-3">
                      {grammarAcademyData[selectedClass].classifications.map((item, idx) => (
                        <div key={idx} className="group">
                          <div className="text-xs font-bold mb-1 transition-colors" style={{ color: classColors[selectedClass] }}>{item.type}</div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{item.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 bg-stone-50 dark:bg-stone-800/50 p-6 rounded-xl border border-stone-100 dark:border-stone-800">
                <h5 className="text-xs font-bold uppercase tracking-widest text-primary">Exemplos Práticos</h5>
                <div className="space-y-4">
                  {grammarAcademyData[selectedClass].examples.map((ex, i) => (
                    <div key={i} className="text-sm font-body-reading leading-relaxed">
                      <span className="text-stone-400 mr-2">Ex.{i + 1}</span>
                      <span className="text-stone-700 dark:text-stone-300">
                        "{ex.base}
                        <span className="font-bold underline decoration-2 underline-offset-4" style={{ color: classColors[selectedClass] }}>
                          {ex.highlight}
                        </span>
                        {ex.rest}"
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8 py-4 bg-stone-100 dark:bg-stone-800/80 flex justify-between items-center">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest">Módulo Academia Literária • Vereda 2026</span>
            <button onClick={() => setSelectedClass(null)} className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors uppercase tracking-widest">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
