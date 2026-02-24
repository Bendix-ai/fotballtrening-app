import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('should render with placeholder', () => {
    render(<Input placeholder="Skriv her" />);
    expect(screen.getByPlaceholderText('Skriv her')).toBeTruthy();
  });

  it('should render label', () => {
    render(<Input label="Brukernavn" />);
    expect(screen.getByText('Brukernavn')).toBeTruthy();
  });

  it('should display error message', () => {
    render(<Input error="Ugyldig verdi" />);
    expect(screen.getByText('Ugyldig verdi')).toBeTruthy();
  });

  it('should not show error when no error', () => {
    render(<Input placeholder="Test" />);
    expect(screen.queryByText('Ugyldig verdi')).toBeNull();
  });

  it('should call onChangeText', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder="Test" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Test'), 'hei');
    expect(onChangeText).toHaveBeenCalledWith('hei');
  });

  it('should render password toggle for secure fields', () => {
    render(<Input secureTextEntry placeholder="Passord" />);
    // Password toggle icon should be present (rendered as Text mock with "visibility")
    expect(screen.getByText('visibility')).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    render(<Input secureTextEntry placeholder="Passord" />);
    // Initially shows "visibility" icon
    expect(screen.getByText('visibility')).toBeTruthy();
    fireEvent.press(screen.getByText('visibility'));
    // After toggle, shows "visibility-off" and "visibility" is gone
    expect(screen.getByText('visibility-off')).toBeTruthy();
    expect(screen.queryByText('visibility')).toBeNull();
  });
});
