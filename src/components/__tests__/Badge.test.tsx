import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('should render label text', () => {
    render(<Badge label="Lett" />);
    expect(screen.getByText('Lett')).toBeTruthy();
  });

  it('should render easy variant', () => {
    render(<Badge label="Enkel" variant="easy" />);
    expect(screen.getByText('Enkel')).toBeTruthy();
  });

  it('should render medium variant', () => {
    render(<Badge label="Medium" variant="medium" />);
    expect(screen.getByText('Medium')).toBeTruthy();
  });

  it('should render hard variant', () => {
    render(<Badge label="Vanskelig" variant="hard" />);
    expect(screen.getByText('Vanskelig')).toBeTruthy();
  });

  it('should render category variant', () => {
    render(<Badge label="Pasning" variant="category" />);
    expect(screen.getByText('Pasning')).toBeTruthy();
  });

  it('should render points variant', () => {
    render(<Badge label="100 poeng" variant="points" />);
    expect(screen.getByText('100 poeng')).toBeTruthy();
  });

  it('should render with custom colors', () => {
    render(<Badge label="Custom" color="#FF0000" backgroundColor="#FFEEEE" />);
    expect(screen.getByText('Custom')).toBeTruthy();
  });

  it('should render small size', () => {
    render(<Badge label="Liten" size="small" />);
    expect(screen.getByText('Liten')).toBeTruthy();
  });
});
