describe('Access control tests — baseado em BUG-001', () => {
  it('GET /api/usuarios sem Authorization deve retornar 401', () => {
    cy.request({ method: 'GET', url: '/api/usuarios', failOnStatusCode: false }).then((resp) => {
      expect(resp.status).to.equal(401);
    });
  });

  it('DELETE /api/usuarios/2 sem Authorization deve retornar 401', () => {
    cy.request({ method: 'DELETE', url: '/api/usuarios/2', failOnStatusCode: false }).then(
      (resp) => {
        expect(resp.status).to.equal(401);
      }
    );
  });

  it('POST /api/avaliacoes/1/email sem Authorization deve retornar 401', () => {
    cy.request({ method: 'POST', url: '/api/avaliacoes/1/email', failOnStatusCode: false }).then(
      (resp) => {
        expect(resp.status).to.equal(401);
      }
    );
  });

  it('POST /api/login deve retornar token no body', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: { email: 'erivan@gmail.com', senha: '123456' },
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.equal(200);
      expect(resp.body).to.have.property('token');
    });
  });
});
