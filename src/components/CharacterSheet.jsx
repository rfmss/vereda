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
  const props = {
    className: "w-full bg-stone-50 dark:bg-stone-900 border-0 border-b border-stone-200 dark:border-stone-800 focus:border-primary dark:focus:border-emerald-500 focus:ring-0 font-body-reading text-sm text-on-surface py-2 px-0 placeholder:text-stone-300 dark:placeholder:text-stone-700 transition-all",
    placeholder: field.placeholder,
    value: value || '',
    onChange: e => onChange(field.key, e.target.value),
    spellCheck: 'false',
  };

  return (
    <div className={`flex flex-col gap-1 ${field.wide ? 'md:col-span-2' : field.narrow ? 'md:col-span-1/2' : ''}`}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-primary transition-colors">
        {field.label}
      </label>
      {field.type === 'textarea'
        ? <textarea {...props} rows={field.rows || 2} className={`${props.className} resize-none`} />
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
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-16">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
            Ficha de Personagem
          </span>
        </div>
        <p className="font-body-reading text-lg italic text-on-surface-variant leading-relaxed max-w-2xl">
          Construa seu personagem por dentro. Cada campo é um raio-x da alma — 
          não apenas aparência, mas o que o move, o que o quebra e o que ele jamais admite.
        </p>
      </div>

      <div className="space-y-20">
        {SECTIONS.map(section => (
          <div key={section.id} className="group">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
              <h3 className="font-display-lg text-xl italic text-primary dark:text-emerald-500 whitespace-nowrap px-4 border-l-4 border-primary dark:border-emerald-500">
                {section.title}
              </h3>
              <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
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
      
      <div className="pt-20 border-t border-stone-100 dark:border-stone-900 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">Vereda • Edição Literária</p>
      </div>
    </div>
  );
}
