describe('My First Test', () => {
  it('Sanity test', () => {
    // Visit home page:
    cy.visit('/');
    // If the inner text exist in the app name link in the header,
    // we consider it successfully visited the home page.
    cy.contains('#header .text-3xl', 'Clipz');
  });
});
