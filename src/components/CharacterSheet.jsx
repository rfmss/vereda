import React, { useCallback } from 'react';

const SECTIONS = [
  {
    id: 'identity',
    title: 'Identidade',
    accent: '#d4845a',
    fields: [
      { key: 'name', label: 'Nome completo', placeholder: 'Como assina o próprio nome', type: 'text', wide: true },
      { key: 'nickname', label: 'Apelido / Como é chamado', placeholder: 'O que os outros dizem pelas costas', type: 'text' },
      { key: 'age', label: 'Idade', placeholder: '34', type: 'text', narrow: true },
      { key: 'origin', label: 'Origem', placeholder: 'Cidade, bairro, contexto social', type: 'text' },
    ],
  },
  {
    id: 'appearance',
    title: 'Aparência & Presença',
    accent: '#7a8fc4',
    fields: [
      { key: 'physical', label: 'Traços físicos marcantes', placeholder: 'O que você nota nos primeiros cinco segundos', type: 'textarea', rows: 2 },
      { key: 'voice', label: 'Voz & Forma de falar', placeholder: 'Ritmo, pausas, vocabulário específico, sotaque', type: 'text' },
      { key: 'movement', label: 'Corpo & Movimento', placeholder: 'Como ocupa o espaço, gestos, postura habitual', type: 'text' },
    ],
  },
  {
    id: 'psychology',
    title: 'Psicologia',
    accent: '#a78bfa',
    fields: [
      { key: 'desire', label: 'Desejo central', placeholder: 'O que quer mais que qualquer outra coisa no mundo', type: 'text' },
      { key: 'fear', label: 'Maior medo', placeholder: 'O que o paralisa. O que jamais admite em voz alta', type: 'text' },
      { key: 'contradiction', label: 'Contradição', placeholder: 'O que o torna humano e imperfeito. Sua falha trágica', type: 'text' },
      { key: 'secret', label: 'Segredo', placeholder: 'O que só o leitor sabe — ou que nem o personagem admite para si mesmo', type: 'textarea', rows: 2 },
    ],
  },
  {
    id: 'backstory',
    title: 'História & Formação',
    accent: '#34d399',
    fields: [
      { key: 'backstory', label: 'Backstory em 3 linhas', placeholder: 'Tudo que importou antes da história começar. O evento que o formou.', type: 'textarea', rows: 3 },
      { key: 'trauma', label: 'Trauma ou momento definidor', placeholder: 'A cena da infância que ele não conta para ninguém', type: 'text' },
    ],
  },
  {
    id: 'arc',
    title: 'Arco & Relações',
    accent: '#f59e0b',
    fields: [
      { key: 'arc_start', label: 'Como começa', placeholder: 'Estado emocional e crença no início da história', type: 'text' },
      { key: 'arc_end', label: 'Como termina (ou deveria)', placeholder: 'Transformação, queda ou ilusão mantida até o fim', type: 'text' },
      { key: 'relations', label: 'Relações principais', placeholder: 'Com protagonista, antagonista, aliados. Quem realmente o conhece?', type: 'textarea', rows: 3 },
    ],
  },
];

function SheetField({ field, value, onChange }) {
  const baseClass = `char-field ${!value || value.trim() === '' ? 'char-field--empty' : ''}`;
  const props = {
    className: baseClass,
    placeholder: field.placeholder,
    value: value || '',
    onChange: e => onChange(field.key, e.target.value),
    spellCheck: 'false',
  };

  return (
    <div className={`char-field-group ${field.wide ? 'char-field-group--wide' : ''} ${field.narrow ? 'char-field-group--narrow' : ''}`}>
      <label className="char-label">{field.label}</label>
      {field.type === 'textarea'
        ? <textarea {...props} rows={field.rows || 2} />
        : <input type="text" {...props} />
      }
    </div>
  );
}

export function CharacterSheet({ characterData = {}, onUpdateCharacter }) {
  const handleChange = useCallback((key, value) => {
    onUpdateCharacter({ ...characterData, [key]: value });
  }, [characterData, onUpdateCharacter]);

  return (
    <div className="character-sheet-wrapper">
      <div className="character-sheet-header">
        <span className="character-sheet-badge">👤 Ficha de Personagem</span>
        <p className="character-sheet-desc">
          Construa seu personagem por dentro. Cada campo é um raio-x da alma —
          não apenas aparência, mas o que o move, o que o quebra e o que ele jamais admite.
        </p>
      </div>

      <div className="character-sheet-body">
        {SECTIONS.map(section => (
          <div
            key={section.id}
            className="char-section"
            style={{ '--section-accent': section.accent }}
          >
            <div className="char-section-header">
              <div className="char-section-bar" />
              <h3 className="char-section-title">{section.title}</h3>
            </div>
            <div className="char-section-fields">
              {section.fields.map(field => (
                <SheetField
                  key={field.key}
                  field={field}
                  value={characterData[field.key] || ''}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
