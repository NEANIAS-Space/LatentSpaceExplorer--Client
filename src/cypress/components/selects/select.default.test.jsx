// src/app/components/elements/selects/default/index.jsx

import React from 'react';
import { mount } from '@cypress/react';
import Select from 'app/components/elements/selects/default';

describe('Select', () => {
    const name = 'SelectTest';
    const value = 5;
    const options = [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
    ];
    const setValue = () => {};

    beforeEach(() => {
        mount(
            <Select
                name={name}
                value={value}
                options={options}
                setValue={setValue}
            />,
        );
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
