import React, { Component } from 'react';
import { 
    StyleSheet, Text ,View, Image, TextInput,
    TouchableWithoutFeedback, StatusBar, SafeAreaView,
    Keyboard, TouchableOpacity, KeyboardAvoidingView
  } from 'react-native';
import { createStackNagivator } from 'react-navigation';
import  {CardView}  from './components';

export default class Main extends Component {
    render() {
        return(
            <View>
                
                <CardView>
                <Text>메인화면</Text>
                </CardView>
            </View>
        );
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', ()=>{
            // If back button pressed, exit the app.
            // Do not move back to the login screen
            BackHandler.exitApp();
          });
    }
  }