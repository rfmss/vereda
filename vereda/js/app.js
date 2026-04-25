/**
 * App Principal - Vereda
 * Inicialização e orquestração dos módulos
 */

class VeredaApp {
  constructor() {
    this.initialized = false;
    this.dailyGoal = 1000; // palavras por dia
    this.todayWritten = 0;
  }

  /**
   * Inicializa aplicação completa
   */
  async init() {
    console.log('[Vereda] Iniciando aplicação...');

    try {
      // Conecta ao IndexedDB
      await veredaDB.connect();
      
      // Inicializa editor
      smartEditor.init();
      
      // Carrega lista de manuscritos
      await this.loadManuscriptsList();
      
      // Configura listeners globais
      this.setupGlobalListeners();
      
      // Atualiza stats diários
      this.updateDailyGoal();
      
      // Inicia primeiro manuscrito se não existir
      const manuscripts = await veredaDB.getAllManuscripts();
      if (manuscripts.length === 0) {
        await smartEditor.createManuscript('Prólogo: A Vereda');
      } else {
        // Carrega o mais recente
        const latest = manuscripts.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
        await smartEditor.loadManuscript(latest.id);
      }

      this.initialized = true;
      console.log('[Vereda] Aplicação inicializada com sucesso!');
      
    } catch (error) {
      console.error('[Vereda] Erro na inicialização:', error);
    }
  }

