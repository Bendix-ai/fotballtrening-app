import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AdminHeader } from '../AdminHeader';

const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
      push: jest.fn(),
      dispatch: mockDispatch,
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});

describe('AdminHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title text', () => {
    render(<AdminHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });

  it('should render the menu button with testID', () => {
    render(<AdminHeader title="Spillere" />);
    expect(screen.getByTestId('admin-menu-button')).toBeTruthy();
  });

  it('should dispatch openDrawer when menu button is pressed', () => {
    render(<AdminHeader title="Innstillinger" />);
    fireEvent.press(screen.getByTestId('admin-menu-button'));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should render with different titles', () => {
    const { rerender } = render(<AdminHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeTruthy();

    rerender(<AdminHeader title="Øvelser" />);
    expect(screen.getByText('Øvelser')).toBeTruthy();

    rerender(<AdminHeader title="Rapporter" />);
    expect(screen.getByText('Rapporter')).toBeTruthy();
  });

  it('should render the menu icon', () => {
    render(<AdminHeader title="Test" />);
    // The mocked MaterialIcons renders the icon name as text
    expect(screen.getByText('menu')).toBeTruthy();
  });
});
