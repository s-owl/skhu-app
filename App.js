import React from 'react';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import BuildConfigs from './src/config';

import Login from './src/Login';
import MainShell from './src/MainShell';
import About from './src/screens/about';
import * as Sentry from 'sentry-expo';

import {Asset} from 'expo-asset';
Asset;

const AuthStack = createStackNavigator(
  {
    Login: Login,
    About: About
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      MainStack: MainShell,
      AuthStack: AuthStack,
    },
    {
      initialRouteName: 'AuthStack',
    }
  )
);

Sentry.init({
  dsn: BuildConfigs.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: true
});

export default function App(){
  let colorScheme = useColorScheme();
  return (
    <AppearanceProvider>
      <AppContainer 
        theme={colorScheme}/>
    </AppearanceProvider>
  );
  
}

