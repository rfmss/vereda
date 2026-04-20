// Dicionário heurístico simples para classes gramaticais em Português
const dict = {
  artigo: new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas']),
  preposicao: new Set(['a', 'ante', 'após', 'ate', 'até', 'com', 'contra', 'de', 'desde', 'em', 'entre', 'para', 'perante', 'por', 'sem', 'sob', 'sobre', 'tras', 'trás', 'da', 'do', 'das', 'dos', 'na', 'no', 'nas', 'nos', 'pelo', 'pela', 'pelos', 'pelas', 'num', 'numa', 'nuns', 'numas', 'p/', 'c/', 'd/']),
  conjuncao: new Set(['e', 'nem', 'mas', 'porém', 'todavia', 'contudo', 'ou', 'logo', 'portanto', 'porque', 'que', 'se', 'embora', 'conforme', 'como', 'quando', 'pois', 'entretanto', 'embora', 'conquanto']),
  pronome: new Set(['eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas', 'me', 'te', 'se', 'nos', 'vos', 'mim', 'ti', 'si', 'comigo', 'contigo', 'consigo', 'conosco', 'convosco', 'meu', 'minha', 'teu', 'tua', 'seu', 'sua', 'nosso', 'nossa', 'este', 'esta', 'esse', 'essa', 'aquele', 'aquela', 'isso', 'isto', 'aquilo', 'quem', 'qual', 'quais', 'onde', 'tudo', 'nada', 'alguém', 'ninguém', 'algum', 'alguma', 'nenhum', 'nenhuma', 'outrem', 'cada', 'algo']),
  interjeicao: new Set(['ah', 'oh', 'ai', 'ui', 'epa', 'oba', 'nossa', 'viva', 'bravo', 'ola', 'olá', 'alo', 'alô', 'psiu', 'eita', 'uxa', 'caramba', 'poxa', 'credo', 'oxe', 'oxente', 'uai', 'nó']),
  numeral: new Set(['um', 'dois', 'tres', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'cem', 'mil', 'primeiro', 'segundo', 'terceiro', 'duplo', 'triplo', 'metade']),
  adverbio: new Set(['não', 'sim', 'talvez', 'aqui', 'ali', 'lá', 'hoje', 'amanhã', 'ontem', 'agora', 'já', 'sempre', 'nunca', 'jamais', 'muito', 'pouco', 'mais', 'menos', 'tão', 'bem', 'mal', 'assim', 'depois', 'antes', 'também', 'apenas', 'ainda', 'até', 'mesmo', 'bastante', 'quase'])
};

export function tagWord(word, prevWord = '', nextWord = '') {
  const w = word.toLowerCase();
  
  if (dict.artigo.has(w)) {
    if (w === 'um' && nextWord && (nextWord.match(/\d/) || ['quarto', 'terço'].includes(nextWord))) return 'numeral';
    return 'artigo';
  }
  if (dict.preposicao.has(w)) return 'preposicao';
  if (dict.conjuncao.has(w)) return 'conjuncao';
  if (dict.pronome.has(w)) return 'pronome';
  if (dict.interjeicao.has(w)) return 'interjeicao';
  if (dict.numeral.has(w) || !isNaN(parseInt(w))) return 'numeral';
  if (dict.adverbio.has(w)) return 'adverbio';

  if (w.endsWith('mente')) return 'adverbio';

  if (w.match(/(ar|er|ir|or|por)$/) || w.match(/(ando|endo|indo|ondo)$/)) return 'verbo';
  if (w.match(/(amos|emos|imos|aram|eram|iram|avam|ia|iam|arei|ará|arão|ou|eu|iu|ava|asse|esse|isse)$/)) return 'verbo';

  if (w.match(/(oso|osa|osos|osas|vel|ivo|iva|ivos|ivas|ico|ica|icos|icas)$/)) return 'adjetivo';
  if (w.match(/(ção|ções|dade|dades|mento|mentos|ez|eza|ismo|ista)$/)) return 'substantivo';

  if (prevWord && dict.artigo.has(prevWord.toLowerCase())) {
    return 'substantivo';
  }

  // Padrão de fallback heurístico
  if (w.endsWith('o') || w.endsWith('a') || w.endsWith('os') || w.endsWith('as') || w.endsWith('e') || w.endsWith('es')) {
    if (prevWord && (prevWord.endsWith('o') || prevWord.endsWith('a'))) return 'adjetivo'; 
    return 'substantivo';
  }

  return 'substantivo';
}

export function analyzeText(text) {
  const tokens = [];
  // Usa propriedades unicode para suportar á, ç, ã etc perfeitamente
  const regex = /([\p{L}\p{M}\d]+)|([^\p{L}\p{M}\d]+)/gu;
  let match;
  let wordsOnly = [];
  
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      wordsOnly.push({ word: match[1], index: tokens.length });
    }
    tokens.push({ text: match[0], isWord: !!match[1] });
  }

  wordsOnly.forEach((wObj, i) => {
    const prev = i > 0 ? wordsOnly[i-1].word : '';
    const next = i < wordsOnly.length - 1 ? wordsOnly[i+1].word : '';
    const tag = tagWord(wObj.word, prev, next);
    tokens[wObj.index].tag = tag;
  });

  return tokens;
}
