import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screen/WelcomePage';
import Register from '../screen/Auth/Register';
import Login from '../screen/Auth/Login';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerNavigation from './DrawerNavigation';

const AuthStack = createNativeStackNavigator();

function MainNavigation() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Welcome" component={WelcomePage} />
        <AuthStack.Screen name="Register" component={Register} />
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="DrawerStack" component={DrawerNavigation} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;