import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Login from './Login';
import MainShell from './MainShell';

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
		return <RootStack />;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
