describe("register to plan-prise", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("shows the register form", () => {
    cy.get("form h3").should("contain.text", "Inscription");
  });
});

export {};
