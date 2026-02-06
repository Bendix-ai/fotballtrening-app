import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExercisesStackParamList } from '../types';
import { ExercisesScreen } from '../features/exercises/ExercisesScreen';
import { ExerciseDetailScreen } from '../features/exercises/ExerciseDetailScreen';
import { ExerciseExecutionScreen } from '../features/exercises/ExerciseExecutionScreen';
import { ExerciseCompleteScreen } from '../features/exercises/ExerciseCompleteScreen';

const Stack = createNativeStackNavigator<ExercisesStackParamList>();

export function ExercisesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExercisesList" component={ExercisesScreen} />
            <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
            <Stack.Screen
                name="ExerciseExecution"
                component={ExerciseExecutionScreen}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="ExerciseComplete"
                component={ExerciseCompleteScreen}
                options={{ gestureEnabled: false }}
            />
        </Stack.Navigator>
    );
}
