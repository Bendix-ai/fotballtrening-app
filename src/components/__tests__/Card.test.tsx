import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Card } from '../Card';

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <Text>Innhold</Text>
      </Card>
    );
    expect(screen.getByText('Innhold')).toBeTruthy();
  });

  it('should render title', () => {
    render(
      <Card title="Tittel">
        <Text>Innhold</Text>
      </Card>
    );
    expect(screen.getByText('Tittel')).toBeTruthy();
  });

  it('should render subtitle', () => {
    render(
      <Card title="Tittel" subtitle="Undertittel">
        <Text>Innhold</Text>
      </Card>
    );
    expect(screen.getByText('Undertittel')).toBeTruthy();
  });

  it('should not render header when no title/subtitle', () => {
    render(
      <Card>
        <Text>Bare innhold</Text>
      </Card>
    );
    expect(screen.queryByText('Tittel')).toBeNull();
  });

  it('should render with different padding sizes', () => {
    const { rerender } = render(
      <Card padding="small"><Text>Test</Text></Card>
    );
    expect(screen.getByText('Test')).toBeTruthy();

    rerender(<Card padding="none"><Text>Test</Text></Card>);
    expect(screen.getByText('Test')).toBeTruthy();

    rerender(<Card padding="large"><Text>Test</Text></Card>);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
