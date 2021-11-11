// src/app/components/elements/selects/multiline/index.jsx

import React from 'react';
import { mount } from '@cypress/react';
import Select from 'app/components/elements/selects/multiline';

describe('Multiline Select', () => {
    const name = 'MultilineSelectTest';
    const value = 1112131415;
    const options = [
        {
            label: {
                id: 12345,
                metadata: {
                    algorithm: 'pca',
                    components: 2,
                    params: {},
                    datetime: '2021-09-02 12:00:00',
                },
            },
        },
        {
            label: {
                id: 678910,
                metadata: {
                    algorithm: 'tsne',
                    components: 3,
                    params: {
                        perplexity: 30,
                        iterations: 1000,
                        learning_rate: 200,
                    },
                    datetime: '2021-09-03 13:00:00',
                },
            },
        },
        {
            label: {
                id: 1112131415,
                metadata: {
                    algorithm: 'umap',
                    components: 3,
                    params: { neighbors: 10, min_distance: 0.05 },
                    datetime: '2021-09-04 14:00:00',
                },
            },
        },
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
