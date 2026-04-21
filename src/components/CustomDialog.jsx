import React from 'react';

export function CustomDialog({ isOpen, title, message, type, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal dialog-modal">
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
          </div>
        )}
        <div className="modal-body dialog-body">
          <p className="dialog-message">{message}</p>
          <div className="dialog-actions">
            {type === 'confirm' && (
              <button className="btn outline-btn" onClick={onCancel}>
                Cancelar
              </button>
            )}
            <button 
              className={`btn ${type === 'confirm' ? 'confirm-btn' : 'primary-btn'}`} 
              onClick={onConfirm}
              autoFocus
            >
              {type === 'confirm' ? 'Confirmar' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
