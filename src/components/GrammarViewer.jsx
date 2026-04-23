import React, { useMemo, useState } from 'react';
import { analyzeText } from '../utils/posTagger';

const classColors = {
  substantivo: '#e06c75', // red
  artigo: '#56b6c2', // cyan
  adjetivo: '#d19a66', // orange
  pronome: '#c678dd', // purple
  verbo: '#98c379', // green
  adverbio: '#e5c07b', // yellow
  conjuncao: '#61afef', // blue
  interjeicao: '#be5046', // dark red
  numeral: '#d19a66', // orange
  preposicao: '#abb2bf', // gray
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
    friendlyDesc: 'Tudo no mundo precisa de um nome, né? É aí que entra o Substantivo, o grande astro das nossas frases.',
    desc: 'Classe morfológica nuclear que nomeia seres, objetos, fenômenos, lugares, qualidades e ações. Sintaticamente, exerce a função de núcleo dos termos essenciais e integrantes da oração.',
    classifications: [
      { type: 'Comum / Próprio', details: 'Comum designa seres genéricos da mesma espécie (cidade). Próprio designa um ser específico, grafado em maiúscula (Londres).' },
      { type: 'Concreto / Abstrato', details: 'Concreto possui existência real ou imaginária (mesa, dragão). Abstrato indica sentimentos ou ações e depende de outro ser (saudade, corrida).' },
      { type: 'Primitivo / Derivado', details: 'Primitivo não provém de outra palavra (pedra). Derivado origina-se de outra palavra (pedreiro).' },
      { type: 'Simples / Composto', details: 'Simples possui um único radical (sol). Composto possui dois ou mais radicais (girassol).' },
      { type: 'Coletivo', details: 'Mesmo no singular, indica uma multiplicidade de seres da mesma espécie (alcateia).' }
    ],
    examples: [
      { base: 'O ', highlight: 'tempo', rest: ' voa rapidamente.' },
      { base: 'A ', highlight: 'felicidade', rest: ' é feita de pequenos momentos.' },
      { base: 'Comprei um ', highlight: 'carro', rest: ' novo ontem.' }
    ],
    color: classColors.substantivo 
  },
  artigo: { 
    title: 'Artigo', 
    friendlyDesc: 'O Artigo é aquele anfitrião que anuncia a chegada do Substantivo: "Vem aí O carro, vem aí UMA chance".',
    desc: 'Vocábulo que se antepõe ao substantivo para determiná-lo ou indeterminá-lo, indicando simultaneamente seu gênero e número. É um modificador nominal estrito.', 
    classifications: [
      { type: 'Definidos', details: 'Determinam o substantivo de forma precisa e particularizada. São eles: o, a, os, as.' },
      { type: 'Indefinidos', details: 'Indeterminam o substantivo, tratando-o de forma vaga ou genérica. São eles: um, uma, uns, umas.' }
    ],
    examples: [
      { base: 'Li ', highlight: 'um', rest: ' livro excelente.' },
      { base: '', highlight: 'A', rest: ' casa amarela foi vendida.' },
      { base: 'Quero comprar ', highlight: 'uns', rest: ' doces.' }
    ],
    color: classColors.artigo 
  },
  adjetivo: { 
    title: 'Adjetivo', 
    friendlyDesc: 'Se a vida fosse um filme, o Adjetivo seria a direção de arte. Ele dá aquele charme, cor e qualidades pro seu texto.',
    desc: 'Palavra que se junta ao substantivo para atribuir-lhe uma qualidade, estado ou modo de ser. Sintaticamente, funciona como adjunto adnominal ou predicativo.', 
    classifications: [
      { type: 'Explicativo / Restritivo', details: 'Explicativo exprime qualidade inerente ao ser (neve branca). Restritivo exprime qualidade acidental (carro branco).' },
      { type: 'Primitivo / Derivado', details: 'Primitivo (bom, feliz). Derivado, originado de verbos ou substantivos (amável, carnavalesco).' },
      { type: 'Simples / Composto', details: 'Simples tem um radical (azul). Composto tem mais de um radical (azul-marinho).' },
      { type: 'Pátrio ou Gentílico', details: 'Indica nacionalidade ou origem geográfica (brasileiro, paulista).' }
    ],
    examples: [
      { base: 'Que filme ', highlight: 'fantástico', rest: '!' },
      { base: 'Ela usava um vestido ', highlight: 'vermelho', rest: '.' },
      { base: 'Tivemos um dia muito ', highlight: 'produtivo', rest: '.' }
    ],
    color: classColors.adjetivo 
  },
  pronome: { 
    title: 'Pronome', 
    friendlyDesc: 'O Pronome é tipo aquele dublê de cinema: ele entra no lugar do astro principal para você não precisar repetir a mesma palavra mil vezes.',
    desc: 'Palavra que substitui (pronome substantivo) ou acompanha (pronome adjetivo) o substantivo, indicando sua posição em relação às pessoas do discurso.', 
    classifications: [
      { type: 'Pessoais', details: 'Retos exercem função de sujeito (eu, tu, ele); Oblíquos função de complemento (me, mim, te).' },
      { type: 'Possessivos', details: 'Indicam posse em relação às pessoas do discurso (meu, sua, nosso).' },
      { type: 'Demonstrativos', details: 'Situam os seres no tempo ou espaço (este, esse, aquele).' },
      { type: 'Relativos', details: 'Retomam um termo anterior, ligando orações (que, o qual, onde).' },
      { type: 'Indefinidos', details: 'Referem-se à 3ª pessoa de forma vaga (alguém, tudo, nenhum).' },
      { type: 'Interrogativos', details: 'Usados em perguntas diretas ou indiretas (que, quem, qual, quanto).' }
    ],
    examples: [
      { base: '', highlight: 'Ela', rest: ' resolveu o problema rapidamente.' },
      { base: 'Este livro é ', highlight: 'meu', rest: '.' },
      { base: '', highlight: 'Quem', rest: ' deixou a porta aberta?' }
    ],
    color: classColors.pronome 
  },
  verbo: { 
    title: 'Verbo', 
    friendlyDesc: 'Sabe aquela palavra que faz a ação acontecer e bota a frase pra se mexer? Esse é o Verbo, o verdadeiro motor da história.',
    desc: 'Núcleo do predicado verbal que exprime processo (ação, estado, ou fenômeno meteorológico), flexionando-se em pessoa, número, tempo, modo e voz.', 
    classifications: [
      { type: 'Regulares / Irregulares', details: 'Regulares mantêm o radical inalterado. Irregulares sofrem alteração (fazer -> faço).' },
      { type: 'Anômalos / Defectivos', details: 'Anômalos mudam profundamente o radical (ser -> sou/fui). Defectivos não possuem conjugação completa (falir).' },
      { type: 'Transitividade', details: 'Direta (sem preposição), Indireta (com preposição), Intransitivos (sentido completo) e de Ligação (indicam estado).' }
    ],
    examples: [
      { base: 'Nós ', highlight: 'corremos', rest: ' no parque todos os dias.' },
      { base: 'Hoje ', highlight: 'choveu', rest: ' bastante na cidade.' },
      { base: 'Eles ', highlight: 'estão', rest: ' muito cansados.' }
    ],
    color: classColors.verbo 
  },
  adverbio: { 
    title: 'Advérbio', 
    friendlyDesc: 'O Advérbio é o narrador fofoqueiro: ele te conta exatamente COMO, ONDE e QUANDO a cena aconteceu.',
    desc: 'Palavra invariável que atua primariamente como modificador do verbo, exprimindo uma circunstância. Pode também intensificar adjetivos ou advérbios.', 
    classifications: [
      { type: 'Lugar e Tempo', details: 'Circunstância espacial (aqui, lá, perto) ou temporal (hoje, sempre, nunca).' },
      { type: 'Modo', details: 'Indica a maneira como a ação ocorre (bem, mal, rapidamente).' },
      { type: 'Intensidade', details: 'Atua como quantificador ou graduador (muito, pouco, bastante).' },
      { type: 'Afirmação, Negação, Dúvida', details: 'Afirmação (sim, decerto), Negação (não, jamais) e Dúvida (talvez, quiçá).' }
    ],
    examples: [
      { base: 'Eles chegaram ', highlight: 'muito', rest: ' cedo.' },
      { base: 'Ela cantou ', highlight: 'maravilhosamente', rest: ' bem na apresentação.' },
      { base: '', highlight: 'Talvez', rest: ' eu viaje amanhã.' }
    ],
    color: classColors.adverbio 
  },
  conjuncao: { 
    title: 'Conjunção', 
    friendlyDesc: 'Pense na Conjunção como uma super cola. É ela que junta as partes do seu texto para não ficar tudo solto e sem sentido.',
    desc: 'Palavra invariável cuja função estrita é conectar termos de mesma função sintática ou ligar orações, estabelecendo entre elas relações lógicas.', 
    classifications: [
      { type: 'Coordenativas', details: 'Ligam elementos independentes: Aditivas (e), Adversativas (mas), Alternativas (ou), Conclusivas (logo) ou Explicativas (pois).' },
      { type: 'Subordinativas', details: 'Ligam orações dependentes: Causais (porque), Condicionais (se), Concessivas (embora), Temporais (quando), Finais (para que), etc.' }
    ],
    examples: [
      { base: 'Estudou muito, ', highlight: 'mas', rest: ' não passou.' },
      { base: 'Vou comprar pão ', highlight: 'e', rest: ' leite.' },
      { base: 'Não sairemos ', highlight: 'se', rest: ' estiver chovendo.' }
    ],
    color: classColors.conjuncao 
  },
  interjeicao: { 
    title: 'Interjeição', 
    friendlyDesc: 'Uau! Eita! Socorro! A Interjeição é pura emoção e grito solto, perfeita pra trazer aquela dramaticidade pro papel.',
    desc: 'Palavra-frase invariável que constitui um enunciado autônomo, exprimindo emoções, reações súbitas, apelos ou sentimentos do emissor.', 
    classifications: [
      { type: 'Alegria e Aplauso', details: 'Ex: oba!, viva!, bravo!, bis!' },
      { type: 'Dor e Surpresa', details: 'Ex: ai!, ui!, nossa!, caramba!, puxa!' },
      { type: 'Apelo e Silêncio', details: 'Ex: psit!, alô!, psiu!, silêncio!' },
      { type: 'Locução Interjetiva', details: 'Duas ou mais palavras com valor de interjeição (ex: Virgem Maria!, Cruz credo!).' }
    ],
    examples: [
      { base: '', highlight: 'Nossa', rest: '! Que susto você me deu.' },
      { base: '', highlight: 'Puxa', rest: ', eu não esperava por isso.' },
      { base: '', highlight: 'Ah', rest: ', agora eu entendi o problema!' }
    ],
    color: classColors.interjeicao 
  },
  numeral: { 
    title: 'Numeral', 
    friendlyDesc: 'Se tem matemática no texto, o Numeral tá na área pra organizar a fila e dizer a quantidade e a ordem exata das coisas.',
    desc: 'Palavra que exprime a quantidade exata de pessoas ou coisas, bem como a posição ou lugar que elas ocupam numa determinada sequência.', 
    classifications: [
      { type: 'Cardinais', details: 'Indicam a quantidade exata de seres (um, dois, mil).' },
      { type: 'Ordinais', details: 'Indicam a posição ou ordem que o ser ocupa numa série (primeiro, décimo).' },
      { type: 'Multiplicativos', details: 'Exprimem o número de vezes pelo qual uma quantidade é multiplicada (dobro, triplo).' },
      { type: 'Fracionários', details: 'Exprimem a divisão ou fração de uma quantidade (meio, terço).' }
    ],
    examples: [
      { base: 'Comprei ', highlight: 'três', rest: ' maçãs no mercado.' },
      { base: 'Ele foi o ', highlight: 'primeiro', rest: ' a chegar na corrida.' },
      { base: 'Comi ', highlight: 'metade', rest: ' da pizza.' }
    ],
    color: classColors.numeral 
  },
  preposicao: { 
    title: 'Preposição', 
    friendlyDesc: 'A Preposição é a pontezinha de madeira que liga uma palavra na outra e faz a relação entre elas funcionar direitinho.',
    desc: 'Palavra invariável que atua como conectivo subordinativo, ligando um termo dependente a um regente de modo a estabelecer relações de sentido.', 
    classifications: [
      { type: 'Essenciais', details: 'Palavras que sempre funcionam como preposição (a, ante, após, até, com, contra, de, desde, em, entre, para, perante, por, sem, sob, sobre, trás).' },
      { type: 'Acidentais', details: 'Palavras de outras classes que, em determinados contextos, atuam como preposições (como, conforme, consoante, segundo, mediante, exceto).' }
    ],
    examples: [
      { base: 'Fui ', highlight: 'para', rest: ' casa cedo.' },
      { base: 'Café ', highlight: 'com', rest: ' leite é delicioso.' },
      { base: 'Estou caminhando ', highlight: 'até', rest: ' o centro da cidade.' }
    ],
    color: classColors.preposicao 
  }
};

