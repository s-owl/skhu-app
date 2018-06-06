import React, { Component } from 'react';
import { 
    StyleSheet, Text ,View, Image, TextInput,
    TouchableWithoutFeedback, StatusBar, SafeAreaView,
    Keyboard, TouchableOpacity, KeyboardAvoidingView
  } from 'react-native';
import  {CardView}  from './components';

export default class Main extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
    
        return {
          header: null // 헤더 비활성화
        };
    };

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