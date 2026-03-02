import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ChallengesScreen } from '../ChallengesScreen';

// Navigation mocks
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        goBack: mockGoBack,
        navigate: mockNavigate,
        push: jest.fn(),
        dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

// Mock components
jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Card: ({ children, style, testID }: any) =>
            React.createElement(View, { style, testID }, children),
        Button: ({ title, onPress, testID, disabled, style }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID, disabled },
                React.createElement(Text, null, title),
            ),
        useToast: () => ({ showToast: jest.fn() }),
    };
});

// Mock SafeAreaView to forward props including testID
jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        SafeAreaProvider: ({ children }: any) => children,
        SafeAreaView: ({ children, testID, style }: any) =>
            React.createElement(View, { testID, style }, children),
        useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    };
});

// Mock stores
jest.mock('../../../stores', () => ({
    useAuthStore: () => ({
        user: {
            id: 'user1',
            display_name: 'Test Spiller',
            club_id: 'club1',
            team_id: 'team1',
            username: 'testspiller',
            role: 'player' as const,
            admin_type: null,
            avatar_url: null,
            total_points: 100,
            current_streak: 3,
            longest_streak: 7,
            created_at: '2024-01-01',
            last_login: null,
        },
    }),
}));

// Challenge mock data
const mockPendingAsOpponent = {
    id: 'ch1',
    exercise_id: 'ex1',
    exercise_title: 'Oppvarming med ball',
    challenger_id: 'user2',
    challenger_name: 'Ola Nordmann',
    opponent_id: 'user1',
    opponent_name: 'Test Spiller',
    status: 'pending' as const,
    challenger_completed: false,
    opponent_completed: false,
    bonus_points: 10,
    created_at: '2024-06-01T10:00:00Z',
    expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
};

const mockPendingAsChallenger = {
    id: 'ch2',
    exercise_id: 'ex2',
    exercise_title: 'Styrke: Kneboey',
    challenger_id: 'user1',
    challenger_name: 'Test Spiller',
    opponent_id: 'user3',
    opponent_name: 'Kari Hansen',
    status: 'pending' as const,
    challenger_completed: false,
    opponent_completed: false,
    bonus_points: 15,
    created_at: '2024-06-01T09:00:00Z',
    expires_at: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
};

const mockAccepted = {
    id: 'ch3',
    exercise_id: 'ex3',
    exercise_title: 'Spenst: Hekkehopp',
    challenger_id: 'user1',
    challenger_name: 'Test Spiller',
    opponent_id: 'user4',
    opponent_name: 'Per Olsen',
    status: 'accepted' as const,
    challenger_completed: true,
    opponent_completed: false,
    bonus_points: 20,
    created_at: '2024-06-01T08:00:00Z',
    expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
};

const mockCompleted = {
    id: 'ch4',
    exercise_id: 'ex1',
    exercise_title: 'Oppvarming med ball',
    challenger_id: 'user1',
    challenger_name: 'Test Spiller',
    opponent_id: 'user2',
    opponent_name: 'Ola Nordmann',
    status: 'completed' as const,
    challenger_completed: true,
    opponent_completed: true,
    bonus_points: 10,
    created_at: '2024-05-20T10:00:00Z',
    expires_at: '2024-05-22T10:00:00Z',
};

const mockExpired = {
    id: 'ch5',
    exercise_id: 'ex2',
    exercise_title: 'Styrke: Kneboey',
    challenger_id: 'user5',
    challenger_name: 'Lars Berg',
    opponent_id: 'user1',
    opponent_name: 'Test Spiller',
    status: 'expired' as const,
    challenger_completed: false,
    opponent_completed: false,
    bonus_points: 15,
    created_at: '2024-05-15T10:00:00Z',
    expires_at: '2024-05-17T10:00:00Z',
};

const mockAcceptMutate = jest.fn();
const mockDeclineMutate = jest.fn();

