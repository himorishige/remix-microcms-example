declare namespace Cypress {
  interface Chainable {
    isExistElement(cssSelector: string): Cypress.Chainable<boolean>;
  }
}
