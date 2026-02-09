import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  const onPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title text', () => {
    render(<Button title="Trykk her" onPress={onPress} />);
    expect(screen.getByText('Trykk her')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    render(<Button title="Klikk" onPress={onPress} />);
    fireEvent.press(screen.getByText('Klikk'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    render(<Button title="Klikk" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Klikk'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should show ActivityIndicator when loading', () => {
    const { UNSAFE_getByType } = render(
      <Button title="Laster" onPress={onPress} loading />
    );
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should not show title when loading', () => {
    render(<Button title="Laster" onPress={onPress} loading />);
    expect(screen.queryByText('Laster')).toBeNull();
  });

  it('should be disabled when loading', () => {
    const { UNSAFE_getByType } = render(
      <Button title="Laster" onPress={onPress} loading />
    );
    const { TouchableOpacity } = require('react-native');
    const button = UNSAFE_getByType(TouchableOpacity);
    expect(button.props.disabled).toBe(true);
  });

  it('should render with primary variant by default', () => {
    render(<Button title="Primary" onPress={onPress} />);
    expect(screen.getByText('Primary')).toBeTruthy();
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button title="Test" onPress={onPress} variant="secondary" />);
    expect(screen.getByText('Test')).toBeTruthy();

    rerender(<Button title="Test" onPress={onPress} variant="outline" />);
    expect(screen.getByText('Test')).toBeTruthy();

    rerender(<Button title="Test" onPress={onPress} variant="ghost" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Button title="Test" onPress={onPress} size="small" />);
    expect(screen.getByText('Test')).toBeTruthy();

    rerender(<Button title="Test" onPress={onPress} size="large" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('should render icon when provided', () => {
    const icon = <React.Fragment />;
    render(<Button title="Med ikon" onPress={onPress} icon={icon} />);
    expect(screen.getByText('Med ikon')).toBeTruthy();
  });
});
