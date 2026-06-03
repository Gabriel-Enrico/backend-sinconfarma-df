# Cypress E2E Tests para BUG-001 — Ausência de Autenticação

Testes automatizados com Cypress baseados no documento `evidencias-bug-001.html` que validam os cenários de acesso sem autenticação à API REST.

## 📋 O que é testado

Os testes verificam **4 casos de falha de segurança** extraídos do BUG-001:

| Teste | Endpoint                         | Esperado                 | Descrição                                 |
| ----- | -------------------------------- | ------------------------ | ----------------------------------------- |
| 1     | `GET /api/usuarios`              | 401 Unauthorized         | Dados de usuários expostos sem credencial |
| 2     | `DELETE /api/usuarios/:id`       | 401 Unauthorized         | Exclusão destrutiva sem autenticação      |
| 3     | `POST /api/avaliacoes/:id/email` | 401 Unauthorized         | Envio de e-mail sem verificação           |
| 4     | `POST /api/login`                | 200 OK + `token` no body | Login deve gerar JWT                      |

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Node.js v18+** (para rodar testes em modo local sem Docker)
- **npm** v8+

### 1️⃣ Instalar dependências do backend

```bash
cd backend
npm install
```

Isso instalará o Cypress como devDependency (ver `package.json`).

### 2️⃣ Configurar arquivo `.env` na raiz do projeto

Certifique-se de que o arquivo `.env` existe com as variáveis do banco:

```bash
cat > ../.env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_USER=sinco
DB_PASSWORD=senha123
DB_NAME=sinco_db
BACKEND_PORT=8000
NODE_ENV=development
EOF
```

### 3️⃣ Subir a stack Docker (recomendado)

Na raiz do projeto:

```bash
docker compose up -d
```

Aguarde ~30 segundos para que os containers inicializem. Verifique o status:

```bash
docker ps
```

Ambos os containers devem estar com **STATUS: Up**:

- `db_sincofarma` (PostgreSQL)
- `trabalho_residencia` (Backend Node.js)

---

## ▶️ Rodando os Testes

### Opção A: Interface Interativa (recomendado para desenvolvimento)

```bash
cd backend
npm run cypress:open
```

1. Selecione **E2E Testing** na tela inicial
2. Escolha um navegador (Chrome / Electron)
3. Clique em `auth.spec.js` para executar os testes
4. Veja ao vivo o comportamento da API, requests/responses, e assertion failures

### Opção B: Modo Headless (CI/CD, execução rápida)

```bash
cd backend
npm run cypress:run
# ou especificar um arquivo:
npx cypress run --spec "cypress/e2e/auth.spec.js"
```

Resultado esperado (dado que o banco não tem tabelas):

```
0 passing (542ms)
4 failing
```

Todos os 4 testes falham porque o servidor retorna **HTTP 500** (banco sem tabelas), não 401/200.
Isso é esperado e evidencia o estado atual da aplicação.

---

## 📊 Interpretando os Resultados dos Testes

### ✗ Falhas Esperadas (Status Atual)

**Teste 1-3**: `AssertionError: expected 500 to equal 401`
→ O servidor retorna erro 500 (tabelas ausentes) em vez de 401 (não autenticado)

**Teste 4**: `AssertionError: expected 500 to equal 200`
→ O servidor falha (500) em vez de suceder (200) e gerar um token

### ✓ Sucesso (Após Correções)

Uma vez que você implemente autenticação JWT nas rotas:

- Testes 1-3 devem **passar** com respostas 401
- Teste 4 deve **passar** com status 200 + campo `token` presente na resposta

---

## 🔧 Resolução de Problemas

### Erro: `could not connect to postgres`

- Verifique se Docker está rodando: `docker ps`
- Se não: `docker compose up -d`
- Aguarde 10-15 segundos para o banco ficar pronto

### Erro: `cy.request() failed trying to load http://localhost:8000`

- Verifique se o backend está respondendo: `curl http://localhost:8000/api/usuarios`
- Se não responder, verifique logs do container: `docker logs trabalho_residencia`

### Os testes passam mas com status 200 inesperado

- Significa que a API está retornando dados sem validar autenticação
- **Confirma BUG-001**: falta de middleware de autenticação

### Erro de ESM/CommonJS ao subir containers

- Removido automaticamente; use `npm install` + `npm run dev` (sem migrations no Docker)

---

## 📁 Estrutura de Testes

```
backend/
├── cypress/
│   ├── e2e/
│   │   └── auth.spec.js           ← Testes de autenticação (4 cases)
│   └── screenshots/                ← Screenshots dos failures (gerados automaticamente)
├── cypress.config.js               ← Configuração do Cypress
├── Dockerfile                      ← Build da imagem do backend
└── package.json                    ← Scripts: cypress:open, cypress:run
```

---

## 🛠️ Adicionando Novos Testes

Para adicionar mais casos de teste, crie um novo arquivo em `cypress/e2e/`:

```javascript
// cypress/e2e/farmacia.spec.js
describe('Farmácia API', () => {
  it('GET /api/farmacias sem Authorization deve retornar 401', () => {
    cy.request({ method: 'GET', url: '/api/farmacias', failOnStatusCode: false }).then((resp) => {
      expect(resp.status).to.equal(401);
    });
  });
});
```

Execute com:

```bash
npm run cypress:run -- --spec "cypress/e2e/farmacia.spec.js"
```

---

## 📝 Referências

- Documento original: [evidencias-bug-001.html](../evidencias-bug-001.html)
- Cypress docs: https://docs.cypress.io
- Node-pg-migrate: https://github.com/salsita/node-pg-migrate
- JSON Web Token (JWT): https://jwt.io

---

## 👤 Autor

Testes criados automaticamente baseado no Relatório de Defeito BUG-001 (SincoFarma DF · Squad 09 · Disciplina: Teste de Software)

**Data de Criação**: 03/06/2026
**Cypress Version**: 15.16.0
**Node Version**: 18+ (Alpine)
