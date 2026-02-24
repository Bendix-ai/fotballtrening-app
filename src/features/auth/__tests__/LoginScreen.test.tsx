import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

// Navigation mocks
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
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
        { id: 'club2', name: 'Other FK', logo_url: null, created_by: 'b', created_at: '2024-01-01' },
    ]),
    getYearGroups: jest.fn().mockResolvedValue([
        { value: 'yg1', label: '2015' },
    ]),
    getTeams: jest.fn().mockResolvedValue([
        { value: 'boys', label: 'Gutter', teamId: 'team1' },
    ]),
}));

// Mock auth service
jest.mock('../../../services/authService', () => ({
    loginPlayer: jest.fn().mockResolvedValue({ session: null }),
    loginAdmin: jest.fn().mockResolvedValue({ session: null }),
    getProfile: jest.fn().mockResolvedValue(null),
}));

// Mock stores
const mockSetUser = jest.fn();
const mockSetClub = jest.fn();
const mockSetTeam = jest.fn();
const mockSetManagedTeamIds = jest.fn();
const mockSetSelectedClubId = jest.fn();
const mockShowToast = jest.fn();

jest.mock('../../../stores', () => ({
    useAuthStore: () => ({
        setUser: mockSetUser,
        setClub: mockSetClub,
        setTeam: mockSetTeam,
        setManagedTeamIds: mockSetManagedTeamIds,
    }),
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

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the app title', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('FotballTrening')).toBeTruthy();
        });
    });

    it('should render welcome message after loading', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Velkommen tilbake!')).toBeTruthy();
        });
    });

    it('should render player and admin toggle buttons', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Spiller')).toBeTruthy();
            expect(screen.getByText('Admin')).toBeTruthy();
        });
    });

    it('should render login form inputs', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('login-username')).toBeTruthy();
            expect(screen.getByTestId('login-password')).toBeTruthy();
        });
    });

    it('should render the login button', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('login-button')).toBeTruthy();
        });
    });

    it('should render club, year, and gender dropdowns in player mode', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('login-club-dropdown')).toBeTruthy();
            expect(screen.getByTestId('login-year-dropdown')).toBeTruthy();
            expect(screen.getByTestId('login-gender-dropdown')).toBeTruthy();
        });
    });

    it('should render forgot password link', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Glemt passord?')).toBeTruthy();
        });
    });

    it('should render create account link', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Opprett konto')).toBeTruthy();
        });
    });

    it('should navigate to Register when create account is pressed', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Opprett konto')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Opprett konto'));
        expect(mockNavigate).toHaveBeenCalledWith('Register');
    });

    it('should switch to admin mode when admin toggle is pressed', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Admin')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Admin'));
        // In admin mode, club/year/gender dropdowns should not be rendered
        expect(screen.queryByTestId('login-club-dropdown')).toBeNull();
        expect(screen.queryByTestId('login-year-dropdown')).toBeNull();
        expect(screen.queryByTestId('login-gender-dropdown')).toBeNull();
    });

    it('should allow typing username and password', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByTestId('login-username')).toBeTruthy();
        });
        fireEvent.changeText(screen.getByTestId('login-username'), 'testuser');
        fireEvent.changeText(screen.getByTestId('login-password'), 'password123');
    });

    it('should navigate to ForgotPassword in admin mode when forgot password pressed', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Admin')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Admin'));
        fireEvent.press(screen.getByText('Glemt passord?'));
        expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('should show toast for player forgot password', async () => {
        render(<LoginScreen />);
        await waitFor(() => {
            expect(screen.getByText('Glemt passord?')).toBeTruthy();
        });
        // Player mode is default
        fireEvent.press(screen.getByText('Glemt passord?'));
        expect(mockShowToast).toHaveBeenCalledWith(
            'Kontakt treneren din for å få nytt passord',
            'info'
        );
    });
});
