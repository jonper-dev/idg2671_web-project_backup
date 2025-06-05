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
describe('Basic ResultsPage-test without MSW', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStudies),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders study cards based on fetched data', async () => {
    render(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(mockStudies[0].name)).toBeInTheDocument()
    );

    mockStudies.forEach((study) => {
      expect(screen.getByText(study.name)).toBeInTheDocument();
    });
  });
});
