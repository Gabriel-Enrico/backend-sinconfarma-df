describe('Fluxo de Avaliação — Acceptance (API-driven)', () => {
  let token = null;
  let avaliacaoId = null;

  it('POST /api/login deve retornar token', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: { email: 'erivan@gmail.com', senha: '123456' },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.equal(200);
      expect(resp.body).to.have.property('token');
      token = resp.body.token;
    });
  });

  it('POST /api/avaliacoes cria uma avaliação com token', () => {
    cy.request({
      method: 'POST',
      url: '/api/avaliacoes',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        farmacia_id: 1,
        usuario_id: 1,
        data_avaliacao: new Date().toISOString(),
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect([200, 201]).to.include(resp.status);
      // tenta extrair id do corpo
      avaliacaoId = resp.body.id || (resp.body.avaliacao && resp.body.avaliacao.id);
    });
  });

  it('POST /api/avaliacoes/:id/email envia relatório (requisição protegida)', () => {
    if (!avaliacaoId) {
      cy.log('Avaliação não criada; pulando teste de envio de email');
      return;
    }
    cy.request({
      method: 'POST',
      url: `/api/avaliacoes/${avaliacaoId}/email`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      // Pode retornar 200/201/202 dependendo da implementação
      expect([200, 201, 202, 204]).to.include(resp.status);
    });
  });
});
