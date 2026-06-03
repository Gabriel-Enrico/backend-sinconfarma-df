describe('Farmácia API', () => {
  it('GET /api/farmacias deve retornar 200 e uma lista de farmácias', () => {
    cy.request({ method: 'GET', url: '/api/farmacias', failOnStatusCode: false }).then((resp) => {
      expect(resp.status).to.equal(200);
      expect(resp.body).to.be.an('array');
      if (resp.body.length > 0) {
        const f = resp.body[0];
        expect(f).to.include.keys('id', 'nome', 'endereco', 'telefone', 'cnpj');
      }
    });
  });
});
