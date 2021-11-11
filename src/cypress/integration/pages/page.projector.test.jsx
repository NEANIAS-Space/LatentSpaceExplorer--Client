describe('Projector page', () => {
    it('Successfully loads', () => {
        cy.request('GET', '/projector').then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});
