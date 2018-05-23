import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigatorIOS } from 'react-native';

import Login from "./Login";
import Main from "./Main";

export default class App extends Component {
  render() {
    return (
        <Login>
          <Main />
        </Login>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
