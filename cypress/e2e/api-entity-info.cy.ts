describe("Test Entity Info API endpoint", () => {
  it("passes", () => {
    cy.request("http://localhost:3000/api/entity-info?id=rec2SisdBnuMAZZJb").as(
      "entityInfo"
    );
    cy.get("@entityInfo").should((response) => {
      expect(response.body).to.have.property("name");
    });
  });
});
