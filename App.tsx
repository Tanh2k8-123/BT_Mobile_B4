import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { LocalizationProvider, useLocalization } from './src/localization/LocalizationContext';
import { StudentProvider, useStudents } from './src/students/StudentContext';
import { StudentDetailScreen } from './src/screens/StudentDetailScreen';
import { StudentFormScreen } from './src/screens/StudentFormScreen';
import { StudentListScreen } from './src/screens/StudentListScreen';
import { colors } from './src/theme';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, card: colors.background, text: colors.ink, border: colors.border, primary: colors.primary },
};

export default function App() {
  return (
    <LocalizationProvider>
      <StudentProvider>
        <StudentManagerApp />
      </StudentProvider>
    </LocalizationProvider>
  );
}

function StudentManagerApp() {
  const { ready: languageReady } = useLocalization();
  const { ready: studentsReady } = useStudents();
  if (!languageReady || !studentsReady) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="StudentList" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
        <Stack.Screen name="StudentList" component={StudentListScreen} />
        <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
        <Stack.Screen name="StudentForm" component={StudentFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background } });
