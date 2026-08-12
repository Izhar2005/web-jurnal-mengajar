// Cypress E2E Support File
// Clear browser session before each test

beforeEach(() => {
  cy.visit("/");

  // Remove session key so app shows login on reload
  cy.clearLocalStorage();
  cy.clearAllCookies();

  // Reload after clearing — forces app to re-initialize without a session
  cy.reload();

  cy.get('input[type="email"]', { timeout: 10000 }).should("exist");
});
