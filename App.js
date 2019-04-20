import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import NavigationService from './src/tools/NavigationService';

import Login from './src/Login';
import MainShell from './src/MainShell';
import About from './src/screens/about';

import { Asset } from 'expo';
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
