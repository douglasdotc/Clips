describe('Clip', () => {
  it('should play clip', () => {
    // Go to home page:
    cy.visit('/');
    // Click the first video:
    cy.get('app-clips-list > .grid a:first').click();
    // Click to play the video:
    cy.get('.video-js').click();
    // Wait for 3 seconds:
    cy.wait(3000); // ms
    // Pause the video:
    cy.get('.video-js').click();
    // If the video progress bar has a width > 0 then the test is a success:
    // invoke() to select the width function
    // should() is from Chai testing library, gte means greater than or equal to.
    cy.get('.vjs-play-progress').invoke('width').should('gte', 0);
  });
});
