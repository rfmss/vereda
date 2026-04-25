/**
 * IndexedDB Manager para Vereda
 * Gerencia armazenamento de manuscritos e logs PoHW
 */

const DB_NAME = 'VeredaDB';
const DB_VERSION = 1;

const STORES = {
  MANUSCRIPTS: 'manuscripts',
  POHW_LOGS: 'pohw_logs',
  SESSIONS: 'sessions'
};

class VeredaDB {
  constructor() {
    this.db = null;
    this.request = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.request = indexedDB.open(DB_NAME, DB_VERSION);

      this.request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', this.request.error);
        reject(this.request.error);
      };

      this.request.onsuccess = () => {
        this.db = this.request.result;
        console.log('IndexedDB conectado com sucesso');
        resolve(this.db);
      };

      this.request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store de Manuscritos
        if (!db.objectStoreNames.contains(STORES.MANUSCRIPTS)) {
          const manuscriptStore = db.createObjectStore(STORES.MANUSCRIPTS, { keyPath: 'id' });
          manuscriptStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          manuscriptStore.createIndex('title', 'title', { unique: false });
        }

        // Store de Logs PoHW (grande volume)
        if (!db.objectStoreNames.contains(STORES.POHW_LOGS)) {
          const pohwStore = db.createObjectStore(STORES.POHW_LOGS, { keyPath: 'id', autoIncrement: true });
          pohwStore.createIndex('sessionId', 'sessionId', { unique: false });
          pohwStore.createIndex('timestamp', 'timestamp', { unique: false });
          pohwStore.createIndex('manuscriptId', 'manuscriptId', { unique: false });
        }

        // Store de Sessões
        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          const sessionStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
          sessionStore.createIndex('manuscriptId', 'manuscriptId', { unique: false });
          sessionStore.createIndex('startedAt', 'startedAt', { unique: false });
        }
      };
    });
  }

  // ── Manuscritos ──

  async saveManuscript(manuscript) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.MANUSCRIPTS, 'readwrite');
      const store = tx.objectStore(STORES.MANUSCRIPTS);
      
      manuscript.updatedAt = new Date().toISOString();
      
      const request = store.put(manuscript);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getManuscript(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.MANUSCRIPTS, 'readonly');
      const store = tx.objectStore(STORES.MANUSCRIPTS);
      
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllManuscripts() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.MANUSCRIPTS, 'readonly');
      const store = tx.objectStore(STORES.MANUSCRIPTS);
      
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteManuscript(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.MANUSCRIPTS, 'readwrite');
      const store = tx.objectStore(STORES.MANUSCRIPTS);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ── Logs PoHW ──

  async logPoHWEvent(eventData) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.POHW_LOGS, 'readwrite');
      const store = tx.objectStore(STORES.POHW_LOGS);
      
      const request = store.add(eventData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPoHWLogsBySession(sessionId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.POHW_LOGS, 'readonly');
      const store = tx.objectStore(STORES.POHW_LOGS);
      const index = store.index('sessionId');
      
      const request = index.getAll(sessionId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPoHWLogsByManuscript(manuscriptId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.POHW_LOGS, 'readonly');
      const store = tx.objectStore(STORES.POHW_LOGS);
      const index = store.index('manuscriptId');
      
      const request = index.getAll(manuscriptId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearPoHWLogs(sessionId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.POHW_LOGS, 'readwrite');
      const store = tx.objectStore(STORES.POHW_LOGS);
      const index = store.index('sessionId');
      
      const request = index.openCursor(sessionId);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // ── Sessões ──

  async createSession(session) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.SESSIONS, 'readwrite');
      const store = tx.objectStore(STORES.SESSIONS);
      
      const request = store.put(session);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSession(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.SESSIONS, 'readonly');
      const store = tx.objectStore(STORES.SESSIONS);
      
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSessionStatus(sessionId, status, endedAt = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await this.getSession(sessionId);
        if (session) {
          session.status = status;
          if (endedAt) session.endedAt = endedAt;
          
          const tx = this.db.transaction(STORES.SESSIONS, 'readwrite');
          const store = tx.objectStore(STORES.SESSIONS);
          const request = store.put(session);
          
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } else {
          reject(new Error('Sessão não encontrada'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async getActiveSessionsByManuscript(manuscriptId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.SESSIONS, 'readonly');
      const store = tx.objectStore(STORES.SESSIONS);
      const index = store.index('manuscriptId');
      
      const request = index.getAll(manuscriptId);
      
      request.onsuccess = () => {
        const sessions = request.result.filter(s => s.status === 'active');
        resolve(sessions);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Instância global
const veredaDB = new VeredaDB();
