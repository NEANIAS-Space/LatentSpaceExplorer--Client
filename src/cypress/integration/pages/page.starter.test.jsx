describe('Starter page', () => {
    it('Successfully loads', () => {
        cy.request('GET', '/').then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});
