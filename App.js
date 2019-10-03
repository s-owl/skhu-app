import React, { Component } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import NavigationService from './src/tools/NavigationService';

import Login from './src/Login';
import MainShell from './src/MainShell';
import About from './src/screens/about';

import { Asset } from 'expo-asset';
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


export default class App extends Component {
  render() {
    return (
      <AppContainer ref={(navRef)=>{
        NavigationService.setTopLevelNavigator(navRef);
      }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
