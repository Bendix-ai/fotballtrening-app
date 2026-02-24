import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ConfirmationDialog } from '../ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  const defaultProps = {
    visible: true,
    title: 'Bekreft sletting',
    message: 'Er du sikker på at du vil slette?',
    onConfirm,
    onCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and message when visible', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    expect(screen.getByText('Bekreft sletting')).toBeTruthy();
    expect(screen.getByText('Er du sikker på at du vil slette?')).toBeTruthy();
  });

  it('should render confirm and cancel buttons', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    expect(screen.getByTestId('confirmation-confirm-button')).toBeTruthy();
    expect(screen.getByTestId('confirmation-cancel-button')).toBeTruthy();
  });

  it('should use default confirm label "OK"', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    expect(screen.getByText('OK')).toBeTruthy();
  });

  it('should use custom confirm label when provided', () => {
    render(<ConfirmationDialog {...defaultProps} confirmLabel="Slett" />);
    expect(screen.getByText('Slett')).toBeTruthy();
  });

  it('should use i18n cancel label by default', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    // The default cancel label comes from t('common.cancel') which is 'Avbryt'
    expect(screen.getByText('Avbryt')).toBeTruthy();
  });

  it('should use custom cancel label when provided', () => {
    render(<ConfirmationDialog {...defaultProps} cancelLabel="Nei takk" />);
    expect(screen.getByText('Nei takk')).toBeTruthy();
  });

  it('should call onConfirm when confirm button is pressed', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    fireEvent.press(screen.getByTestId('confirmation-confirm-button'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is pressed', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    fireEvent.press(screen.getByTestId('confirmation-cancel-button'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should not render content when not visible', () => {
    render(<ConfirmationDialog {...defaultProps} visible={false} />);
    expect(screen.queryByText('Bekreft sletting')).toBeNull();
  });

  it('should render with destructive prop without errors', () => {
    render(<ConfirmationDialog {...defaultProps} destructive />);
    expect(screen.getByText('Bekreft sletting')).toBeTruthy();
  });
});
