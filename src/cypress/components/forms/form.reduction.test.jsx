// src/app/components/modules/forms/reduction/index.jsx

import React from 'react';
import { mount } from '@cypress/react';
import ReductionForm from 'app/components/modules/forms/reduction';

describe('ReductionForm', () => {
    const name = 'ReductionFormTest';

    beforeEach(() => {
        mount(<ReductionForm />);
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
