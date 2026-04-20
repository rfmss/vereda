import React from 'react';
import { Camera, Clock, X } from 'lucide-react';

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
          <button className="btn" onClick={() => onCreateSnapshot(currentNote.id)}>
            <Camera size={18} />
            Capturar Versão Atual
          </button>
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
                    {new Date(snap.timestamp).toLocaleDateString()} às {new Date(snap.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="snapshot-words">{snap.words} palavras</span>
                </div>
                <button className="outline-btn restore-btn" onClick={() => handleRestore(snap.id)}>
                  Restaurar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
