describe('Server', () => {
    it(
        'Connection',
        {
            baseUrl: `http://${Cypress.env('SERVER_HOST')}:${Cypress.env(
                'SERVER_PORT',
            )}`,
        },
        () => {
            cy.log('SERVER_HOST', Cypress.env('SERVER_HOST'));
            cy.log('SERVER_PORT', Cypress.env('SERVER_PORT'));
            cy.log('baseUrl', Cypress.config().baseUrl);

            cy.request({
                method: 'GET',
                url: '/',
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body).to.deep.equal({ detail: 'Not Found' });
            });
        },
    );
});
