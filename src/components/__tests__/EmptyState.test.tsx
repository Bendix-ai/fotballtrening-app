import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  const onAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and description', () => {
    render(
      <EmptyState
        icon="sports-soccer"
        title="Ingen øvelser"
        description="Det finnes ingen øvelser ennå."
      />
    );
    expect(screen.getByText('Ingen øvelser')).toBeTruthy();
    expect(screen.getByText('Det finnes ingen øvelser ennå.')).toBeTruthy();
  });

  it('should render the icon', () => {
    render(
      <EmptyState
        icon="sports-soccer"
        title="Ingen øvelser"
        description="Ingen data"
      />
    );
    // The mocked MaterialIcons renders the icon name as text
    expect(screen.getByText('sports-soccer')).toBeTruthy();
  });

  it('should render action button when actionLabel and onAction are provided', () => {
    render(
      <EmptyState
        icon="add"
        title="Ingen spillere"
        description="Legg til din første spiller"
        actionLabel="Legg til spiller"
        onAction={onAction}
      />
    );
    expect(screen.getByText('Legg til spiller')).toBeTruthy();
  });

  it('should call onAction when action button is pressed', () => {
    render(
      <EmptyState
        icon="add"
        title="Ingen spillere"
        description="Legg til din første spiller"
        actionLabel="Legg til spiller"
        onAction={onAction}
      />
    );
    fireEvent.press(screen.getByText('Legg til spiller'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when actionLabel is missing', () => {
    render(
      <EmptyState
        icon="add"
        title="Ingen spillere"
        description="Ingen data"
        onAction={onAction}
      />
    );
    // No button should be rendered since actionLabel is not provided
    expect(screen.queryByText('Legg til spiller')).toBeNull();
  });

  it('should not render action button when onAction is missing', () => {
    render(
      <EmptyState
        icon="add"
        title="Ingen spillere"
        description="Ingen data"
        actionLabel="Legg til spiller"
      />
    );
    // Button should not render since onAction is not provided
    // The component checks: actionLabel && onAction
    // onAction is undefined so the button is not rendered
    // We verify by checking the button text should still appear (since actionLabel is truthy)
    // Actually, the condition is: actionLabel && onAction, and onAction is undefined = falsy
    expect(screen.queryByText('Legg til spiller')).toBeNull();
  });

  it('should render with different icons', () => {
    const { rerender } = render(
      <EmptyState icon="sports-soccer" title="Test" description="Desc" />
    );
    expect(screen.getByText('sports-soccer')).toBeTruthy();

    rerender(
      <EmptyState icon="star" title="Test" description="Desc" />
    );
    expect(screen.getByText('star')).toBeTruthy();
  });
});
