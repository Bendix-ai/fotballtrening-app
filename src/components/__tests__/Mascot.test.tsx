import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Mascot } from '../Mascot';

describe('Mascot', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with happy state', () => {
        render(<Mascot state="happy" />);
        expect(screen.getByTestId('mascot')).toBeTruthy();
    });

    it('should render with all states', () => {
        const states = ['happy', 'impressed', 'cheering', 'thinking', 'training', 'worried'] as const;
        for (const state of states) {
            const { unmount } = render(<Mascot state={state} />);
            expect(screen.getByTestId('mascot')).toBeTruthy();
            unmount();
        }
    });

    it('should accept custom size', () => {
        render(<Mascot state="happy" size={64} />);
        expect(screen.getByTestId('mascot')).toBeTruthy();
    });

    it('should render the correct icon for each state', () => {
        render(<Mascot state="cheering" />);
        expect(screen.getByText('celebration')).toBeTruthy(); // MockIcon renders name as text
    });
});
