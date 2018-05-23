import React, { Component } from 'react';
import { 
    StyleSheet, Text ,View, Image, TextInput,
    TouchableWithoutFeedback, StatusBar, SafeAreaView,
    Keyboard, TouchableOpacity, KeyboardAvoidingView
  } from 'react-native';
export default class Main extends Component {
    render() {
        return(
            <View ref={ 'go_to_main' }>
                <Text>메인화면</Text>
            </View>
        );
    }
  }