// Mutable reference so tests can override it
let mockChallengesData = [
    mockPendingAsOpponent,
    mockPendingAsChallenger,
    mockAccepted,
    mockCompleted,
    mockExpired,
];

jest.mock('../../../hooks/useChallenges', () => ({
    useChallenges: () => ({
        data: mockChallengesData,
        isLoading: false,
    }),
    useAcceptChallenge: () => ({
        mutate: mockAcceptMutate,
    }),
    useDeclineChallenge: () => ({
        mutate: mockDeclineMutate,
    }),
}));

describe('ChallengesScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockChallengesData = [
            mockPendingAsOpponent,
            mockPendingAsChallenger,
            mockAccepted,
            mockCompleted,
            mockExpired,
        ];
    });

    // --- Rendering ---

    it('should render the screen with testID', () => {
        render(<ChallengesScreen />);
        expect(screen.getByTestId('challenges-screen')).toBeTruthy();
    });

    it('should render the screen title', () => {
        render(<ChallengesScreen />);
        expect(screen.getByText('Utfordringer')).toBeTruthy();
    });

    it('should render back button', () => {
        render(<ChallengesScreen />);
        expect(screen.getByTestId('challenges-back-button')).toBeTruthy();
    });

    it('should render active and history tabs', () => {
        render(<ChallengesScreen />);
        expect(screen.getByTestId('challenges-active-tab')).toBeTruthy();
        expect(screen.getByTestId('challenges-history-tab')).toBeTruthy();
    });

    it('should show active tab text with count', () => {
        render(<ChallengesScreen />);
        // 3 active: 2 pending + 1 accepted
        expect(screen.getByText('Aktive (3)')).toBeTruthy();
    });

    it('should show history tab text with count', () => {
        render(<ChallengesScreen />);
        // 2 history: 1 completed + 1 expired
        expect(screen.getByText('Historikk (2)')).toBeTruthy();
    });

    // --- Active tab (default) ---

    it('should show active challenges by default', () => {
        render(<ChallengesScreen />);
        const cards = screen.getAllByTestId('challenge-card');
        // 3 active challenges (2 pending + 1 accepted)
        expect(cards.length).toBe(3);
    });

    it('should display exercise title on challenge card', () => {
        render(<ChallengesScreen />);
        expect(screen.getByText('Oppvarming med ball')).toBeTruthy();
        expect(screen.getByText('Styrke: Kneboey')).toBeTruthy();
        expect(screen.getByText('Spenst: Hekkehopp')).toBeTruthy();
    });

    it('should display bonus points on challenge cards', () => {
        render(<ChallengesScreen />);
        expect(screen.getByText('+10')).toBeTruthy();
        expect(screen.getByText('+15')).toBeTruthy();
        expect(screen.getByText('+20')).toBeTruthy();
    });

    it('should display VS badge', () => {
        render(<ChallengesScreen />);
        expect(screen.getAllByText('mot').length).toBeGreaterThanOrEqual(1);
    });

    it('should display status labels', () => {
        render(<ChallengesScreen />);
        // 2 pending challenges
        expect(screen.getAllByText('Venter').length).toBe(2);
        // 1 accepted challenge
        expect(screen.getByText('Akseptert')).toBeTruthy();
    });

    it('should show "Deg" for the current user side', () => {
        render(<ChallengesScreen />);
        const degTexts = screen.getAllByText('Deg');
        expect(degTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should display opponent name when user is challenger', () => {
        render(<ChallengesScreen />);
        // ch2: user1 is challenger, opponent is Kari Hansen
        expect(screen.getByText('Kari Hansen')).toBeTruthy();
    });

    it('should display challenger name when user is opponent', () => {
        render(<ChallengesScreen />);
        // ch1: user1 is opponent, challenger is Ola Nordmann
        expect(screen.getByText('Ola Nordmann')).toBeTruthy();
    });

    // --- Accept/Decline buttons ---

    it('should show accept/decline for pending challenges where user is opponent', () => {
        render(<ChallengesScreen />);
        // Only ch1: pending + user is opponent
        const acceptButtons = screen.getAllByTestId('challenge-accept-button');
        const declineButtons = screen.getAllByTestId('challenge-decline-button');
        expect(acceptButtons.length).toBe(1);
        expect(declineButtons.length).toBe(1);
    });

    it('should show accept button text in Norwegian', () => {
        render(<ChallengesScreen />);
        expect(screen.getByText('Aksepter')).toBeTruthy();
    });

    it('should show decline button text in Norwegian', () => {
        render(<ChallengesScreen />);
        expect(screen.getByText('Avslå')).toBeTruthy();
    });

    it('should NOT show accept/decline for pending challenges where user is challenger', () => {
        render(<ChallengesScreen />);
        // ch2 is pending but user is challenger, so only 1 set of buttons (from ch1)
        const acceptButtons = screen.getAllByTestId('challenge-accept-button');
        expect(acceptButtons.length).toBe(1);
    });

    it('should call acceptChallenge.mutate when accept button pressed', () => {
        render(<ChallengesScreen />);
        const acceptButton = screen.getByTestId('challenge-accept-button');
        fireEvent.press(acceptButton);
        expect(mockAcceptMutate).toHaveBeenCalledWith('ch1', expect.objectContaining({
            onSuccess: expect.any(Function),
        }));
    });

    it('should call declineChallenge.mutate when decline button pressed', () => {
        render(<ChallengesScreen />);
        const declineButton = screen.getByTestId('challenge-decline-button');
        fireEvent.press(declineButton);
        expect(mockDeclineMutate).toHaveBeenCalledWith('ch1');
    });

    // --- Navigation ---

    it('should navigate back when back button pressed', () => {
        render(<ChallengesScreen />);
        fireEvent.press(screen.getByTestId('challenges-back-button'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    // --- Tab switching ---

    it('should switch to history tab when pressed', () => {
        render(<ChallengesScreen />);
        fireEvent.press(screen.getByTestId('challenges-history-tab'));
        // History has completed and expired challenges
        const cards = screen.getAllByTestId('challenge-card');
        expect(cards.length).toBe(2);
    });

    it('should show completed status on history tab', () => {
        render(<ChallengesScreen />);
        fireEvent.press(screen.getByTestId('challenges-history-tab'));
        expect(screen.getByText('Fullført')).toBeTruthy();
    });

    it('should show expired status on history tab', () => {
        render(<ChallengesScreen />);
        fireEvent.press(screen.getByTestId('challenges-history-tab'));
        expect(screen.getByText('Utløpt')).toBeTruthy();
    });

    it('should not show accept/decline buttons on history tab', () => {
        render(<ChallengesScreen />);
        fireEvent.press(screen.getByTestId('challenges-history-tab'));
        expect(screen.queryByTestId('challenge-accept-button')).toBeNull();
        expect(screen.queryByTestId('challenge-decline-button')).toBeNull();
    });

    it('should switch back to active tab', () => {
        render(<ChallengesScreen />);
        fireEvent.press(screen.getByTestId('challenges-history-tab'));
        fireEvent.press(screen.getByTestId('challenges-active-tab'));
        const cards = screen.getAllByTestId('challenge-card');
        expect(cards.length).toBe(3);
    });

    // --- Empty state ---

    it('should show empty state when no challenges exist', () => {
        mockChallengesData = [];
        render(<ChallengesScreen />);
        expect(screen.getByText('Ingen utfordringer ennå')).toBeTruthy();
    });

    it('should show empty state description when no challenges', () => {
        mockChallengesData = [];
        render(<ChallengesScreen />);
        expect(screen.getByText('Utfordre en lagkamerat til å gjøre en øvelse!')).toBeTruthy();
    });

    it('should show zero counts in tabs when no challenges', () => {
        mockChallengesData = [];
        render(<ChallengesScreen />);
        expect(screen.getByText('Aktive (0)')).toBeTruthy();
        expect(screen.getByText('Historikk (0)')).toBeTruthy();
    });
});
