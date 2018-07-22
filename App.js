import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import NavigationService from './src/tools/NavigationService';

import Login from './src/Login';
import MainShell from './src/MainShell';

const RootStack = createStackNavigator(
  {
    Main: MainShell,
    Login: Login,
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends Component {
  render() {
    return <RootStack ref={(navRef)=>{
      NavigationService.setTopLevelNavigator(navRef);
    }}/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
