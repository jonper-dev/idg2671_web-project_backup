/// <reference types="vitest" />
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ResultsPage from '../../src/pages/ResultsPage';
import mockStudies from '../mocks/mockStudies.json';
import { MemoryRouter } from 'react-router-dom';

// #########################################################
// ### Integration tests for studies & "ResultsPage.jsx" ###
// #########################################################
// Testing without MSW since we couldn't get it to work in time.
describe('Advanced ResultsPage-test without MSW', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders multiple study cards based on fetched data', async () => {
        vi.stubGlobal('fetch', () =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockStudies),
            })
        );

        render(
            <MemoryRouter>
                <ResultsPage />
            </MemoryRouter>
        );

        // Wait for the first study name
        await waitFor(() =>
            expect(screen.getByText(mockStudies[0].name)).toBeInTheDocument()
        );

        // Ensure all studies are rendered
        mockStudies.forEach((study) => {
            expect(screen.getByText(study.name)).toBeInTheDocument();
        });
    });

    it('displays a message when no studies are found', async () => {
        vi.stubGlobal('fetch', () =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]), // Simulate empty data
            })
        );

        render(
            <MemoryRouter>
                <ResultsPage />
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(screen.getByText(/no studies/i)).toBeInTheDocument()
        );
    });

    it('handles fetch error gracefully', async () => {
        vi.stubGlobal('fetch', () =>
            Promise.resolve({
                ok: false, // Simulate a failed response
            })
        );

        render(
            <MemoryRouter>
                <ResultsPage />
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(screen.getByText(/error fetching studies/i)).toBeInTheDocument()
        );
    });
});
