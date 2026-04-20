import React, { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef(null);
  const [variant, setVariant] = useState('default'); // 'default', 'pointer', 'text'

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        // Atualiza a posição via ref para não causar re-renders e garantir zero lag
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Checa se está sobre um botão, link ou algo clicável
      const isPointer = 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('button') ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('a') ||
        target.classList.contains('note-item') ||
        target.classList.contains('grammar-token'); // Palavras clicáveis
        
      // Checa se está sobre entrada de texto
      const isText = 
        target.tagName.toLowerCase() === 'textarea' ||
        target.tagName.toLowerCase() === 'input' ||
        target.isContentEditable;

      if (isText) {
        setVariant('text');
      } else if (isPointer) {
        setVariant('pointer');
      } else {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor cursor-${variant}`}
    />
  );
}
