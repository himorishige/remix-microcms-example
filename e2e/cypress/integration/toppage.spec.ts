describe('トップページ', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('should show title', () => {
    cy.contains('Index Page').should('exist');
  });
});
