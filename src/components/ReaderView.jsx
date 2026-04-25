import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function ReaderView({ title, content, onClose, isDark }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showRuler, setShowRuler] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        if (scrollRef.current) {
          // Speed mapping: 1 -> 0.4px, 5 -> 2.0px per frame
          scrollRef.current.scrollTop += (speed * 0.4);
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col bg-background dark:bg-stone-900 transition-colors duration-500`}>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 h-16 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm border-b border-stone-100 dark:border-stone-800">
        <button 
          onClick={onClose}
          className="text-primary dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors p-2 -ml-2 rounded-full focus:outline-none"
        >
          <span className="material-symbols-outlined block">close</span>
        </button>
        <div className="font-display-lg italic text-primary dark:text-emerald-500 text-lg tracking-wide">
          Vereda
        </div>
        <button className="text-primary dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors p-2 -mr-2 rounded-full focus:outline-none">
          <span className="material-symbols-outlined block">more_horiz</span>
        </button>
      </header>

      {/* Canvas Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-[160px] pb-[200px] px-gutter relative z-0 hide-scrollbar"
      >
        <article className="max-w-container-max-width mx-auto">
          <h1 className="font-display-lg text-display-lg text-center text-on-surface dark:text-stone-100 mb-margin-focus max-w-2xl mx-auto leading-tight italic">
            {title || 'Sem Título'}
          </h1>
          <div className="font-body-reading space-y-8 text-on-surface-variant dark:text-stone-300 relative z-10" style={{ fontSize: `${fontSize}px` }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      {/* Reading Ruler Overlay */}
      {showRuler && (
        <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-center">
          <div className="flex-grow bg-white/60 dark:bg-stone-900/60 backdrop-blur-[2px]"></div>
          <div className="h-[140px] bg-transparent relative border-y border-outline-variant/30 dark:border-stone-700/50 shadow-[0_0_40px_rgba(0,0,0,0.01)_inset]">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-primary/5 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-primary/5 to-transparent"></div>
          </div>
          <div className="flex-grow bg-white/60 dark:bg-stone-900/60 backdrop-blur-[2px]"></div>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center pb-8 pointer-events-auto">
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-full shadow-2xl border border-stone-200 dark:border-stone-800 p-2 flex items-center gap-2 w-fit mx-auto animate-in slide-in-from-bottom-8 duration-500">
          {/* Play/Pause */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`rounded-full px-6 py-2.5 flex items-center gap-2 transition-all font-label-caps text-label-caps uppercase tracking-widest focus:outline-none ${
              isPlaying 
                ? 'bg-primary dark:bg-emerald-500 text-white dark:text-stone-950' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className={`material-symbols-outlined ${isPlaying ? 'fill-icon' : ''}`}>
              {isPlaying ? 'pause_circle' : 'play_circle'}
            </span>
            <span>{isPlaying ? 'Pausar' : 'Play'}</span>
          </button>

          {/* Speed */}
          <button 
            onClick={() => setSpeed(s => (s % 5) + 1)}
            className="text-stone-500 dark:text-stone-400 px-6 py-2.5 flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all font-label-caps text-label-caps uppercase tracking-widest rounded-full focus:outline-none"
          >
            <span className="material-symbols-outlined">speed</span>
            <span>{speed}x</span>
          </button>

          {/* Ruler Toggle */}
          <button 
            onClick={() => setShowRuler(!showRuler)}
            className={`px-6 py-2.5 flex items-center gap-2 transition-all font-label-caps text-label-caps uppercase tracking-widest rounded-full focus:outline-none ${
              showRuler 
                ? 'text-primary dark:text-emerald-400' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className={`material-symbols-outlined ${showRuler ? 'fill-icon' : ''}`}>
              {showRuler ? 'visibility' : 'visibility_off'}
            </span>
            <span>Régua</span>
          </button>
          
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 mx-1"></div>
          
          {/* Font Size Toggle */}
          <button 
            onClick={() => setFontSize(f => f < 32 ? f + 4 : 16)}
            className="text-stone-500 dark:text-stone-400 px-6 py-2.5 flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all font-label-caps text-label-caps uppercase tracking-widest rounded-full focus:outline-none"
          >
            <span className="material-symbols-outlined">text_fields</span>
            <span>{fontSize}px</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
