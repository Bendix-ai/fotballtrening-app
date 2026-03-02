import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

// Navigation mocks
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ goBack: mockGoBack, navigate: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

// Mock components with simple stubs
jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity, TextInput } = require('react-native');
    return {
        SearchBar: ({ value, onChangeText, placeholder, testID }: any) =>
            React.createElement(View, { testID },
                React.createElement(TextInput, { value, onChangeText, placeholder, testID: `${testID}-input` })
            ),
        Card: ({ children, style, testID }: any) =>
            React.createElement(View, { style, testID }, children),
        Button: ({ title, onPress, testID, loading }: any) =>
            React.createElement(TouchableOpacity, { onPress, testID, disabled: loading },
                React.createElement(Text, null, title)
            ),
        ConfirmationDialog: ({ visible, title, message, onConfirm, onCancel }: any) =>
            visible ? React.createElement(View, { testID: 'confirmation-dialog' },
                React.createElement(Text, null, title),
                React.createElement(Text, null, message),
                React.createElement(TouchableOpacity, { onPress: onConfirm, testID: 'confirm-button' },
                    React.createElement(Text, null, 'Bekreft')
                ),
                React.createElement(TouchableOpacity, { onPress: onCancel, testID: 'cancel-button' },
                    React.createElement(Text, null, 'Avbryt')
                ),
            ) : null,
        useToast: () => ({ showToast: jest.fn() }),
    };
});

// Mock data
const mockFriends = [
    {
        id: 'f1',
        friend_id: 'u1',
        display_name: 'Lansen',
        avatar_url: null,
        total_points: 500,
        current_streak: 10,
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: 'f2',
        friend_id: 'u2',
        display_name: 'Magnus',
        avatar_url: null,
        total_points: 300,
        current_streak: 5,
        created_at: '2025-01-02T00:00:00Z',
    },
];

const mockSearchResults = [
    { id: 'u3', username: 'sofie99', display_name: 'Sofie', avatar_url: null },
    { id: 'u4', username: 'erik_fotball', display_name: 'Erik', avatar_url: null },
];

const mockAddMutate = jest.fn();
const mockRemoveMutate = jest.fn();

jest.mock('../../../hooks/useFriends', () => ({
    useFriends: jest.fn(() => ({
        data: mockFriends,
        isLoading: false,
    })),
    useSearchUsers: jest.fn((query: string) => ({
        data: query.length >= 2 ? mockSearchResults : [],
        isLoading: false,
    })),
    useAddFriend: jest.fn(() => ({
        mutate: mockAddMutate,
        isPending: false,
    })),
    useRemoveFriend: jest.fn(() => ({
        mutate: mockRemoveMutate,
        isPending: false,
    })),
}));

import { FriendsScreen } from '../FriendsScreen';
import { useFriends, useSearchUsers } from '../../../hooks/useFriends';

describe('FriendsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset to default mock implementations
        (useFriends as jest.Mock).mockReturnValue({
            data: mockFriends,
            isLoading: false,
        });
        (useSearchUsers as jest.Mock).mockImplementation((query: string) => ({
            data: query.length >= 2 ? mockSearchResults : [],
            isLoading: false,
        }));
    });

    it('should render the screen with title "Venner"', () => {
        render(<FriendsScreen />);
        const vennerTexts = screen.getAllByText(/Venner/);
        expect(vennerTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should render the search bar', () => {
        render(<FriendsScreen />);
        expect(screen.getByTestId('friends-search-input')).toBeTruthy();
    });

    it('should show empty state when no friends', () => {
        (useFriends as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });
        render(<FriendsScreen />);
        expect(screen.getByText('Ingen venner ennå')).toBeTruthy();
    });

    it('should show loading indicator when loading', () => {
        (useFriends as jest.Mock).mockReturnValue({
            data: [],
            isLoading: true,
        });
        render(<FriendsScreen />);
        // When loading, the empty state should NOT be shown
        expect(screen.queryByText('Ingen venner ennå')).toBeNull();
    });

    it('should render friend list with display names', () => {
        render(<FriendsScreen />);
        expect(screen.getByText('Lansen')).toBeTruthy();
        expect(screen.getByText('Magnus')).toBeTruthy();
    });

    it('should show friend stats (points and streak)', () => {
        render(<FriendsScreen />);
        expect(screen.getByText('500')).toBeTruthy();
        expect(screen.getByText('10')).toBeTruthy();
        expect(screen.getByText('300')).toBeTruthy();
        expect(screen.getByText('5')).toBeTruthy();
    });

    it('should show confirmation dialog when remove button pressed', () => {
        render(<FriendsScreen />);
        // Dialog should not be visible initially
        expect(screen.queryByTestId('confirmation-dialog')).toBeNull();

        // Press the first remove button
        const removeButtons = screen.getAllByTestId('friend-remove-button');
        fireEvent.press(removeButtons[0]);

        // Dialog should now be visible with the friend's name as the message
        expect(screen.getByTestId('confirmation-dialog')).toBeTruthy();
        expect(screen.getByText('Fjern venn')).toBeTruthy();
        // "Lansen" appears both in the friend list and in the dialog message
        const lansenTexts = screen.getAllByText('Lansen');
        expect(lansenTexts.length).toBe(2);
    });

    it('should call removeFriendMutation when confirm is pressed', () => {
        render(<FriendsScreen />);

        // Open dialog for first friend
        const removeButtons = screen.getAllByTestId('friend-remove-button');
        fireEvent.press(removeButtons[0]);

        // Press confirm
        fireEvent.press(screen.getByTestId('confirm-button'));

        expect(mockRemoveMutate).toHaveBeenCalledWith('f1', expect.objectContaining({
            onSuccess: expect.any(Function),
        }));
    });

    it('should show search results with add button when query >= 2 chars', () => {
        render(<FriendsScreen />);

        // Type a search query of at least 2 characters
        const searchInput = screen.getByTestId('friends-search-input-input');
        fireEvent.changeText(searchInput, 'so');

        // Search results should appear
        expect(screen.getByText('Sofie')).toBeTruthy();
        expect(screen.getByText('Erik')).toBeTruthy();

        // Add button should be visible
        const addButtons = screen.getAllByText('Legg til venn');
        expect(addButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should not show search results when query < 2 chars', () => {
        render(<FriendsScreen />);

        // Type only 1 character
        const searchInput = screen.getByTestId('friends-search-input-input');
        fireEvent.changeText(searchInput, 's');

        // Search result usernames should not appear
        expect(screen.queryByText('@sofie99')).toBeNull();
        expect(screen.queryByText('@erik_fotball')).toBeNull();
    });
});
