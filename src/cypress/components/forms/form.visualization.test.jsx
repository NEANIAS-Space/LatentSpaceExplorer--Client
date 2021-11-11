// src/app/components/modules/forms/visualization/index.jsx

import React from 'react';
import { mount } from '@cypress/react';
import VisualizationForm from 'app/components/modules/forms/visualization';

describe('VisualizationForm', () => {
    const name = 'VisualizationFormTest';

    beforeEach(() => {
        mount(<VisualizationForm />);
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
