import React from 'react';
import { Type, Moon, Sun, Coffee, AlignLeft, AlignJustify } from 'lucide-react';

export const ReaderSettings = ({ fontSize, setFontSize, theme, setTheme, isOpen, onClose }) => {
  if (!isOpen) return null;

  const themes = [
    { id: 'paper', name: 'Papel', icon: <Sun size={16} />, bg: '#fdfaf5', color: '#222' },
    { id: 'sepia', name: 'Sépia', icon: <Coffee size={16} />, bg: '#f4ecd8', color: '#5b4636' },
    { id: 'night', name: 'Noite', icon: <Moon size={16} />, bg: '#1c1c1a', color: '#dedede' },
  ];

  return (
    <div className="reader-settings-popover">
      <div className="settings-section">
        <label>Tamanho da Fonte</label>
        <div className="font-size-controls">
          <button onClick={() => setFontSize(Math.max(12, fontSize - 2))}><Type size={14} /></button>
          <span>{fontSize}px</span>
          <button onClick={() => setFontSize(Math.min(32, fontSize + 2))}><Type size={20} /></button>
        </div>
      </div>

      <div className="settings-section">
        <label>Tema</label>
        <div className="theme-selector">
          {themes.map((t) => (
            <button 
              key={t.id} 
              className={`theme-btn ${theme === t.id ? 'active' : ''}`}
              onClick={() => setTheme(t.id)}
              style={{ backgroundColor: t.bg, color: t.color }}
              data-tooltip={t.name}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      <button className="close-settings-btn" onClick={onClose}>Fechar</button>
    </div>
  );
};
