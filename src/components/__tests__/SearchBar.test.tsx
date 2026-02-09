import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const onChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default placeholder', () => {
    render(<SearchBar value="" onChangeText={onChangeText} />);
    expect(screen.getByPlaceholderText('Søk...')).toBeTruthy();
  });

  it('should render with custom placeholder', () => {
    render(<SearchBar value="" onChangeText={onChangeText} placeholder="Søk etter øvelser" />);
    expect(screen.getByPlaceholderText('Søk etter øvelser')).toBeTruthy();
  });

  it('should call onChangeText on input', () => {
    render(<SearchBar value="" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Søk...'), 'pasning');
    expect(onChangeText).toHaveBeenCalledWith('pasning');
  });

  it('should show clear button when value is non-empty', () => {
    render(<SearchBar value="noe" onChangeText={onChangeText} />);
    // The close icon should be rendered (mock renders text "close")
    expect(screen.getByText('close')).toBeTruthy();
  });

  it('should not show clear button when value is empty', () => {
    render(<SearchBar value="" onChangeText={onChangeText} />);
    expect(screen.queryByText('close')).toBeNull();
  });

  it('should clear text when clear button pressed', () => {
    render(<SearchBar value="test" onChangeText={onChangeText} />);
    fireEvent.press(screen.getByText('close'));
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});
