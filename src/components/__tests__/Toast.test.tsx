import React from 'react';
import { Text, Animated } from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ToastProvider, useToast } from '../Toast';

// Mock Animated to avoid useNativeDriver issues in tests
jest.spyOn(Animated, 'parallel').mockImplementation((animations: any) => ({
  start: (cb?: Animated.EndCallback) => {
    animations.forEach((a: any) => a.start?.());
    cb?.({ finished: true });
  },
  stop: jest.fn(),
  reset: jest.fn(),
}) as any);
jest.spyOn(Animated, 'timing').mockImplementation((value: any, config: any) => ({
  start: (cb?: Animated.EndCallback) => {
    value.setValue(config.toValue);
    cb?.({ finished: true });
  },
  stop: jest.fn(),
  reset: jest.fn(),
}) as any);

function TestConsumer() {
  const { showToast } = useToast();
  return (
    <Text testID="trigger" onPress={() => showToast('Test melding', 'success')}>
      Trigger
    </Text>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render children', () => {
    render(
      <ToastProvider>
        <Text>App content</Text>
      </ToastProvider>
    );
    expect(screen.getByText('App content')).toBeTruthy();
  });

  it('should show toast when triggered', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('trigger').props.onPress();
    });

    expect(screen.getByText('Test melding')).toBeTruthy();
  });

  it('should auto-dismiss toast after timeout', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('trigger').props.onPress();
    });
    expect(screen.getByText('Test melding')).toBeTruthy();

    // Advance past the dismiss timer (3000ms) + animation (200ms)
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(screen.queryByText('Test melding')).toBeNull();
  });
});
