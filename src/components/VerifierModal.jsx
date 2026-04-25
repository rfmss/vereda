import React, { useState } from 'react';
import { generateHash } from '../crypto';

export function VerifierModal({ onClose }) {
  const [txtFile, setTxtFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!txtFile || !jsonFile) return;
    setIsVerifying(true);

    try {
      // Simulate a bit of process for dramatic effect
      await new Promise(r => setTimeout(r, 1500));

      const txtText = await txtFile.text();
      const jsonText = await jsonFile.text();
      const proofData = JSON.parse(jsonText);

      const payload = JSON.stringify({
        title: proofData.title,
        text: txtText,
        eventLog: proofData.eventLog,
        timestamp: proofData.timestamp
      });

      const calculatedHash = await generateHash(payload);
      
      if (calculatedHash === proofData.signature) {
        setResult({ valid: true, message: 'Assinatura válida! O documento foi gerado organicamente e não foi adulterado.' });
      } else {
        setResult({ valid: false, message: 'Assinatura INVÁLIDA! O documento ou a prova criptográfica foram corrompidos ou falsificados.' });
      }
    } catch (e) {
      setResult({ valid: false, message: 'Erro ao ler os arquivos. Certifique-se de enviar os formatos corretos (.txt e .json).' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col overflow-y-auto animate-in fade-in duration-500">
      {/* Top Bar for Modal */}
      <nav className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto bg-[#F2EFE9] dark:bg-stone-900 border-b border-[#2E4D43]/10 dark:border-white/5 shrink-0">
        <div className="text-2xl font-serif italic text-[#2E4D43] dark:text-emerald-500 tracking-tight">Vereda</div>
        <button 
          onClick={onClose}
          className="hover:bg-[#E8E4DB] dark:hover:bg-stone-800 transition-colors p-2 rounded-full text-[#2E4D43] dark:text-emerald-500"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </nav>

      <main className="flex-1 flex flex-col p-gutter lg:p-margin-focus w-full">
        <div className="max-w-[1024px] mx-auto w-full space-y-12">
          {/* Page Header */}
          <header className="text-center md:text-left border-b border-outline-variant/30 pb-8">
            <div className="inline-flex items-center gap-2 mb-4 text-secondary">
              <span className="material-symbols-outlined text-xl">gavel</span>
              <span className="font-label-caps text-xs uppercase tracking-widest font-bold">Tribunal de Autoria</span>
            </div>
            <h1 className="font-display-lg text-5xl font-bold text-primary mb-4">Cartório Digital Vereda</h1>
            <p className="font-body-reading text-xl text-on-surface-variant max-w-2xl">
              Apresente os artefatos de sua jornada literária para validação solene. 
              Para autores, o selo de autenticidade. Para editores, a garantia técnica de autoria humana.
            </p>
          </header>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Action Area */}
            <div className="lg:col-span-8 bg-white dark:bg-stone-950 rounded-2xl p-8 border border-outline-variant relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="text-center mb-8 relative z-10">
                <h2 className="font-h2 text-2xl font-bold text-primary mb-2">Protocolo de Verificação</h2>
                <p className="font-body-ui text-on-surface-variant">Deposite os manuscritos e provas de esforço para auditoria de autoria.</p>
              </div>

              {/* Drop Targets Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* File 1: Manuscript */}
                <label className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-48 ${txtFile ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low'}`}>
                  <input type="file" accept=".txt" className="hidden" onChange={e => setTxtFile(e.target.files[0])} />
                  <span className={`material-symbols-outlined text-4xl mb-4 ${txtFile ? 'text-primary' : 'text-outline group-hover:text-primary'}`}>description</span>
                  <span className="font-h2 text-primary mb-1 text-lg font-bold">{txtFile ? 'Manuscrito Pronto' : 'Manuscrito Original'}</span>
                  <span className="font-helper-text text-xs text-on-surface-variant truncate max-w-full px-4">
                    {txtFile ? txtFile.name : 'Formato .txt aceito'}
                  </span>
                </label>

                {/* File 2: Proof JSON */}
                <label className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-48 ${jsonFile ? 'border-secondary bg-secondary/5' : 'border-outline-variant bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low'}`}>
                  <input type="file" accept=".json" className="hidden" onChange={e => setJsonFile(e.target.files[0])} />
                  <span className={`material-symbols-outlined text-4xl mb-4 ${jsonFile ? 'text-secondary' : 'text-outline group-hover:text-secondary'}`}>receipt_long</span>
                  <span className="font-h2 text-primary mb-1 text-lg font-bold">{jsonFile ? 'Prova Pronta' : 'Prova de Eventos'}</span>
                  <span className="font-helper-text text-xs text-on-surface-variant truncate max-w-full px-4">
                    {jsonFile ? jsonFile.name : 'Arquivo .proof.json'}
                  </span>
                </label>

                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-outline-variant"></div>
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-stone-900 w-8 h-8 rounded-full border border-outline-variant items-center justify-center text-outline-variant text-xs font-bold">
                  +
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <aside className="lg:col-span-4 bg-surface-container-low dark:bg-stone-900 rounded-2xl p-6 border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-primary">security</span>
                <h3 className="font-h2 text-xl font-bold text-primary">Selo de Autoria Humana</h3>
              </div>
              <div className="space-y-4 font-body-ui text-sm text-on-surface">
                <p>O <strong>Cartório Digital</strong> é o elo de confiança entre quem escreve e quem publica, assegurando a integridade criativa.</p>
                <p>Para editores, funciona como um filtro de <strong>Talento Verificado</strong>, garantindo autoria humana via assinatura <span className="font-mono text-xs bg-surface-variant px-1 py-0.5 rounded">SHA-256</span>.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                    <span>Protege a originalidade do autor contra plágio algorítmico.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                    <span>Certifica o esforço real via <em>Proof of Human Work</em>.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Action Area */}
          <div className="pt-8 flex flex-col items-center gap-4 border-t border-outline-variant/30">
            <button 
              onClick={handleVerify}
              disabled={!txtFile || !jsonFile || isVerifying}
              className={`bg-primary text-on-primary font-label-caps text-xs uppercase tracking-widest px-12 py-5 rounded-full shadow-lg transition-all duration-300 flex items-center gap-3 group ${(!txtFile || !jsonFile || isVerifying) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-container hover:shadow-xl active:scale-95'}`}
            >
              <span className={`material-symbols-outlined group-hover:scale-110 transition-transform ${isVerifying ? 'animate-spin' : ''}`}>
                {isVerifying ? 'progress_activity' : 'verified'}
              </span>
              {isVerifying ? 'Validando...' : 'Validar Certificado'}
            </button>
            <span className="font-helper-text text-xs text-stone-400">
              {!txtFile || !jsonFile ? 'Aguardando artefatos para certificação...' : 'Artefatos prontos para validação solene.'}
            </span>

            {result && (
              <div className={`mt-8 p-6 rounded-2xl border-2 w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-500 ${result.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'}`}>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-2xl">
                    {result.valid ? 'verified_user' : 'gavel'}
                  </span>
                  <div>
                    <h4 className="font-bold mb-1">{result.valid ? 'Certificado Autêntico' : 'Falha na Validação'}</h4>
                    <p className="text-sm leading-relaxed opacity-90">{result.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
