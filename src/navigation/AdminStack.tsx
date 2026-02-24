import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../types';
import { AdminNavigator } from './AdminNavigator';
import { AddEditPlayerScreen } from '../features/admin/AddEditPlayerScreen';
import { AddEditExerciseScreen } from '../features/admin/AddEditExerciseScreen';
import { AddYearGroupScreen } from '../features/admin/AddYearGroupScreen';
import { ExercisePreviewScreen } from '../features/admin/ExercisePreviewScreen';
import { ExerciseStoreDetailScreen } from '../features/admin/ExerciseStoreDetailScreen';
import { PlayerDetailScreen } from '../features/admin/PlayerDetailScreen';
import { HelpCenterScreen } from '../features/admin/HelpCenterScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AdminDrawer" component={AdminNavigator} options={{ gestureEnabled: false }} />
            <Stack.Screen
                name="AddEditPlayer"
                component={AddEditPlayerScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="AddEditExercise"
                component={AddEditExerciseScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="AddYearGroup"
                component={AddYearGroupScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="ExercisePreview"
                component={ExercisePreviewScreen}
            />
            <Stack.Screen
                name="ExerciseStoreDetail"
                component={ExerciseStoreDetailScreen}
            />
            <Stack.Screen
                name="PlayerDetail"
                component={PlayerDetailScreen}
            />
            <Stack.Screen
                name="HelpCenter"
                component={HelpCenterScreen}
            />
        </Stack.Navigator>
    );
}
