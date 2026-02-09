import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Dropdown } from '../Dropdown';

const options = [
  { value: '2015', label: '2015' },
  { value: '2014', label: '2014' },
  { value: '2013', label: '2013' },
];

describe('Dropdown', () => {
  const onValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render placeholder when no selection', () => {
    render(
      <Dropdown options={options} selectedValue={null} onValueChange={onValueChange} />
    );
    expect(screen.getByText('Velg...')).toBeTruthy();
  });

  it('should render custom placeholder', () => {
    render(
      <Dropdown
        options={options}
        selectedValue={null}
        onValueChange={onValueChange}
        placeholder="Velg årgang"
      />
    );
    expect(screen.getByText('Velg årgang')).toBeTruthy();
  });

  it('should display selected value label', () => {
    render(
      <Dropdown options={options} selectedValue="2015" onValueChange={onValueChange} />
    );
    expect(screen.getByText('2015')).toBeTruthy();
  });

  it('should render label', () => {
    render(
      <Dropdown
        label="Årgang"
        options={options}
        selectedValue={null}
        onValueChange={onValueChange}
      />
    );
    expect(screen.getByText('Årgang')).toBeTruthy();
  });

  it('should show error', () => {
    render(
      <Dropdown
        options={options}
        selectedValue={null}
        onValueChange={onValueChange}
        error="Velg en verdi"
      />
    );
    expect(screen.getByText('Velg en verdi')).toBeTruthy();
  });

  it('should open modal on press', () => {
    render(
      <Dropdown options={options} selectedValue={null} onValueChange={onValueChange} />
    );
    fireEvent.press(screen.getByText('Velg...'));
    // After opening, options should be visible
    expect(screen.getByText('2014')).toBeTruthy();
    expect(screen.getByText('2013')).toBeTruthy();
  });

  it('should call onValueChange when option selected', () => {
    render(
      <Dropdown options={options} selectedValue={null} onValueChange={onValueChange} />
    );
    // Open dropdown
    fireEvent.press(screen.getByText('Velg...'));
    // Select an option
    fireEvent.press(screen.getByText('2014'));
    expect(onValueChange).toHaveBeenCalledWith('2014');
  });
});
