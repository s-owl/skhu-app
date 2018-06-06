import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Login from "./Login";
import Main from "./Main";

const RootStack = createStackNavigator(
  {
    Main: Main,
    Login: Login,
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends Component {
  render() {
		return <RootStack />;
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
