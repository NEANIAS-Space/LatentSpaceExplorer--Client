// src/app/components/modules/elements/loading-button/index.jsx

import { mount } from '@cypress/react';
import LoadingButton from 'app/components/elements/loading-button';

describe('LoadingButton', () => {
    const name = 'LoadingButtonTest';

    beforeEach(() => {
        mount(
            <LoadingButton
                text="Compute"
                type="submit"
                color="primary"
                isLoading={false}
                onChange={() => {}}
            />,
        );
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
