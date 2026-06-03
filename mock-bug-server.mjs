/**
 * MOCK SERVER — BUG-001 Evidence
 * Replica fielmente o comportamento bugado do SincoFarma DF backend.
 * Serve a página HTML de evidências em http://localhost:8000
 * e expõe os endpoints bugados em /api/*
 *
 * DEFEITO: Endpoints não exigem autenticação (sem JWT, sem middleware de authz)
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const HTML_FILE  = path.join(__dirname, "evidencias-bug-001.html");

// ──────────────────────────────────────────────────────────────
// Dados simulados (refletem a estrutura real do banco)
// ──────────────────────────────────────────────────────────────
const usuarios = [
  { id: 1, nome: "Admin",       email: "admin@sinconfarma.df",     telefone: "(61) 99999-0001", ativo: true,  role_nome: "administrador" },
  { id: 2, nome: "Avaliador",   email: "avaliador@sinconfarma.df", telefone: null,               ativo: true,  role_nome: "avaliador" },
  { id: 3, nome: "Carlos Souza",email: "carlos@sinconfarma.df",    telefone: "(61) 98888-1234",  ativo: true,  role_nome: "avaliador" },
  { id: 4, nome: "Ana Lima",    email: "ana@sinconfarma.df",       telefone: "(61) 97777-5678",  ativo: false, role_nome: "avaliador" },
];

const farmacias = [
  { id: 1, nome: "Farmácia Central",    cnpj: "12.345.678/0001-90", endereco: "SCS Quadra 4, Bloco A", ativo: true },
  { id: 2, nome: "Drogaria Saúde DF",   cnpj: "98.765.432/0001-11", endereco: "Asa Norte, CLN 302",    ativo: true },
];

const avaliacoes = [
  { id: 1, farmacia_id: 1, avaliador_id: 2, data: "2026-05-10", status: "concluida", nota: 8.5  },
  { id: 2, farmacia_id: 2, avaliador_id: 3, data: "2026-05-20", status: "pendente",  nota: null },
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    "Content-Type":                "application/json",
    "Access-Control-Allow-Origin": "*",   // DEFEITO: CORS aberto
    "Content-Length":              Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end",  () => {
      try   { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

// ──────────────────────────────────────────────────────────────
// Router principal
// ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const p = url.split("?")[0];   // path limpo (sem query string)

  console.log(`[${new Date().toISOString()}] ${method} ${p}`);

  // ── OPTIONS preflight ────────────────────────────────────────
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  // ── Rota raiz: serve a página HTML de evidências ─────────────
  if (method === "GET" && (p === "/" || p === "")) {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Erro ao carregar evidencias-bug-001.html");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  // ── Favicon ──────────────────────────────────────────────────
  if (p === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── POST /api/login ──────────────────────────────────────────
  // DEFEITO: retorna dados do usuário mas NÃO emite token JWT
  if (method === "POST" && p === "/api/login") {
    const body = await readBody(req);
    const user = usuarios.find((u) => u.email === body.email);

    if (!user || body.senha !== "senha123") {
      return sendJSON(res, 401, { error: "Usuário ou senha inválidos" });
    }

    // DEFEITO: sem token: jwt.sign(...) — nenhum mecanismo de sessão gerado
    return sendJSON(res, 200, {
      message: "Login bem-sucedido!",
      usuario: {
        id:    user.id,
        nome:  user.nome,
        email: user.email,
        role:  user.role_nome,
        // ← AUSENTE: token JWT
      },
    });
  }

  // ── GET /api/usuarios ────────────────────────────────────────
  // DEFEITO: sem verificação de Authorization header
  if (method === "GET" && p === "/api/usuarios") {
    // ← DEVERIA ter: if (!req.headers.authorization) return sendJSON(res, 401, ...)
    return sendJSON(res, 200, usuarios);
  }

  // ── GET /api/usuarios/:id ────────────────────────────────────
  const matchUserGet = p.match(/^\/api\/usuarios\/(\d+)$/);
  if (method === "GET" && matchUserGet) {
    const user = usuarios.find((u) => u.id === parseInt(matchUserGet[1]));
    if (!user) return sendJSON(res, 404, { error: "Usuário não encontrado" });
    return sendJSON(res, 200, user);
  }

  // ── DELETE /api/usuarios/:id ─────────────────────────────────
  // DEFEITO: qualquer cliente pode excluir qualquer usuário
  const matchDelete = p.match(/^\/api\/usuarios\/(\d+)$/);
  if (method === "DELETE" && matchDelete) {
    const id  = parseInt(matchDelete[1]);
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return sendJSON(res, 404, { error: "Usuário não encontrado" });
    const [removed] = usuarios.splice(idx, 1);
    // ← DEVERIA ter: verificação de token antes de executar
    return sendJSON(res, 200, {
      message: `Usuário id=${id} excluído com sucesso.`,
      usuario: removed,
    });
  }

  // ── GET /api/farmacias ───────────────────────────────────────
  if (method === "GET" && p === "/api/farmacias") {
    return sendJSON(res, 200, farmacias);
  }

  // ── GET /api/avaliacoes ──────────────────────────────────────
  if (method === "GET" && p === "/api/avaliacoes") {
    return sendJSON(res, 200, avaliacoes);
  }

  // ── POST /api/avaliacoes/:id/email ───────────────────────────
  // DEFEITO: disparo de e-mail sem autenticação
  const matchEmail = p.match(/^\/api\/avaliacoes\/(\d+)\/email$/);
  if (method === "POST" && matchEmail) {
    const id = parseInt(matchEmail[1]);
    const av = avaliacoes.find((a) => a.id === id);
    if (!av) return sendJSON(res, 404, { error: "Avaliação não encontrada" });
    // ← DEVERIA ter: verificação de token antes de disparar e-mail
    return sendJSON(res, 200, {
      message:   `E-mail com relatório da avaliação id=${id} enviado com sucesso.`,
      avaliacao: av,
    });
  }

  // ── 404 ──────────────────────────────────────────────────────
  sendJSON(res, 404, { error: "Rota não encontrada" });
});

// ──────────────────────────────────────────────────────────────
// Inicialização
// ──────────────────────────────────────────────────────────────
const PORT = 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  SincoFarma DF — Mock Server (BUG-001 Evidence)");
  console.log(`  ► Abra no navegador: http://localhost:${PORT}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("  DEFEITO: Endpoints sem autenticação");
  console.log("  Endpoints expostos:");
  console.log("    GET    /api/usuarios          → HTTP 200 (deveria 401)");
  console.log("    DELETE /api/usuarios/:id      → HTTP 200 (deveria 401)");
  console.log("    POST   /api/avaliacoes/:id/email → HTTP 200 (deveria 401)");
  console.log("    POST   /api/login             → sem JWT na resposta");
  console.log("═══════════════════════════════════════════════════════\n");
});
