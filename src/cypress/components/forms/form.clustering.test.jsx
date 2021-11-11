// src/app/components/modules/forms/clustering/index.jsx

import React from 'react';
import { mount } from '@cypress/react';
import ClusteringForm from 'app/components/modules/forms/cluster';

describe('ClusteringForm', () => {
    const name = 'ClusteringFormTest';

    beforeEach(() => {
        mount(<ClusteringForm />);
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
