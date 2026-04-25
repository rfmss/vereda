/**
 * PoHW - Proof of Writing (Prova de Autoria Humana)
 * Monitora cadência de digitação e gera certificação de autoria
 */

class PoHWTracker {
  constructor() {
    this.sessionId = null;
    this.manuscriptId = null;
    this.isActive = false;
    this.lastKeyTime = null;
    this.eventCount = 0;
    this.suspiciousCount = 0;
    this.totalEvents = 0;
    
    // Limites da Regra de Ouro (30ms - 2000ms)
    this.MIN_INTERVAL = 30;
    this.MAX_INTERVAL = 2000;
    
    // Buffer para batch de eventos (performance)
    this.eventBuffer = [];
    this.BUFFER_SIZE = 10;
    
    // Bound handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   * Inicia rastreamento de uma sessão de escrita
   */
  async startSession(manuscriptId) {
    this.manuscriptId = manuscriptId;
    this.sessionId = this.generateSessionId();
    this.isActive = true;
    this.lastKeyTime = null;
    this.eventCount = 0;
    this.suspiciousCount = 0;
    this.totalEvents = 0;
    this.eventBuffer = [];

    // Cria sessão no banco
    const session = {
      id: this.sessionId,
      manuscriptId: this.manuscriptId,
      startedAt: new Date().toISOString(),
      status: 'active',
      eventCount: 0,
      suspiciousCount: 0
    };

    await veredaDB.createSession(session);

    // Adiciona listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    console.log(`[PoHW] Sessão iniciada: ${this.sessionId}`);
    return this.sessionId;
  }

  /**
   * Finaliza sessão de rastreamento
   */
  async endSession() {
    if (!this.isActive) return;

    this.isActive = false;

    // Remove listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);

    // Flush buffer restante
    await this.flushBuffer();

    // Atualiza sessão
    await veredaDB.updateSessionStatus(
      this.sessionId,
      'completed',
      new Date().toISOString()
    );

    console.log(`[PoHW] Sessão finalizada: ${this.sessionId}`);
    console.log(`[PoHW] Total: ${this.totalEvents} eventos, ${this.suspiciousCount} suspeitos`);

    return {
      sessionId: this.sessionId,
      totalEvents: this.totalEvents,
      suspiciousCount: this.suspiciousCount,
      authenticityScore: this.calculateAuthenticityScore()
    };
  }

  /**
   * Handler de keydown - evento principal para PoHW
   */
  async handleKeyDown(event) {
    if (!this.isActive || !event.isTrusted) {
      // Evento não confiável (possível automação/IA)
      if (!event.isTrusted && this.isActive) {
        this.suspiciousCount++;
        console.warn('[PoHW] Evento não confiável detectado!');
      }
      return;
    }

    const currentTime = Date.now();
    let interval = 0;

    if (this.lastKeyTime !== null) {
      interval = currentTime - this.lastKeyTime;
    }

    this.lastKeyTime = currentTime;
    this.totalEvents++;

    // Verifica se está dentro da "Regra de Ouro"
    const isOrganic = interval === 0 || 
                      (interval >= this.MIN_INTERVAL && interval <= this.MAX_INTERVAL);

    if (!isOrganic && interval > 0) {
      this.suspiciousCount++;
    }

    // Cria evento PoHW
    const pohwEvent = {
      sessionId: this.sessionId,
      manuscriptId: this.manuscriptId,
      timestamp: currentTime,
      eventType: 'keydown',
      keyCode: event.code,
      key: event.key,
      interval: interval,
      isTrusted: event.isTrusted,
      isOrganic: isOrganic,
      modifiers: {
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        meta: event.metaKey
      }
    };

    // Adiciona ao buffer
    this.eventBuffer.push(pohwEvent);

    // Flush se buffer cheio
    if (this.eventBuffer.length >= this.BUFFER_SIZE) {
      await this.flushBuffer();
    }

    this.eventCount++;
  }

  /**
   * Handler de keyup - complementar para análise
   */
  async handleKeyUp(event) {
    if (!this.isActive || !event.isTrusted) return;

    const currentTime = Date.now();
    
    const pohwEvent = {
      sessionId: this.sessionId,
      manuscriptId: this.manuscriptId,
      timestamp: currentTime,
      eventType: 'keyup',
      keyCode: event.code,
      key: event.key,
      interval: 0,
      isTrusted: event.isTrusted,
      isOrganic: true,
      modifiers: {
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        meta: event.metaKey
      }
    };

    this.eventBuffer.push(pohwEvent);

    if (this.eventBuffer.length >= this.BUFFER_SIZE) {
      await this.flushBuffer();
    }
  }

  /**
   * Flush do buffer de eventos para IndexedDB
   */
  async flushBuffer() {
    if (this.eventBuffer.length === 0) return;

    try {
      // Salva eventos em batch
      for (const event of this.eventBuffer) {
        await veredaDB.logPoHWEvent(event);
      }
      
      // Atualiza contadores da sessão
      const session = await veredaDB.getSession(this.sessionId);
      if (session) {
        session.eventCount = this.totalEvents;
        session.suspiciousCount = this.suspiciousCount;
        await veredaDB.createSession(session);
      }

      this.eventBuffer = [];
    } catch (error) {
      console.error('[PoHW] Erro ao salvar buffer:', error);
    }
  }

  /**
   * Calcula score de autenticidade (0-100%)
   */
  calculateAuthenticityScore() {
    if (this.totalEvents === 0) return 100;
    
    const organicEvents = this.totalEvents - this.suspiciousCount;
    const score = (organicEvents / this.totalEvents) * 100;
    
    return Math.round(score * 100) / 100;
  }

  /**
   * Gera hash SHA-256 do conteúdo + logs
   */
  async generateProofHash(content) {
    const logs = await veredaDB.getPoHWLogsBySession(this.sessionId);
    
    // Cria string única combinando conteúdo e padrões de digitação
    const proofString = JSON.stringify({
      content: content,
      contentHash: await this.sha256(content),
      eventCount: logs.length,
      sessionId: this.sessionId,
      startedAt: logs[0]?.timestamp,
      endedAt: logs[logs.length - 1]?.timestamp,
      avgInterval: this.calculateAverageInterval(logs),
      suspiciousRatio: this.suspiciousCount / this.totalEvents
    });

    return await this.sha256(proofString);
  }

  /**
   * Calcula intervalo médio entre teclas
   */
  calculateAverageInterval(logs) {
    const keydownLogs = logs.filter(l => l.eventType === 'keydown' && l.interval > 0);
    if (keydownLogs.length === 0) return 0;

    const total = keydownLogs.reduce((sum, log) => sum + log.interval, 0);
    return Math.round(total / keydownLogs.length);
  }

  /**
   * Exporta prova de autoria como JSON
   */
  async exportProof(content, title = 'Manuscrito') {
    const logs = await veredaDB.getPoHWLogsBySession(this.sessionId);
    const hash = await this.generateProofHash(content);
    
    const proofData = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      manuscript: {
        title: title,
        contentHash: await this.sha256(content),
        wordCount: content.split(/\s+/).filter(w => w.length > 0).length
      },
      session: {
        id: this.sessionId,
        startedAt: logs[0]?.timestamp ? new Date(logs[0].timestamp).toISOString() : null,
        endedAt: logs[logs.length - 1]?.timestamp ? new Date(logs[logs.length - 1].timestamp).toISOString() : null,
        totalEvents: this.totalEvents,
        suspiciousEvents: this.suspiciousCount,
        authenticityScore: this.calculateAuthenticityScore()
      },
      metrics: {
        averageInterval: this.calculateAverageInterval(logs),
        minInterval: this.MIN_INTERVAL,
        maxInterval: this.MAX_INTERVAL
      },
      verification: {
        proofHash: hash,
        algorithm: 'SHA-256'
      },
      events: logs // Logs completos para auditoria
    };

    return proofData;
  }

  /**
   * Gera hash SHA-256 usando Web Crypto API
   */
  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Gera ID único para sessão
   */
  generateSessionId() {
    return `pohw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Valida integridade de uma prova exportada
   */
  static async verifyProof(proofData) {
    // Recalcula hash para validação
    const verificationString = JSON.stringify({
      contentHash: proofData.manuscript.contentHash,
      eventCount: proofData.events.length,
      sessionId: proofData.session.id,
      startedAt: proofData.session.startedAt,
      endedAt: proofData.session.endedAt,
      avgInterval: proofData.metrics.averageInterval,
      suspiciousRatio: proofData.session.suspiciousEvents / proofData.session.totalEvents
    });

    const recalculatedHash = await new PoHWTracker().sha256(verificationString);
    
    return {
      isValid: recalculatedHash === proofData.verification.proofHash,
      authenticityScore: proofData.session.authenticityScore,
      suspiciousRatio: proofData.session.suspiciousEvents / proofData.session.totalEvents
    };
  }
}

// Instância global
const pohwTracker = new PoHWTracker();
