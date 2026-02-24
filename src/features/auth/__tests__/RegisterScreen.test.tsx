import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from '../RegisterScreen';

// Navigation mocks
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

// Mock club service
jest.mock('../../../services/clubService', () => ({
    getClubs: jest.fn().mockResolvedValue([
        { id: 'club1', name: 'Test FK', logo_url: null, created_by: 'a', created_at: '2024-01-01' },
    ]),
    getYearGroups: jest.fn().mockResolvedValue([]),
    getTeams: jest.fn().mockResolvedValue([]),
    getAllTeamsForClub: jest.fn().mockResolvedValue([]),
}));

// Mock auth service
jest.mock('../../../services/authService', () => ({
    signUpPlayer: jest.fn().mockResolvedValue({ session: null }),
    signUpClubAdmin: jest.fn().mockResolvedValue({ session: null }),
    signUpTeamAdmin: jest.fn().mockResolvedValue({ session: null }),
    createClub: jest.fn().mockResolvedValue('new-club-id'),
}));

// Mock stores
const mockSetSelectedClubId = jest.fn();
const mockShowToast = jest.fn();

jest.mock('../../../stores', () => ({
    useAppStore: () => ({
        selectedClubId: null,
        setSelectedClubId: mockSetSelectedClubId,
    }),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TextInput, TouchableOpacity } = require('react-native');
    return {
        Card: ({ children, style }: any) => React.createElement(View, { style }, children),
        Button: ({ title, onPress, testID, loading }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID, disabled: loading },
                React.createElement(Text, null, loading ? 'Loading...' : title)
            ),
        Input: ({ label, value, onChangeText, testID, placeholder }: any) =>
            React.createElement(View, null,
                React.createElement(Text, null, label),
                React.createElement(TextInput, {
                    value,
                    onChangeText,
                    testID,
                    placeholder,
                })
            ),
        Dropdown: ({ label, testID, options, selectedValue, onValueChange, placeholder }: any) =>
            React.createElement(View, { testID },
                React.createElement(Text, null, label),
                React.createElement(Text, null, placeholder),
            ),
        useToast: () => ({ showToast: mockShowToast }),
    };
});

// Mock image require
jest.mock('../../../../assets/Fotballtrening_icon.png', () => 'mock-image');

describe('RegisterScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the app title', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('FotballTrening')).toBeTruthy();
        });
    });

    it('should render create account subtitle', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('Opprett bruker')).toBeTruthy();
        });
    });

    it('should render three-way role toggle: player, team admin, club admin', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('Spiller')).toBeTruthy();
            expect(screen.getByText('Trener')).toBeTruthy();
            expect(screen.getByText('Klubb-admin')).toBeTruthy();
        });
    });

    it('should render registration form inputs', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('register-username-input')).toBeTruthy();
            expect(screen.getByTestId('register-displayname-input')).toBeTruthy();
            expect(screen.getByTestId('register-password-input')).toBeTruthy();
            expect(screen.getByTestId('register-confirm-password-input')).toBeTruthy();
        });
    });

    it('should render the register button', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('register-button')).toBeTruthy();
        });
    });

    it('should render club dropdown in player mode', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('register-club-dropdown')).toBeTruthy();
        });
    });

    it('should render year and gender dropdowns in player mode', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('register-year-dropdown')).toBeTruthy();
            expect(screen.getByTestId('register-gender-dropdown')).toBeTruthy();
        });
    });

    it('should render link to login screen', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('Har du allerede en konto?')).toBeTruthy();
            expect(screen.getByText('Logg inn')).toBeTruthy();
        });
    });

    it('should navigate to Login when login link is pressed', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('Logg inn')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Logg inn'));
        expect(mockNavigate).toHaveBeenCalledWith('Login');
    });

    it('should render create new club link', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            // The text is split into two parts: "Klubben finnes ikke?" and "Opprett ny klubb"
            expect(screen.getByText(/Klubben finnes ikke/)).toBeTruthy();
        });
    });

    it('should hide year/gender dropdowns when switching to club admin mode', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('Klubb-admin')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Klubb-admin'));
        expect(screen.queryByTestId('register-year-dropdown')).toBeNull();
        expect(screen.queryByTestId('register-gender-dropdown')).toBeNull();
    });

    it('should allow typing into input fields', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('register-username-input')).toBeTruthy();
        });
        fireEvent.changeText(screen.getByTestId('register-username-input'), 'newuser');
        fireEvent.changeText(screen.getByTestId('register-displayname-input'), 'New User');
        fireEvent.changeText(screen.getByTestId('register-password-input'), 'pass123');
        fireEvent.changeText(screen.getByTestId('register-confirm-password-input'), 'pass123');
    });

    it('should render the register button with correct text', async () => {
        render(<RegisterScreen />);
        await waitFor(() => {
            expect(screen.getByText('Opprett konto')).toBeTruthy();
        });
    });
});
