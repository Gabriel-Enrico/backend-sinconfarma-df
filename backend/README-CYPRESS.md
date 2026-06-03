Cypress E2E tests for BUG-001 scenarios

Prerequisitos

- Node.js e npm instalados
- Servidor rodando em http://localhost:8000 (veja `backend/src/server.js`)

Instalação

1. Abra um terminal na pasta `backend/`
2. Rode:

```bash
npm install --save-dev cypress
```

Executando os testes

- Abrir interface interativa:

```bash
npm run cypress:open
```

- Executar em modo headless:

```bash
npm run cypress:run
```

Notas

- Os testes esperam que o servidor esteja disponível em `http://localhost:8000`.
- Os testes verificam o comportamento esperado (401 para rotas protegidas e presença de `token` no login). Se o servidor estiver com o defeito descrito, os testes irão falhar — isso é intencional para evidenciar o bug.
