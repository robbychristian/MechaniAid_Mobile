import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screen/WelcomePage';
import Register from '../screen/Auth/Register';
import Login from '../screen/Auth/Login';
import DrawerNavigation from './DrawerNavigation';
import MechanicDrawerNavigation from './MechanicDrawerNavigation';
import RoleScreen from '../screen/Auth/RoleScreen';
import MechanicRegister from '../screen/Auth/MechanicRegister';
import { useSelector } from 'react-redux';

const AuthStack = createNativeStackNavigator();

function MainNavigation() {
  const { user } = useSelector(state => state.auth);
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Welcome" component={WelcomePage} />
        <AuthStack.Screen name="Register" component={Register} />
        <AuthStack.Screen name="RoleScreen" component={RoleScreen} />
        <AuthStack.Screen name="MechanicRegister" component={MechanicRegister} />
        <AuthStack.Screen name="Login" component={Login} />
        
        {/* Conditional Navigation based on user_role */}
        {user?.user_role == 3 && (
          <AuthStack.Screen name="DrawerStack" component={DrawerNavigation} />
        )}
        {user?.user_role == 2 && (
          <AuthStack.Screen name="MechanicDrawerStack" component={MechanicDrawerNavigation} />
        )}
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;