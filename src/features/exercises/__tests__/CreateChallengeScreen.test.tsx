import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';

// Disable native driver for all Animated operations in tests
const originalTiming = Animated.timing;
const originalSpring = Animated.spring;

beforeAll(() => {
    (Animated as any).timing = (value: any, config: any) =>
        originalTiming(value, { ...config, useNativeDriver: false });
    (Animated as any).spring = (value: any, config: any) =>
        originalSpring(value, { ...config, useNativeDriver: false });
});

afterAll(() => {
    (Animated as any).timing = originalTiming;
    (Animated as any).spring = originalSpring;
});

import { CreateChallengeScreen } from '../CreateChallengeScreen';

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
    useRoute: () => ({
        params: { exerciseId: 'ex1' },
    }),
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
        Button: ({ title, onPress, testID, disabled, loading }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID, disabled, accessibilityState: { disabled: !!disabled } },
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

// Mock data
const mockExercise = {
    id: 'ex1',
    title: 'Oppvarming med ball',
    description: 'Lett oppvarming med fotball.',
    instructions: 'Start med lett jogging.',
    image_url: null,
    video_url: null,
    duration_seconds: 120,
    difficulty: 'easy' as const,
    category: 'warmup' as const,
    points: 10,
    is_public: true,
    created_by_club_id: null,
    equipment: '',
    assigned_team_ids: null,
    created_at: '2024-01-01',
};

// Mutable references for overriding in tests
let mockFriendsData: { friend_id: string; display_name: string; friendship_id: string }[] = [
    { friend_id: 'f1', display_name: 'Ola Vansen', friendship_id: 'fs1' },
    { friend_id: 'f2', display_name: 'Kari Norberg', friendship_id: 'fs2' },
];

let mockTeammatesData: { id: string; display_name: string }[] = [
    { id: 'f1', display_name: 'Ola Vansen' },  // Also a friend
    { id: 't1', display_name: 'Per Andersen' },
    { id: 't2', display_name: 'Lars Johansen' },
];

let mockLoadingTeammates = false;
let mockLoadingFriends = false;
let mockExerciseData: typeof mockExercise | null = mockExercise;

const mockCreateMutate = jest.fn();
let mockIsPending = false;

jest.mock('../../../hooks/useChallenges', () => ({
    useTeammates: () => ({
        data: mockTeammatesData,
        isLoading: mockLoadingTeammates,
    }),
    useCreateChallenge: () => ({
        mutate: mockCreateMutate,
        isPending: mockIsPending,
    }),
}));

jest.mock('../../../hooks/useFriends', () => ({
    useFriends: () => ({
        data: mockFriendsData,
        isLoading: mockLoadingFriends,
    }),
}));

jest.mock('../../../hooks/useExercises', () => ({
    useExercise: () => ({
        data: mockExerciseData,
    }),
}));

