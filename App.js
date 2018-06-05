import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNagivator } from 'react-navigation';

import Login from "./Login";
import Main from "./Main";

const RootStack = createStackNavigator(
  {
    Home: Home,
    Login: Login,
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends React.Component {
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
