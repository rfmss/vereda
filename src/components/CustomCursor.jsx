import React, { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef(null);
  const [variant, setVariant] = useState('default'); // 'default', 'pointer', 'text'

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      // Detecção de Proximidade Magnética (Sidebar Handle)
      const handle = document.querySelector('.sidebar-edge-trigger');
      if (handle) {
        const rect = handle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (distance < 60) {
          setVariant('pause');
          // Adiciona uma classe de magnetismo ao handle para efeito visual no CSS
          handle.classList.add('magnetic-active');
        } else {
          handle.classList.remove('magnetic-active');
          // Se não estiver perto do handle, segue a lógica normal de mouseover
          checkVariant(e.target);
        }
      }
    };

    const checkVariant = (target) => {
      if (!target) return;
      
      const isPointer = 
        target.tagName?.toLowerCase() === 'button' ||
        target.closest('button') ||
        target.tagName?.toLowerCase() === 'a' ||
        target.closest('a') ||
        target.classList.contains('note-item') ||
        target.classList.contains('grammar-token');
        
      const isText = 
        target.tagName?.toLowerCase() === 'textarea' ||
        target.tagName?.toLowerCase() === 'input' ||
        target.isContentEditable;

      if (isText) setVariant('text');
      else if (isPointer) setVariant('pointer');
      else setVariant('default');
    };

    const handleMouseOver = (e) => {
      // A lógica de variante agora é centralizada no checkVariant
      // exceto quando a proximidade do pause tem prioridade
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
