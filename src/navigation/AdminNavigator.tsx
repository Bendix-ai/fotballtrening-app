import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AdminDrawerParamList } from '../types';
import { AdminDrawerContent } from './AdminDrawerContent';

import { DashboardScreen } from '../features/admin/DashboardScreen';
import { PlayersManagementScreen } from '../features/admin/PlayersManagementScreen';
import { ClubStructureScreen } from '../features/admin/ClubStructureScreen';
import { ExercisesManagementScreen } from '../features/admin/ExercisesManagementScreen';
import { ExerciseStoreScreen } from '../features/admin/ExerciseStoreScreen';
import { ReportsScreen } from '../features/admin/ReportsScreen';
import { AdminSettingsScreen } from '../features/admin/AdminSettingsScreen';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export function AdminNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <AdminDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                swipeEnabled: true,
            }}
        >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="Players" component={PlayersManagementScreen} />
            <Drawer.Screen name="ClubStructure" component={ClubStructureScreen} />
            <Drawer.Screen name="Exercises" component={ExercisesManagementScreen} />
            <Drawer.Screen name="ExerciseStore" component={ExerciseStoreScreen} />
            <Drawer.Screen name="Reports" component={ReportsScreen} />
            <Drawer.Screen name="AdminSettings" component={AdminSettingsScreen} />
        </Drawer.Navigator>
    );
}
