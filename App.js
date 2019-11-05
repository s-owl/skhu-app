import React, {Component} from 'react';
import {AppearanceProvider} from 'react-native-appearance';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import NavigationService from './src/tools/NavigationService';
import BuildConfigs from './src/config';

import Login from './src/Login';
import MainShell from './src/MainShell';
import About from './src/screens/about';
import * as Sentry from 'sentry-expo';

import {Asset} from 'expo-asset';
Asset;

const RootStack = createStackNavigator(
  {
    Main: MainShell,
    Login: Login,
    About: About
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(RootStack);

Sentry.init({
  dsn: BuildConfigs.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: true
});

export default class App extends Component {
  render() {
    return (
      <AppearanceProvider>
        <AppContainer ref={(navRef)=>{
          NavigationService.setTopLevelNavigator(navRef);
        }}/>
      </AppearanceProvider>
    );
  }
}

