# Vereda — O Santuário do Escritor Brasileiro

**Ecossistema de escrita focado em autores brasileiros, com prova de autoria humana (PoHW) e excelência linguística.**

---

## 🚀 Visão Geral

O **Vereda** é uma aplicação offline-first que oferece:

- ✍️ **Editor Inteligente** com Modo Foco Dinâmico
- 🔐 **PoHW (Proof of Writing)** - Certificação de autoria humana via análise de cadência
- 📚 **Academia Gramatical** - Análise lexical integrada
- 💾 **Persistência Offline** via IndexedDB
- 📤 **Exportação de Prova** (.proof.json) para validação editorial

---

## 📁 Estrutura do Projeto

```
vereda/
├── index.html          # Template unificado
├── css/
│   └── style.css       # Design System "Papel e Tinta"
├── js/
│   ├── database.js     # Gerenciador IndexedDB
│   ├── pohw.js         # Proof of Writing (rastreamento)
│   ├── editor.js       # Editor Inteligente + Modo Foco
│   └── app.js          # Orquestração principal
└── data/               # (Reservado para exports)
```

---

## 🎨 Design System

### Cores
| Variável | Valor | Uso |
|----------|-------|-----|
| `--p` | `#F8F5EF` | Fundo principal (off-white) |
| `--acento` | `#2E4D43` | Verde Vereda (primária) |
| `--verde` | `#2A5E45` | Indicadores positivos |
| `--t` | `#1A1612` | Texto principal |

### Tipografia
- **Serifada:** Georgia/Times New Roman (corpo do texto)
- **Sans-serif:** system-ui (interface)

---

## 🔧 Como Usar

### 1. Abrir a Aplicação

Basta abrir o arquivo `index.html` em qualquer navegador moderno:

```bash
# Opção 1: Abrir diretamente
open vereda/index.html

# Opção 2: Servidor local (recomendado)
python -m http.server 8000
# Acesse: http://localhost:8000
```

### 2. Escrever

1. Clique em **"+ Novo Manuscrito"** na sidebar
2. Digite seu texto no editor central
3. O **PoHW** começa a rastrear automaticamente

### 3. Modo Foco

- Clique em **"⌘ Modo Foco"** na toolbar
- OU aguarde 2 segundos sem digitar (auto-hide)
- Para sair: mova o mouse ou pressione qualquer tecla

### 4. Exportar Prova de Autoria

1. Clique em **"📜 Exportar Prova"** na toolbar
2. OU clique no badge **"AUTORIA HUMANA: XX%"** no header
3. Baixe o arquivo `.proof.json`

### 5. Tribunal de Autoria

Clique no badge **AUTORIA HUMANA** para abrir o modal do Tribunal, que mostra:
- Timeline visual dos eventos de digitação
- Estatísticas de autenticidade
- Critérios de validação

---

## 🔐 PoHW - Proof of Writing

### Regra de Ouro

Apenas eventos são considerados **orgânicos** se:

```javascript
isTrusted === true  // Evento real do usuário
E
30ms <= intervalo <= 2000ms  // Cadência humana natural
```

### Métricas Capturadas

| Campo | Descrição |
|-------|-----------|
| `sessionId` | ID único da sessão |
| `timestamp` | Timestamp exato do evento |
| `interval` | Tempo desde a última tecla (ms) |
| `isTrusted` | Se o evento é nativo do browser |
| `isOrganic` | Se está dentro da Regra de Ouro |
| `keyCode` | Código da tecla pressionada |

### Score de Autenticidade

```
Score = (Eventos Orgânicos / Total de Eventos) × 100

✅ 95-100%: Autenticidade confirmada
⚠️  70-94%: Revisão recomendada
❌  <70%: Possível automação/IA
```

---

## 💾 Armazenamento (IndexedDB)

### Stores

#### `manuscripts`
```javascript
{
  id: "ms_1234567890_abc",
  title: "Prólogo: A Vereda",
  content: "<html>...</html>",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  wordCount: 1234,
  charCount: 5678
}
```

