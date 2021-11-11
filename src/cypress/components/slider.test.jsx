// src/app/components/elements/slider/index.jsx

import { mount } from '@cypress/react';
import Slider from 'app/components/elements/slider';

describe('Slider', () => {
    const name = 'SliderTest';
    const value = 5;
    const setValue = () => {};

    beforeEach(() => {
        mount(
            <Slider
                name={name}
                value={value}
                step={1}
                min={1}
                max={10}
                setValue={setValue}
            />,
        );
    });

    it('Successfully render', () => {
        cy.get(`[data-testid=${name}]`).should('exist');
    });
});
