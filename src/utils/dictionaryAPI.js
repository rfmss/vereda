// src/utils/dictionaryAPI.js
const CACHE_KEY_PREFIX = 'vereda_dict_';

export const fetchDefinition = async (word) => {
  if (!word || word.trim().length === 0) return null;
  const cleanWord = word.trim().toLowerCase().replace(/[.,!?;:"()[\]]/g, '');
  if (!cleanWord) return null;

  // 1. Check offline cache
  const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${cleanWord}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // invalid cache, proceed to fetch
    }
  }

  // 2. Fetch from API
  try {
    const response = await fetch(`https://api.dicionario-aberto.net/word/${cleanWord}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data || data.length === 0) return null;

    // 3. Parse XML definition
    const xmlString = data[0].xml;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const defNodes = xmlDoc.getElementsByTagName('def');
    let definitions = [];
    
    for (let i = 0; i < defNodes.length; i++) {
      let text = defNodes[i].textContent.trim();
      // Clean up markdown-like underscores from XML
      text = text.replace(/_([^_]+)_/g, '$1'); 
      if (text) {
        definitions.push(text.split('\n')[0]); // Take first line of each def block for simplicity
      }
    }

    if (definitions.length === 0) return null;

    const result = {
      word: cleanWord,
      definition: definitions.join(' • ')
    };

    // 4. Save to offline cache
    try {
      localStorage.setItem(`${CACHE_KEY_PREFIX}${cleanWord}`, JSON.stringify(result));
    } catch (e) {
      console.warn("Dictionary cache full", e);
    }

    return result;

  } catch (error) {
    console.error("Dictionary fetch error:", error);
    return null;
  }
};