  /**
   * Carrega lista de manuscritos na sidebar
   */
  async loadManuscriptsList() {
    try {
      const manuscripts = await veredaDB.getAllManuscripts();
      const listEl = document.getElementById('manuscripts-list');
      
      if (!listEl) return;
      
      listEl.innerHTML = '';
      
      manuscripts.forEach(ms => {
        const item = document.createElement('a');
        item.className = 'sb-item';
        item.href = '#';
        item.dataset.manuscript = ms.id;
        item.textContent = ms.title || 'Sem Título';
        
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchManuscript(ms.id);
        });
        
        listEl.appendChild(item);
      });
      
    } catch (error) {
      console.error('[App] Erro ao carregar lista:', error);
    }
  }

  /**
   * Troca manuscrito ativo
   */
  async switchManuscript(id) {
    // Finaliza sessão PoHW anterior
    if (pohwTracker.isActive) {
      await pohwTracker.endSession();
    }
    
    // Carrega novo manuscrito
    await smartEditor.loadManuscript(id);
    
    // Atualiza UI da sidebar
    document.querySelectorAll('.sb-item').forEach(item => {
      item.classList.toggle('active', item.dataset.manuscript === id);
    });
    
    // Atualiza lista
    await this.loadManuscriptsList();
  }

  /**
   * Configura listeners globais
   */
  setupGlobalListeners() {
    // Novo manuscrito
    const newBtn = document.querySelector('[data-manuscript="new"]');
    if (newBtn) {
      newBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const title = prompt('Título do manuscrito:', 'Novo Capítulo');
        if (title) {
          const ms = await smartEditor.createManuscript(title);
          await this.loadManuscriptsList();
          this.switchManuscript(ms.id);
        }
      });
    }

    // Clique no badge PoHW abre tribunal
    const pohwBadge = document.getElementById('pohw-badge');
    if (pohwBadge) {
      pohwBadge.addEventListener('click', () => {
        smartEditor.openTribunal();
      });
    }

    // Backup
    const backupBtn = document.querySelector('[data-action="backup"]');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => this.exportBackup());
    }

    // Seleção de texto para Academia Gramatical
    const editor = document.getElementById('editor');
    if (editor) {
      editor.addEventListener('mouseup', () => this.handleTextSelection());
      editor.addEventListener('keyup', () => this.handleTextSelection());
    }

    // Antes de fechar página - salva e finaliza sessão
    window.addEventListener('beforeunload', async () => {
      await smartEditor.saveManuscript();
      if (pohwTracker.isActive) {
        await pohwTracker.endSession();
      }
    });

    // Navegação principal
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Aqui entraria navegação entre módulos
        console.log('[Nav] Módulo:', e.target.textContent);
      });
    });
  }

  /**
   * Handler de seleção de texto para Academia Gramatical
   */
  handleTextSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    const analysisEl = document.getElementById('grammar-analysis');
    const wordClassEl = document.getElementById('word-class');
    const wordDescEl = document.getElementById('word-desc');
    
    if (selectedText && selectedText.length <= 50) {
      // Análise simples (placeholder para módulo completo de Academia)
      const analysis = this.analyzeWord(selectedText);
      
      wordClassEl.textContent = analysis.class;
      wordDescEl.textContent = analysis.desc;
      analysisEl.style.display = 'block';
    } else {
      analysisEl.style.display = 'none';
    }
  }

  /**
   * Análise lexical básica (placeholder)
   */
  analyzeWord(word) {
    // Dicionário simplificado para demo
    const dictionary = {
      'era': { class: 'Verbo', desc: 'Verbo ser no pretérito imperfeito. Indica estado ou existência no passado.' },
      'uma': { class: 'Artigo', desc: 'Artigo indefinido feminino. Determina o substantivo de forma vaga.' },
      'vez': { class: 'Substantivo', desc: 'Substantivo feminino. Indica ocasião, momento ou evento.' },
      'no': { class: 'Preposição', desc: 'Contração da preposição "em" + artigo "o". Indica lugar ou tempo.' },
      'coração': { class: 'Substantivo', desc: 'Substantivo masculino. Órgão vital ou centro emocional.' },
      'sertão': { class: 'Substantivo', desc: 'Substantivo masculino. Região interiorana, agreste.' },
      'vereda': { class: 'Substantivo', desc: 'Substantivo feminino. Caminho, trilha, ou nascente no sertão.' },
      'se': { class: 'Pronome', desc: 'Pronome reflexivo ou partícula apassivadora.' },
      'abria': { class: 'Verbo', desc: 'Verbo abrir no pretérito imperfeito. Ação de desobstruir, revelar.' },
      'como': { class: 'Advérbio', desc: 'Advérbio interrogativo ou conjunção comparativa.' },
      'promessa': { class: 'Substantivo', desc: 'Substantivo feminino. Compromisso, esperança ou anúncio.' }
    };

    const lowerWord = word.toLowerCase();
    
    if (dictionary[lowerWord]) {
      return dictionary[lowerWord];
    }

    // Detecção básica por sufixo
    if (word.endsWith('mente')) {
      return { class: 'Advérbio', desc: 'Advérbio de modo formado a partir de adjetivo + sufixo "-mente".' };
    }
    if (word.endsWith('ção') || word.endsWith('dade') || word.endsWith('mento')) {
      return { class: 'Substantivo', desc: 'Substantivo abstrato derivado de verbo ou adjetivo.' };
    }
    if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) {
      return { class: 'Verbo', desc: 'Verbo no infinitivo. Indica ação, estado ou fenômeno.' };
    }
    if (word.endsWith('mente')) {
      return { class: 'Advérbio', desc: 'Modifica o verbo, adjetivo ou outro advérbio.' };
    }

    return { 
      class: 'Classe Não Identificada', 
      desc: 'Selecione outra palavra ou consulte o dicionário completo.' 
    };
  }

  /**
   * Atualiza meta diária
   */
  updateDailyGoal() {
    const goalEl = document.getElementById('daily-goal');
    if (goalEl && this.todayWritten > 0) {
      const percentage = Math.min(100, Math.round((this.todayWritten / this.dailyGoal) * 100));
      goalEl.textContent = `Meta Diária: ${percentage}%`;
    }
  }

  /**
   * Exporta backup completo
   */
  async exportBackup() {
    try {
      const manuscripts = await veredaDB.getAllManuscripts();
      
      const backup = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        totalManuscripts: manuscripts.length,
        manuscripts: manuscripts
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vereda_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Backup exportado com sucesso!');
    } catch (error) {
      console.error('[App] Erro no backup:', error);
      alert('Erro ao exportar backup.');
    }
  }

  /**
   * Atualiza stats da sessão em tempo real
   */
  updateSessionStats() {
    if (!pohwTracker.isActive) return;

    const eventsEl = document.getElementById('session-events');
    const suspiciousEl = document.getElementById('session-suspicious');
    const scoreEl = document.getElementById('session-score');

    if (eventsEl) eventsEl.textContent = pohwTracker.totalEvents;
    if (suspiciousEl) suspiciousEl.textContent = pohwTracker.suspiciousCount;
    if (scoreEl) {
      const score = pohwTracker.calculateAuthenticityScore();
      scoreEl.textContent = `${score}%`;
      scoreEl.style.color = score >= 95 ? 'var(--verde)' : '#8B0000';
    }
  }
}

// Instância global
const veredaApp = new VeredaApp();

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  veredaApp.init();
  
  // Atualiza stats periodicamente
  setInterval(() => {
    veredaApp.updateSessionStats();
  }, 1000);
});
