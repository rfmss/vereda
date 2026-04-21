import { useEffect, useState, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { WifiOff, CheckCircle2, Loader, HardDrive } from 'lucide-react';

// ─── Tamanho total do app shell (do build: 966.23 KiB) ───────────────────────
// Atualizar aqui se o bundle crescer significativamente.
const TOTAL_BYTES = 966 * 1024;
const TOTAL_MB    = (TOTAL_BYTES / (1024 * 1024)).toFixed(1); // "0.9"

// ─── Mensagens motivacionais estilo GloboPlay ────────────────────────────────
const MESSAGES = [
  "Depois disso, escreva sem internet — até num bunker.",
  "Seu escritório vai onde você for. Online ou não.",
  "Vale cada segundo. A recompensa é permanente.",
  "Como um livro de papel: funciona em qualquer lugar.",
  "Sem sinal? Sem problema. O Vereda vai estar lá.",
  "Seus textos ficam aqui, só seus. Nenhuma nuvem.",
  "Uma biblioteca inteira no seu navegador, offline.",
  "Preparando o espaço para as suas palavras…",
  "Sua escrita merece funcionar até no fim do mundo.",
  "Quase lá — a espera é curta; a liberdade, permanente.",
];

// ─── Utilitário: bytes reais do Cache Storage ─────────────────────────────────
// Lê os blobs de todas as entradas cacheadas e soma o tamanho.
// Chamado apenas quando offlineReady dispara (uma vez só).
async function getRealCacheBytes() {
  if (!('caches' in window)) return 0;
  let total = 0;
  try {
    const names = await caches.keys();
    for (const name of names) {
      const cache    = await caches.open(name);
      const requests = await cache.keys();
      for (const req of requests) {
        const res = await cache.match(req);
        if (res) {
          const blob = await res.clone().blob();
          total += blob.size;
        }
      }
    }
  } catch (_) { /* silencia erros de permissão */ }
  return total;
}

// ─── Formatação de bytes ──────────────────────────────────────────────────────
function fmtMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export function OfflineBanner() {
  const [progress,     setProgress]     = useState(0);
  const [phase,        setPhase]        = useState('checking');
  // 'checking' | 'installing' | 'ready' | 'dismissed'
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);
  const [msgIndex,     setMsgIndex]     = useState(0);
  const [msgVisible,   setMsgVisible]   = useState(true);
  const [realMB,       setRealMB]       = useState(null); // MB real após ready
  const [forceReady,   setForceReady]   = useState(false); // Fallback caso offlineReady falhe

  const animRef       = useRef(null);
  const dismissTimer  = useRef(null);
  const msgTimer      = useRef(null);

  // ── Registro do SW ──────────────────────────────────────────────────────────
  const { offlineReady } = useRegisterSW({
    onRegistering() { setPhase('installing'); },
    onRegistered(reg) {
      if (reg?.installing) setPhase('installing');
    },
    onRegisterError(err) {
      console.warn('[SW]', err);
      setPhase('dismissed');
    },
  });

  // ── Online / Offline ────────────────────────────────────────────────────────
  useEffect(() => {
    const up   = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online',  up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online',  up);
      window.removeEventListener('offline', down);
    };
  }, []);

  // ── Avança de 'checking' para 'installing' após 1.5s ───────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase(p => p === 'checking' ? 'installing' : p);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // ── Animação da barra de progresso ─────────────────────────────────────────
  useEffect(() => {
    const isReady = offlineReady[0] || forceReady;

    if (isReady) {
      clearInterval(animRef.current);
      setProgress(100);
      setPhase('ready');

      // Calcular tamanho real em background
      getRealCacheBytes().then(bytes => {
        if (bytes > 0) setRealMB(fmtMB(bytes));
      });

      dismissTimer.current = setTimeout(() => setPhase('dismissed'), 7000);
      return () => clearTimeout(dismissTimer.current);
    }

    // Fallback: se estivermos em 85% por mais de 5 segundos, verificamos se já temos cache
    const fallbackTimer = setTimeout(async () => {
      if (phase === 'installing' && progress >= 85) {
        const names = await caches.keys();
        if (names.length > 0) {
           console.log("[PWA] Force-ready fallback triggered.");
           setForceReady(true);
        }
      }
    }, 6000);

    return () => {
      clearInterval(animRef.current);
      clearTimeout(fallbackTimer);
    };

    if (phase === 'dismissed') return;

    // Teto por fase: não chegamos a 100% sozinhos — esperamos offlineReady
    const ceiling = phase === 'checking' ? 22 : 85;

    clearInterval(animRef.current);
    animRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= ceiling) { clearInterval(animRef.current); return prev; }
        const delta = (ceiling - prev) * 0.055 + 0.35;
        return Math.min(prev + delta, ceiling);
      });
    }, 110);

    return () => clearInterval(animRef.current);
  }, [phase, offlineReady]);

  // ── Rotação de mensagens (a cada 4s, com fade) ─────────────────────────────
  useEffect(() => {
    if (phase === 'ready' || phase === 'dismissed') {
      clearInterval(msgTimer.current);
      return;
    }

    msgTimer.current = setInterval(() => {
      // Fade out → troca → fade in
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setMsgVisible(true);
      }, 350);
    }, 4000);

    return () => clearInterval(msgTimer.current);
  }, [phase]);

  // ─── Valores derivados ──────────────────────────────────────────────────────
  const isReady     = offlineReady[0];
  const currentMB   = fmtMB((progress / 100) * TOTAL_BYTES);
  const displayedMB = realMB ?? TOTAL_MB; // usa real quando disponível

  const showTrack = phase !== 'dismissed';
  const showPill  = phase !== 'dismissed' || !isOnline;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Fio de progresso colado no topo */}
      {showTrack && (
        <div
          className="sw-progress-track"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do cache offline"
        >
          <div
            className={`sw-progress-fill ${isReady ? 'ready' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Painel de status — top-right */}
      {showPill && (
        <div
          className={`sw-status-pill ${isReady ? 'ready' : ''} ${!isOnline ? 'offline-mode' : ''}`}
          aria-live="polite"
        >

          {/* ── Linha 1: ícone + status + tamanho ── */}
          <div className="sw-pill-row">
            {!isOnline ? (
              <WifiOff size={13} strokeWidth={2.5} />
            ) : isReady ? (
              <CheckCircle2 size={13} strokeWidth={2.5} />
            ) : (
              <Loader size={13} strokeWidth={2.5} className="sw-spin" />
            )}

            <span className="sw-pill-label">
              {!isOnline
                ? 'Modo offline ativo'
                : isReady
                  ? 'Pronto para o bunker'
                  : phase === 'checking'
                    ? 'Verificando cache…'
                    : 'Salvando offline…'}
            </span>

            {/* Tamanho em MB */}
            <span className="sw-pill-size">
              {!isOnline ? null : isReady ? (
                <>
                  <HardDrive size={11} strokeWidth={2} />
                  {displayedMB} MB
                </>
              ) : (
                <>{currentMB} <span className="sw-size-total">/ {TOTAL_MB} MB</span></>
              )}
            </span>
          </div>

          {/* ── Linha 2: mensagem motivacional (só durante install) ── */}
          {!isOnline && (
            <div className="sw-pill-msg">
              Seus textos continuam disponíveis — sem internet.
            </div>
          )}
          {isOnline && !isReady && (
            <div className={`sw-pill-msg ${msgVisible ? 'visible' : ''}`}>
              {MESSAGES[msgIndex]}
            </div>
          )}
          {isOnline && isReady && (
            <div className="sw-pill-msg visible sw-msg-ready">
              Desligue o wi-fi. O Vereda continua aqui. 🛡️
            </div>
          )}

          {/* Mini barra interna de progresso */}
          {isOnline && !isReady && (
            <div className="sw-inner-track">
              <div className="sw-inner-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

        </div>
      )}
    </>
  );
}
