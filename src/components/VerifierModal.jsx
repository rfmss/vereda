import React, { useState } from 'react';
import { generateHash } from '../crypto';

export function VerifierModal({ onClose }) {
  const [txtFile, setTxtFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!txtFile || !jsonFile) return;

    try {
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
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Verificador PoHW</h2>
          <button className="icon-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Faça o upload de um documento de texto gerado e sua respectiva prova criptográfica (.proof.json) para verificar a autoria e integridade do arquivo.</p>
          
          <div className="file-inputs">
            <label className="file-label">
              <span>Documento (.txt)</span>
              <input type="file" accept=".txt" onChange={e => setTxtFile(e.target.files[0])} />
            </label>
            <label className="file-label">
              <span>Prova Digital (.json)</span>
              <input type="file" accept=".json" onChange={e => setJsonFile(e.target.files[0])} />
            </label>
          </div>

          <button className="btn verify-btn" onClick={handleVerify} disabled={!txtFile || !jsonFile}>
            Verificar Autenticidade
          </button>

          {result && (
            <div className={`verification-result ${result.valid ? 'success' : 'error'}`}>
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
