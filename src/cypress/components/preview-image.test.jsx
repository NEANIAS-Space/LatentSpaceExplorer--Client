// src/app/components/modules/elements/preview-image/index.jsx

import React from 'react';
import { mount } from '@cypress/react';
import PreviewImage from 'app/components/elements/preview-image';

describe('PreviewImage', () => {
    const name = 'PreviewImageTest';

    beforeEach(() => {
        mount(<PreviewImage imageName="000.png" />);
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
