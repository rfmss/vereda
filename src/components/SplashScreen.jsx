import React, { useState, useEffect } from 'react';

export function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 40) setStep(0);
    else if (progress < 80) setStep(1);
    else setStep(2);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-gutter animate-in fade-in duration-1000">
      <main className="w-full max-w-[580px] flex flex-col items-center">
        {/* Brand Indicator */}
        <div className="mb-12 text-primary flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl mb-2" style={{ fontVariationSettings: "'wght' 200" }}>history_edu</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-h1 text-2xl md:text-3xl text-primary text-center mb-16 max-w-[480px] leading-tight">
          Vereda está se preparando para te acompanhar em qualquer lugar.
        </h1>

        {/* Progress Section */}
        <div className="w-full flex flex-col gap-10 mb-16">
          {/* The Elegant Progress Bar */}
          <div className="w-full h-[3px] bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary dark:bg-emerald-500 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* The Checklist */}
          <div className="flex flex-col gap-5 px-8">
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 0 ? 'text-primary dark:text-emerald-500' : 'text-stone-300'}`}>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: step > 0 ? "'FILL' 1" : "'FILL' 0" }}>
                {step > 0 ? 'check_circle' : 'sync'}
              </span>
              <span className="font-body-ui text-sm">Sincronizando Dicionários</span>
            </div>
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 1 ? 'text-primary dark:text-emerald-500' : 'text-stone-300'}`}>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: step > 1 ? "'FILL' 1" : "'FILL' 0" }}>
                {step > 1 ? 'check_circle' : step === 1 ? 'sync' : 'radio_button_unchecked'}
              </span>
              <span className="font-body-ui text-sm">Baixando Templates</span>
            </div>
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 2 ? 'text-primary dark:text-emerald-500' : 'text-stone-300'}`}>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: step > 2 ? "'FILL' 1" : "'FILL' 0" }}>
                {step > 2 ? 'check_circle' : step === 2 ? 'sync' : 'radio_button_unchecked'}
              </span>
              <span className="font-body-ui text-sm">Configurando Motor de Análise</span>
            </div>
          </div>
        </div>

        {/* Offline Highlight Card */}
        <div className="w-full bg-[#F6F3F2] dark:bg-stone-900 rounded-2xl p-6 flex items-start gap-5 border border-stone-200 dark:border-stone-800 shadow-sm animate-in slide-in-from-bottom duration-1000 delay-500">
          <div className="text-secondary dark:text-orange-400 mt-1">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>cloud_off</span>
          </div>
          <div className="flex flex-col">
            <p className="font-body-reading text-lg text-on-surface dark:text-stone-200 leading-relaxed italic">
              "Pode levar seu notebook para o bunker: o Vereda agora funciona 100% offline."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