describe('CreateChallengeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFriendsData = [
            { friend_id: 'f1', display_name: 'Ola Vansen', friendship_id: 'fs1' },
            { friend_id: 'f2', display_name: 'Kari Norberg', friendship_id: 'fs2' },
        ];
        mockTeammatesData = [
            { id: 'f1', display_name: 'Ola Vansen' },
            { id: 't1', display_name: 'Per Andersen' },
            { id: 't2', display_name: 'Lars Johansen' },
        ];
        mockLoadingTeammates = false;
        mockLoadingFriends = false;
        mockExerciseData = mockExercise;
        mockIsPending = false;
    });

    // --- Rendering ---

    it('should render the screen with testID', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByTestId('create-challenge-screen')).toBeTruthy();
    });

    it('should render back button', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByTestId('create-challenge-back-button')).toBeTruthy();
    });

    it('should render the title', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Utfordre en venn')).toBeTruthy();
    });

    it('should render the exercise info card', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Oppvarming med ball')).toBeTruthy();
    });

    it('should render select opponent heading', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Velg motstander')).toBeTruthy();
    });

    it('should render the send challenge button', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByTestId('send-challenge-button')).toBeTruthy();
        expect(screen.getByText('Send utfordring')).toBeTruthy();
    });

    // --- Sections ---

    it('should render friends section header', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Venner')).toBeTruthy();
    });

    it('should render teammates section header', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Lagkamerater')).toBeTruthy();
    });

    it('should render friend items', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Ola Vansen')).toBeTruthy();
        expect(screen.getByText('Kari Norberg')).toBeTruthy();
    });

    it('should render teammate items that are not friends', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('Per Andersen')).toBeTruthy();
        expect(screen.getByText('Lars Johansen')).toBeTruthy();
    });

    it('should not duplicate a friend in the teammates section', () => {
        render(<CreateChallengeScreen />);
        // Ola Vansen (f1) is both friend and teammate, should appear once (in friends)
        const olaItems = screen.getAllByText('Ola Vansen');
        expect(olaItems.length).toBe(1);
    });

    it('should render testIDs for teammate/friend items', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByTestId('teammate-f1')).toBeTruthy();
        expect(screen.getByTestId('teammate-f2')).toBeTruthy();
        expect(screen.getByTestId('teammate-t1')).toBeTruthy();
        expect(screen.getByTestId('teammate-t2')).toBeTruthy();
    });

    it('should show avatar initials for each player', () => {
        render(<CreateChallengeScreen />);
        expect(screen.getByText('O')).toBeTruthy(); // Ola
        expect(screen.getByText('K')).toBeTruthy(); // Kari
        expect(screen.getByText('P')).toBeTruthy(); // Per
        expect(screen.getByText('L')).toBeTruthy(); // Lars
    });

    // --- Selection ---

    it('should have send button disabled initially (no selection)', () => {
        render(<CreateChallengeScreen />);
        const sendButton = screen.getByTestId('send-challenge-button');
        expect(sendButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable send button after selecting an opponent', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('teammate-t1'));
        const sendButton = screen.getByTestId('send-challenge-button');
        expect(sendButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should select a friend as opponent', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('teammate-f1'));
        const sendButton = screen.getByTestId('send-challenge-button');
        expect(sendButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should allow changing selection', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('teammate-t1'));
        fireEvent.press(screen.getByTestId('teammate-t2'));
        const sendButton = screen.getByTestId('send-challenge-button');
        expect(sendButton.props.accessibilityState?.disabled).toBe(false);
    });

    // --- Send challenge ---

    it('should call createChallenge.mutate with correct params when send pressed', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('teammate-t1'));
        fireEvent.press(screen.getByTestId('send-challenge-button'));
        expect(mockCreateMutate).toHaveBeenCalledWith(
            {
                opponentId: 't1',
                opponentName: 'Per Andersen',
                exerciseId: 'ex1',
                exerciseTitle: 'Oppvarming med ball',
            },
            expect.objectContaining({
                onSuccess: expect.any(Function),
            }),
        );
    });

    it('should call createChallenge.mutate with friend params when friend selected', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('teammate-f2'));
        fireEvent.press(screen.getByTestId('send-challenge-button'));
        expect(mockCreateMutate).toHaveBeenCalledWith(
            {
                opponentId: 'f2',
                opponentName: 'Kari Norberg',
                exerciseId: 'ex1',
                exerciseTitle: 'Oppvarming med ball',
            },
            expect.objectContaining({
                onSuccess: expect.any(Function),
            }),
        );
    });

    it('should not call mutate when no opponent selected', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('send-challenge-button'));
        expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    // --- Navigation ---

    it('should navigate back when back button pressed', () => {
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('create-challenge-back-button'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    // --- Loading state ---

    it('should not show section headers when teammates are loading', () => {
        mockLoadingTeammates = true;
        mockLoadingFriends = false;
        render(<CreateChallengeScreen />);
        expect(screen.queryByText('Venner')).toBeNull();
        expect(screen.queryByText('Lagkamerater')).toBeNull();
    });

    it('should not show section headers when friends are loading', () => {
        mockLoadingTeammates = false;
        mockLoadingFriends = true;
        render(<CreateChallengeScreen />);
        expect(screen.queryByText('Venner')).toBeNull();
        expect(screen.queryByText('Lagkamerater')).toBeNull();
    });

    // --- No friends ---

    it('should only show teammates section when user has no friends', () => {
        mockFriendsData = [];
        render(<CreateChallengeScreen />);
        expect(screen.queryByText('Venner')).toBeNull();
        expect(screen.getByText('Lagkamerater')).toBeTruthy();
        expect(screen.getByText('Per Andersen')).toBeTruthy();
        expect(screen.getByText('Lars Johansen')).toBeTruthy();
    });

    it('should show all teammates including friend-overlaps when no friends', () => {
        mockFriendsData = [];
        render(<CreateChallengeScreen />);
        // With no friends, all teammates show in teammates section (including f1/Ola Vansen)
        expect(screen.getByText('Ola Vansen')).toBeTruthy();
        expect(screen.getByText('Per Andersen')).toBeTruthy();
        expect(screen.getByText('Lars Johansen')).toBeTruthy();
    });

    // --- Exercise not loaded ---

    it('should not show exercise card when exercise data is null', () => {
        mockExerciseData = null;
        render(<CreateChallengeScreen />);
        expect(screen.queryByText('Oppvarming med ball')).toBeNull();
    });

    it('should not send challenge when exercise is null', () => {
        mockExerciseData = null;
        render(<CreateChallengeScreen />);
        fireEvent.press(screen.getByTestId('teammate-t1'));
        fireEvent.press(screen.getByTestId('send-challenge-button'));
        expect(mockCreateMutate).not.toHaveBeenCalled();
    });
});
