/**
 * Editor Inteligente - Vereda
 * Gerencia editor de texto com Modo Foco e integração PoHW
 */

class SmartEditor {
  constructor() {
    this.editorElement = null;
    this.toolbarElement = null;
    this.sidebarElement = null;
    this.panelRightElement = null;
    this.appElement = null;
    
    this.currentManuscriptId = null;
    this.isFocusMode = false;
    this.typingTimeout = null;
    this.FOCUS_DELAY = 2000; // ms para ativar modo foco automático
    this.autoSaveInterval = null;
    this.AUTO_SAVE_DELAY = 30000; // 30 segundos
    
    // Bound handlers
    this.handleInput = this.handleInput.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.toggleFocusMode = this.toggleFocusMode.bind(this);
    this.autoHideUI = this.autoHideUI.bind(this);
  }

  /**
   * Inicializa o editor
   */
  init() {
    // Elementos do DOM
    this.editorElement = document.querySelector('.editor-main');
    this.toolbarElement = document.querySelector('.editor-toolbar');
    this.sidebarElement = document.querySelector('.sidebar');
    this.panelRightElement = document.querySelector('.panel-right');
    this.appElement = document.querySelector('.app');

    if (!this.editorElement) {
      console.error('[Editor] Editor element not found');
      return;
    }

    // Event listeners
    this.editorElement.addEventListener('input', this.handleInput);
    this.editorElement.addEventListener('keydown', this.handleKeydown);

    // Botões da toolbar
    const focusBtn = document.querySelector('[data-action="focus-mode"]');
    if (focusBtn) {
      focusBtn.addEventListener('click', this.toggleFocusMode);
    }

    const exportBtn = document.querySelector('[data-action="export-proof"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportProof());
    }

    const tribunalBtn = document.querySelector('[data-action="tribunal"]');
    if (tribunalBtn) {
      tribunalBtn.addEventListener('click', () => this.openTribunal());
    }

    // Auto-hide UI após digitar
    this.setupAutoHide();

    // Inicia auto-save
    this.startAutoSave();

    console.log('[Editor] Inicializado');
  }

  /**
   * Carrega um manuscrito
   */
  async loadManuscript(id) {
    try {
      const manuscript = await veredaDB.getManuscript(id);
      
      if (manuscript) {
        this.currentManuscriptId = id;
        this.editorElement.innerHTML = manuscript.content || '';
        this.updateWordCount();
        
        // Inicia sessão PoHW
        if (pohwTracker && !pohwTracker.isActive) {
          await pohwTracker.startSession(id);
        }

        console.log(`[Editor] Manuscrito carregado: ${id}`);
        return manuscript;
      }
    } catch (error) {
      console.error('[Editor] Erro ao carregar manuscrito:', error);
    }
  }

