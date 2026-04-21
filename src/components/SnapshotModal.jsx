import React from 'react';
import { Camera, Clock, X, Download } from 'lucide-react';

// Gera um hash curto baseado no timestamp + conteúdo
function generateHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(6, '0');
}

// Formata timestamp para nome de arquivo com segundos
function formatTimestamp(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `${date}-${time}`;
}

function downloadSnapshot(snap, noteTitle) {
  const ts = formatTimestamp(snap.timestamp);
  const hash = generateHash(snap.content + snap.timestamp);
  const safeTitle = (noteTitle || 'vereda').replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 20);
  const filename = `${safeTitle}-${ts}-${hash}.json`;

  const payload = {
    vereda_version: '2.0',
    title: noteTitle,
    snapshot_at: new Date(snap.timestamp).toISOString(),
    words: snap.words,
    hash,
    content: snap.content,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadCurrentNote(currentNote) {
  const ts = formatTimestamp(Date.now());
  const hash = generateHash((currentNote.content || '') + Date.now());
  const safeTitle = (currentNote.title || 'vereda').replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 20);
  const filename = `${safeTitle}-${ts}-${hash}.json`;

  const payload = {
    vereda_version: '2.0',
    title: currentNote.title,
    exported_at: new Date().toISOString(),
    words: (currentNote.content || '').trim().split(/\s+/).filter(w => w).length,
    hash,
    content: currentNote.content || '',
    bookPages: currentNote.bookPages || {},
    humanScore: currentNote.humanScore || 0,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function SnapshotModal({ isOpen, onClose, currentNote, onCreateSnapshot, onRestoreSnapshot }) {
  if (!isOpen || !currentNote) return null;

  const snapshots = currentNote.snapshots || [];

  const handleRestore = (snapshotId) => {
    if (window.confirm('ATENÇÃO: Restaurar uma versão antiga substituirá completamente o texto atual na sua tela. Deseja continuar?')) {
      onRestoreSnapshot(currentNote.id, snapshotId);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content snapshot-modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <Clock size={24} className="accent-icon" />
          <h2>Máquina do Tempo</h2>
        </div>
        
        <div className="snapshot-actions">
          <p>Salve uma versão segura do seu texto antes de fazer grandes edições ou cortes.</p>
          <div className="snapshot-action-btns">
            <button className="btn" onClick={() => onCreateSnapshot(currentNote.id)}>
              <Camera size={18} />
              Capturar Versão Atual
            </button>
            <button
              className="btn btn-outline"
              onClick={() => downloadCurrentNote(currentNote)}
              data-tooltip="Baixar nota atual como arquivo .json"
            >
              <Download size={18} />
              Baixar Nota Atual
            </button>
          </div>
        </div>

        <div className="snapshot-list">
          <h3>Histórico de Versões</h3>
          {snapshots.length === 0 ? (
            <p className="empty-msg">Nenhum snapshot salvo ainda.</p>
          ) : (
            snapshots.map(snap => (
              <div key={snap.id} className="snapshot-item">
                <div className="snapshot-info">
                  <span className="snapshot-date">
                    {new Date(snap.timestamp).toLocaleDateString()} às {new Date(snap.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                  </span>
                  <span className="snapshot-words">{snap.words} palavras</span>
                </div>
                <div className="snapshot-item-actions">
                  <button
                    className="snapshot-dl-btn"
                    onClick={() => downloadSnapshot(snap, currentNote.title)}
                    title="Baixar esta versão"
                  >
                    <Download size={14} />
                  </button>
                  <button className="outline-btn restore-btn" onClick={() => handleRestore(snap.id)}>
                    Restaurar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
