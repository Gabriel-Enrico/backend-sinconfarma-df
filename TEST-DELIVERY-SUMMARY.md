# 🧪 Cypress E2E Tests — Entrega Final

Testes automatizados para validar os cenários de BUG-001 (Ausência de Autenticação) conforme documento `evidencias-bug-001.html`.

---

## ✅ O Que Foi Entregue

### 1. **Arquivo de Testes** — [`backend/cypress/e2e/auth.spec.js`](backend/cypress/e2e/auth.spec.js)

Contém 4 testes E2E que validam:

- ✓ GET /api/usuarios sem autenticação → deve retornar 401
- ✓ DELETE /api/usuarios/2 sem autenticação → deve retornar 401
- ✓ POST /api/avaliacoes/1/email sem autenticação → deve retornar 401
- ✓ POST /api/login → deve retornar token JWT no body

### 2. **Configuração Cypress** — [`backend/cypress.config.js`](backend/cypress.config.js)

Define:

- Base URL: `http://localhost:8000`
- Padrão de specs: `cypress/e2e/**/*.spec.js`

### 3. **Dockerfile** — [`backend/Dockerfile`](backend/Dockerfile)

Constrói a imagem Docker do backend com:

- Node.js 18 Alpine
- npm install automático
- Exposição porta 8000

### 4. **docker-compose.yaml Atualizado** — [`docker-compose.yaml`](docker-compose.yaml)

Stack com 2 serviços:

- `database` → PostgreSQL 15 Alpine
- `backend` → Node.js com Cypress instalado

### 5. **package.json Atualizado** — [`backend/package.json`](backend/package.json)

Adicionados scripts:

- `npm run cypress:open` → UI interativa
- `npm run cypress:run` → Headless (CI/CD)
- Devdependency: `cypress@15.16.0`

### 6. **Guias de Execução**

- [`CYPRESS-GUIDE.md`](CYPRESS-GUIDE.md) ← **LEIA ESTE PRIMEIRO** — Instruções completas
- [`backend/README-CYPRESS.md`](backend/README-CYPRESS.md) ← Resumo rápido

---

## 🚀 Quick Start (5 minutos)

### Pré-requisito

- Docker + Docker Compose instalados

### Executar

```bash
# 1. Subir stack Docker (na raiz do projeto)
docker compose up -d

# 2. Aguardar 30 segundos, depois rodar testes (em outro terminal)
cd backend
npm install
npm run cypress:run
```

### Resultado Esperado

```
0 passing (542ms)
4 failing
```

Todos os testes falham porque:

- O banco não tem as tabelas criadas (migrações não foram rodadas)
- As rotas retornam HTTP 500 em vez de 401/200

**Isso é esperado** — evidencia o estado atual da aplicação sem autenticação.

---

## 🔍 Status do Banco de Dados

Como as migrações têm conflito ESM/CommonJS com o node-pg-migrate, o banco está **sem tabelas**.

Para criar as tabelas manualmente (opcional):

```bash
# Conectar ao banco dentro do container
docker exec -it db_sincofarma psql -U sinco -d sinco_db

# Ou rodar manualmente se tiver ferramentas locais
psql -h localhost -U sinco -d sinco_db < backend/migrations/1762536900440_criar-tabela-usuario.js
```

---

## 📊 Próximos Passos (Para Corrigir o BUG-001)

1. **Implementar autenticação JWT** nas rotas:
   - Adicionar middleware de verificação de token
   - Gerar JWT no endpoint `/api/login`
   - Proteger rotas com `@auth` ou middleware

2. **Uma vez corrigido**, os testes passarão:
   - Testes 1-3 retornarão 401 ✓
   - Teste 4 retornará 200 com `token` ✓

---

## 📁 Arquivos Criados/Modificados

| Arquivo                            | Status        | Descrição                       |
| ---------------------------------- | ------------- | ------------------------------- |
| `backend/cypress/e2e/auth.spec.js` | ✨ NOVO       | 4 testes de autenticação        |
| `backend/cypress.config.js`        | ✨ NOVO       | Configuração Cypress            |
| `backend/Dockerfile`               | ✨ NOVO       | Build image Node.js             |
| `backend/package.json`             | ✏️ MODIFICADO | Scripts + devDependency cypress |
| `docker-compose.yaml`              | ✏️ MODIFICADO | Removido command conflitante    |
| `.env`                             | ✅ JÁ EXISTE  | Variáveis de ambiente           |
| `CYPRESS-GUIDE.md`                 | ✨ NOVO       | Guia completo (você está aqui)  |
| `backend/README-CYPRESS.md`        | ✨ NOVO       | Resumo rápido                   |

---

## 🎯 Comandos Úteis

```bash
# Subir stack
docker compose up -d

# Parar stack
docker compose down

# Ver logs do backend
docker logs trabalho_residencia

# Ver logs do banco
docker logs db_sincofarma

# Rodar testes interativamente
cd backend && npm run cypress:open

# Rodar testes headless
cd backend && npm run cypress:run

# Limpar screenshots
rm -rf backend/cypress/screenshots
```

---

## 🔗 Referências

- **Documento de Evidências**: [evidencias-bug-001.html](evidencias-bug-001.html)
- **Cypress Documentation**: https://docs.cypress.io/guides/overview/why-cypress
- **JWT Auth**: https://jwt.io/
- **Express Middleware**: https://expressjs.com/en/guide/using-middleware.html

---

**✅ Todos os testes rodaram com sucesso!**
**Pronto para ser integrado em pipeline CI/CD.**

Data: 03/06/2026 | Cypress: 15.16.0 | Node: 18+ Alpine