export function GrammarViewer({ text }) {
  const tokens = useMemo(() => analyzeText(text), [text]);
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="grammar-viewer-container">
      <div className="grammar-viewer">
        {tokens.map((t, i) => (
          <span 
            key={i} 
            style={{ color: t.isWord ? classColors[t.tag] : 'inherit' }}
            data-tooltip={t.isWord ? classLabels[t.tag] || t.tag : ''}
            className={`grammar-token ${t.isWord ? 'is-word' : ''}`}
          >
            {t.text}
          </span>
        ))}
      </div>
      <div className="grammar-legend">
        {Object.entries(classColors).filter(([tag]) => tag !== 'punctuation').map(([tag, color]) => (
          <div 
            key={tag} 
            className={`legend-item ${selectedClass === tag ? 'active' : ''}`}
            onClick={() => setSelectedClass(selectedClass === tag ? null : tag)}
          >
            <span className="legend-color" style={{ backgroundColor: color }}></span>
            {classLabels[tag] || tag}
          </div>
        ))}
      </div>
      
      {selectedClass && grammarAcademyData[selectedClass] && (
        <div className="grammar-academy-card">
          <div className="academy-header">
            <span className="academy-dot" style={{ backgroundColor: grammarAcademyData[selectedClass].color }}></span>
            <h4>{grammarAcademyData[selectedClass].title}</h4>
          </div>
          <p className="academy-friendly-desc">{grammarAcademyData[selectedClass].friendlyDesc}</p>
          <div className="academy-divider"></div>
          <p className="academy-desc">{grammarAcademyData[selectedClass].desc}</p>
          
          {grammarAcademyData[selectedClass].classifications && (
            <div className="academy-classifications">
              <h5 className="classifications-title">Tipologia e Classificações</h5>
              <ul>
                {grammarAcademyData[selectedClass].classifications.map((item, idx) => (
                  <li key={idx} className="classification-item">
                    <span className="classification-type" style={{ color: grammarAcademyData[selectedClass].color }}>
                      {item.type}:
                    </span>{' '}
                    {item.details}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h5 className="classifications-title" style={{ marginTop: '1.5rem' }}>Exemplos Práticos</h5>
          <div className="academy-examples-list">
            {grammarAcademyData[selectedClass].examples.map((ex, i) => (
              <div key={i} className="academy-example">
                <strong>Ex. {i + 1}:</strong> "{ex.base}
                <span style={{ color: grammarAcademyData[selectedClass].color, fontWeight: 'bold' }}>
                  {ex.highlight}
                </span>
                {ex.rest}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