  /**
   * Cria novo manuscrito
   */
  async createManuscript(title = 'Sem Título') {
    const manuscript = {
      id: `ms_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: title,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 0,
      charCount: 0
    };

    await veredaDB.saveManuscript(manuscript);
    await this.loadManuscript(manuscript.id);
    
    console.log(`[Editor] Novo manuscrito criado: ${manuscript.id}`);
    return manuscript;
  }

  /**
   * Salva manuscrito atual
   */
  async saveManuscript() {
    if (!this.currentManuscriptId) return;

    const content = this.editorElement.innerHTML;
    const textContent = this.editorElement.innerText;
    
    const manuscript = {
      id: this.currentManuscriptId,
      title: manuscript?.title || 'Sem Título',
      content: content,
      wordCount: textContent.split(/\s+/).filter(w => w.length > 0).length,
      charCount: textContent.length
    };

    await veredaDB.saveManuscript(manuscript);
    this.updateWordCount();
    
    console.log('[Editor] Manuscrito salvo');
  }

  /**
   * Handler de input no editor
   */
  handleInput() {
    // Reseta timer de auto-hide
    this.resetAutoHideTimer();
    
    // Atualiza contador de palavras
    this.updateWordCount();
  }

  /**
   * Handler de keydown
   */
  handleKeydown(event) {
    // Ctrl+S para salvar
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.saveManuscript();
    }
  }

  /**
   * Configura auto-hide da UI
   */
  setupAutoHide() {
    this.resetAutoHideTimer();
  }

  resetAutoHideTimer() {
    // Mostra UI ao digitar
    this.showUI();

    clearTimeout(this.typingTimeout);
    
    // Esconde UI após período de inatividade
    this.typingTimeout = setTimeout(() => {
      if (!this.isFocusMode) {
        this.hideUI();
      }
    }, this.FOCUS_DELAY);
  }

  showUI() {
    if (this.isFocusMode) return;
    
    this.toolbarElement.classList.remove('hidden');
    this.sidebarElement.classList.remove('collapsed');
    this.panelRightElement.classList.remove('collapsed');
  }

  hideUI() {
    if (this.isFocusMode) return;
    
    this.toolbarElement.classList.add('hidden');
    this.sidebarElement.classList.add('collapsed');
    this.panelRightElement.classList.add('collapsed');
  }

  /**
   * Toggle Modo Foco
   */
  toggleFocusMode() {
    this.isFocusMode = !this.isFocusMode;
    
    if (this.isFocusMode) {
      this.appElement.classList.add('focus-mode');
    } else {
      this.appElement.classList.remove('focus-mode');
      this.showUI();
    }

    // Atualiza botão
    const focusBtn = document.querySelector('[data-action="focus-mode"]');
    if (focusBtn) {
      focusBtn.classList.toggle('active', this.isFocusMode);
    }

    console.log(`[Editor] Modo foco: ${this.isFocusMode ? 'ATIVO' : 'INATIVO'}`);
  }

  /**
   * Atualiza contador de palavras/caracteres
   */
  updateWordCount() {
    const text = this.editorElement.innerText;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;

    const wordCountEl = document.querySelector('[data-element="word-count"]');
    if (wordCountEl) {
      wordCountEl.textContent = `${words} palavras · ${chars} caracteres`;
    }
  }

  /**
   * Inicia auto-save periódico
   */
  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.saveManuscript();
    }, this.AUTO_SAVE_DELAY);
  }

  /**
   * Para auto-save
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Exporta prova de autoria
   */
  async exportProof() {
    if (!pohwTracker.isActive || !this.currentManuscriptId) {
      alert('Inicie uma sessão de escrita primeiro.');
      return;
    }

    const content = this.editorElement.innerText;
    const manuscript = await veredaDB.getManuscript(this.currentManuscriptId);
    
    const proofData = await pohwTracker.exportProof(content, manuscript?.title || 'Manuscrito');
    
    // Download do arquivo .proof.json
    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manuscript?.title || 'manuscrito'}_proof.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[Editor] Prova exportada com sucesso');
  }

  /**
   * Abre modal do Tribunal de Autoria
   */
  openTribunal() {
    const modal = document.getElementById('tribunal-modal');
    if (modal) {
      modal.classList.add('active');
      this.renderTribunalData();
    }
  }

  /**
   * Fecha modal do Tribunal
   */
  closeTribunal() {
    const modal = document.getElementById('tribunal-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /**
   * Renderiza dados no Tribunal
   */
  async renderTribunalData() {
    if (!this.currentManuscriptId) return;

    const logs = await veredaDB.getPoHWLogsByManuscript(this.currentManuscriptId);
    const sessions = await veredaDB.getActiveSessionsByManuscript(this.currentManuscriptId);
    
    const totalEvents = logs.length;
    const suspiciousEvents = logs.filter(l => !l.isOrganic || !l.isTrusted).length;
    const authenticityScore = totalEvents > 0 
      ? Math.round(((totalEvents - suspiciousEvents) / totalEvents) * 100 * 100) / 100
      : 100;

    // Atualiza badge
    const pohwBadge = document.querySelector('.pohw-badge');
    if (pohwBadge) {
      pohwBadge.innerHTML = `
        <span style="width:8px;height:8px;border-radius:50%;background:${authenticityScore >= 95 ? '#2A5E45' : '#8B0000'};"></span>
        AUTORIA HUMANA: ${authenticityScore}%
      `;
      
      if (authenticityScore < 95) {
        pohwBadge.classList.add('suspicious');
      } else {
        pohwBadge.classList.remove('suspicious');
      }
    }

    // Renderiza timeline
    this.renderPohwTimeline(logs);

    // Atualiza stats
    const statsEl = document.getElementById('tribunal-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-bottom:20px;">
          <div style="text-align:center;">
            <div style="font-size:24px; font-weight:700; color:var(--acento);">${totalEvents}</div>
            <div style="font-size:11px; color:var(--t4);">Eventos Totais</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:24px; font-weight:700; color:${suspiciousEvents > 0 ? '#8B0000' : 'var(--verde)'};">${suspiciousEvents}</div>
            <div style="font-size:11px; color:var(--t4);">Eventos Suspeitos</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:24px; font-weight:700; color:${authenticityScore >= 95 ? 'var(--verde)' : '#8B0000'};">${authenticityScore}%</div>
            <div style="font-size:11px; color:var(--t4);">Autenticidade</div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Renderiza timeline visual dos eventos PoHW
   */
  renderPohwTimeline(logs) {
    const timelineEl = document.getElementById('pohw-timeline');
    if (!timelineEl || logs.length === 0) return;

    timelineEl.innerHTML = '';

    const startTime = logs[0].timestamp;
    const endTime = logs[logs.length - 1].timestamp;
    const totalTime = endTime - startTime;

    logs.forEach((log, index) => {
      const position = ((log.timestamp - startTime) / totalTime) * 100;
      const isSuspicious = !log.isOrganic || !log.isTrusted;
      
      const eventEl = document.createElement('div');
      eventEl.className = `pohw-event${isSuspicious ? ' suspicious' : ''}`;
      eventEl.style.left = `${position}%`;
      eventEl.style.width = '2px';
      eventEl.title = `${log.eventType} - ${isSuspicious ? 'Suspeito' : 'Orgânico'} (${log.interval}ms)`;
      
      timelineEl.appendChild(eventEl);
    });
  }
}

// Instância global
const smartEditor = new SmartEditor();
