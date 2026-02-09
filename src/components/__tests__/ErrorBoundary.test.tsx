import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>Alt fungerer</Text>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <Text>Barn</Text>
      </ErrorBoundary>
    );
    expect(screen.getByText('Barn')).toBeTruthy();
  });

  it('should show fallback UI on error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Noe gikk galt')).toBeTruthy();
    expect(screen.getByText('En uventet feil oppstod. Vennligst prøv igjen.')).toBeTruthy();
  });

  it('should show retry button', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Prøv igjen')).toBeTruthy();
  });

  it('should reset error state on retry press', () => {
    // Use a stateful wrapper to control throw behavior
    let shouldThrow = true;
    function ConditionalThrower() {
      if (shouldThrow) throw new Error('Test error');
      return <Text>Alt fungerer</Text>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    );

    expect(screen.getByText('Noe gikk galt')).toBeTruthy();

    // Stop throwing before retry
    shouldThrow = false;
    fireEvent.press(screen.getByText('Prøv igjen'));

    expect(screen.getByText('Alt fungerer')).toBeTruthy();
  });
});
