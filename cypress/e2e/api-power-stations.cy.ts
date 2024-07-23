describe("Test Power Stations API endpoint", () => {
  it("passes", () => {
    cy.request("http://localhost:3000/api/power-stations").as("powerStations");
    cy.get("@powerStations").should((response) => {
      expect(response.body).to.have.property("powerStations");
    });
  });
});
