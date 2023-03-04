describe("register to plan-prise", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("shows the register form", () => {
    cy.get("form h3").should("contain.text", "Inscription");
  });

  it("registers without error", () => {
    cy.get("#lastName").type("Nom test");
    cy.get("#firstName").type("Prénom test");
    cy.get("#student").uncheck();
    cy.get("button").first().click();
    cy.get("#displayName").type("Nom structure");
    cy.get("#email").type("mail@test.com");
    cy.get("#password").type("testtest");
    cy.get("#password_confirmation").type("testtest");
    cy.get("button[type=submit]").click();
  });
});

export {};