#### `pohw_logs`
```javascript
{
  id: 1,
  sessionId: "pohw_1234567890_xyz",
  manuscriptId: "ms_1234567890_abc",
  timestamp: 1735689600000,
  eventType: "keydown",
  keyCode: "KeyA",
  interval: 150,
  isTrusted: true,
  isOrganic: true,
  modifiers: { shift: false, ctrl: false, alt: false, meta: false }
}
```

#### `sessions`
```javascript
{
  id: "pohw_1234567890_xyz",
  manuscriptId: "ms_1234567890_abc",
  startedAt: "2025-01-01T00:00:00Z",
  endedAt: "2025-01-01T01:00:00Z",
  status: "completed",
  eventCount: 5000,
  suspiciousCount: 12
}
```

---

## 📤 Formato .proof.json

```json
{
  "version": "1.0",
  "generatedAt": "2025-01-01T01:00:00Z",
  "manuscript": {
    "title": "Prólogo: A Vereda",
    "contentHash": "sha256_abc123...",
    "wordCount": 1234
  },
  "session": {
    "id": "pohw_1234567890_xyz",
    "startedAt": "2025-01-01T00:00:00Z",
    "endedAt": "2025-01-01T01:00:00Z",
    "totalEvents": 5000,
    "suspiciousEvents": 12,
    "authenticityScore": 99.76
  },
  "metrics": {
    "averageInterval": 145,
    "minInterval": 30,
    "maxInterval": 2000
  },
  "verification": {
    "proofHash": "sha256_def456...",
    "algorithm": "SHA-256"
  },
  "events": [...] // Logs completos
}
```

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+S` | Salvar manuscrito |
| `Click no Badge` | Abrir Tribunal de Autoria |

---

## 🧪 Testando o PoHW

### Cenário 1: Digitação Normal
1. Digite naturalmente por 1-2 minutos
2. Observe o contador de eventos subir
3. Score deve ficar **acima de 95%**

### Cenário 2: Copiar/Colar em Massa
1. Copie um texto grande
2. Cole no editor
3. Eventos serão marcados como **suspeitos** (intervalo ~0ms)

### Cenário 3: Automação/Simulação
```javascript
// Script simulando digitação robótica
setInterval(() => {
  document.querySelector('.editor-main').innerText += 'a';
}, 10); // 10ms é abaixo do mínimo humano (30ms)
```
→ Score cairá drasticamente

---

## 🛠️ Desenvolvimento

### Adicionar Novos Recursos

1. **Novo módulo:** Crie `js/modulo.js` e importe em `index.html`
2. **Novo estilo:** Adicione em `css/style.css`
3. **Nova store IndexedDB:** Atualize `database.js` no `onupgradeneeded`

### Debug

Abra o DevTools do navegador e use:

```javascript
// Acessar instâncias globais
veredaDB      // Banco de dados
pohwTracker   // Rastreador PoHW
smartEditor   // Editor
veredaApp     // App principal

// Exemplo: ver logs de uma sessão
const logs = await veredaDB.getPoHWLogsBySession(pohwTracker.sessionId);
console.log(logs);
```

---

## 📋 Próximos Passos (Roadmap)

- [ ] **Academia Gramatical Completa** - Integração com API de NLP
- [ ] **Modo Leitor Imersivo** - Régua de foco + autoscroll
- [ ] **Timeline/Planner** - Organize-se com feriados BR
- [ ] **Service Worker** - PWA offline completo
- [ ] **Exportação EPUB/PDF** - Formato livro padrão
- [ ] **Sincronização** - Backup em nuvem opcional

---

## 📄 Licença

Projeto em desenvolvimento. Todos os direitos reservados.

---

## 🙏 Créditos

**Vereda** — O Santuário do Escritor Brasileiro  
Desenvolvido com ❤️ para autores brasileiros

*"No coração do sertão, onde a terra racha e o sol não perdoa, que uma vereda se abria como uma promessa..."*
