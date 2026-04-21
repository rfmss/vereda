import React, { useState, useCallback } from 'react';

/**
 * BookTemplate — Páginas reais de miolo de livro, editáveis, para impressão.
 * Cada seção é um campo editável. O "ghost" some quando o usuário clica e digita.
 */

const BOOK_SECTIONS = [
  {
    id: 'folha-rosto',
    type: 'title-page',
    label: 'Folha de Rosto',
    fields: [
      { key: 'author', placeholder: 'Nome do Autor', style: 'author', defaultValue: '' },
      { key: 'title', placeholder: 'Título da Obra', style: 'main-title', defaultValue: '' },
      { key: 'subtitle', placeholder: 'Subtítulo (opcional)', style: 'subtitle', defaultValue: '' },
      { key: 'publisher', placeholder: 'Editora ou Publicação Independente', style: 'publisher', defaultValue: '' },
      { key: 'year', placeholder: new Date().getFullYear().toString(), style: 'year', defaultValue: '' },
    ]
  },
  {
    id: 'dedicatoria',
    type: 'simple',
    label: 'Dedicatória',
    fields: [
      { key: 'text', placeholder: 'A alguém especial, por algo que só vocês sabem.', style: 'dedication', defaultValue: '', multiline: true, rows: 4 },
    ]
  },
  {
    id: 'epigrafe',
    type: 'simple',
    label: 'Epígrafe',
    fields: [
      { key: 'quote', placeholder: '"A frase que define o espírito do livro."', style: 'epigraph-quote', defaultValue: '', multiline: true, rows: 3 },
      { key: 'attribution', placeholder: '— Autor da Citação', style: 'epigraph-attr', defaultValue: '' },
    ]
  },
  {
    id: 'sumario',
    type: 'toc',
    label: 'Sumário',
    fields: [
      { key: 'chapters', placeholder: '', style: 'toc', defaultValue: 'Capítulo 1 — \nCapítulo 2 — \nCapítulo 3 — \n', multiline: true, rows: 8 },
    ]
  },
  {
    id: 'prefacio',
    type: 'simple',
    label: 'Prefácio',
    fields: [
      { key: 'text', placeholder: 'Escreva aqui o prefácio ou apresentação da obra...', style: 'body-text', defaultValue: '', multiline: true, rows: 12 },
    ]
  },
];

function BookPage({ section, values, onChange }) {
  const handleChange = (key, value) => {
    onChange(section.id, key, value);
  };

  return (
    <div className="book-page" data-section={section.id}>
      <div className="book-page-label">{section.label.toUpperCase()}</div>

      <div className={`book-page-content book-page-${section.type}`}>
        {section.fields.map(field => {
          const value = values[field.key] ?? '';
          const isEmpty = value.trim() === '';

          if (field.multiline) {
            return (
              <textarea
                key={field.key}
                className={`book-field book-field-${field.style} ${isEmpty ? 'is-ghost' : ''}`}
                placeholder={field.placeholder}
                value={value}
                rows={field.rows || 4}
                onChange={e => handleChange(field.key, e.target.value)}
                spellCheck="false"
              />
            );
          }

          return (
            <input
              key={field.key}
              type="text"
              className={`book-field book-field-${field.style} ${isEmpty ? 'is-ghost' : ''}`}
              placeholder={field.placeholder}
              value={value}
              onChange={e => handleChange(field.key, e.target.value)}
              spellCheck="false"
            />
          );
        })}
      </div>
    </div>
  );
}

export function BookTemplate({ bookPages = {}, onUpdatePages }) {
  const handleChange = useCallback((sectionId, fieldKey, value) => {
    const updated = {
      ...bookPages,
      [sectionId]: {
        ...(bookPages[sectionId] || {}),
        [fieldKey]: value,
      }
    };
    onUpdatePages(updated);
  }, [bookPages, onUpdatePages]);

  return (
    <div className="book-template-wrapper">
      <div className="book-template-intro">
        <span className="book-template-badge">📖 Template de Livro</span>
        <p>Preencha cada seção abaixo. O editor formata para impressão e PDF com quebras de página automáticas.</p>
      </div>

      {BOOK_SECTIONS.map(section => (
        <BookPage
          key={section.id}
          section={section}
          values={bookPages[section.id] || {}}
          onChange={handleChange}
        />
      ))}

      <div className="book-page book-page-body">
        <div className="book-page-label">TEXTO PRINCIPAL</div>
        <p className="book-body-hint">
          Use o editor de texto abaixo para escrever o corpo do livro — capítulos, cenas e partes.
          Insira <code>---</code> para criar quebras de página.
        </p>
      </div>
    </div>
  );
}
