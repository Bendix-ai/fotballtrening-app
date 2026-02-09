import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { FAB } from '../FAB';

describe('FAB', () => {
  const onPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default add icon', () => {
    render(<FAB onPress={onPress} testID="fab" />);
    expect(screen.getByTestId('fab')).toBeTruthy();
    // Icon mock renders name as text
    expect(screen.getByText('add')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    render(<FAB onPress={onPress} testID="fab" />);
    fireEvent.press(screen.getByTestId('fab'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render custom icon', () => {
    render(<FAB onPress={onPress} icon="edit" />);
    expect(screen.getByText('edit')).toBeTruthy();
  });

  it('should render different sizes', () => {
    const { rerender } = render(<FAB onPress={onPress} size="small" testID="fab" />);
    expect(screen.getByTestId('fab')).toBeTruthy();

    rerender(<FAB onPress={onPress} size="large" testID="fab" />);
    expect(screen.getByTestId('fab')).toBeTruthy();
  });
});
