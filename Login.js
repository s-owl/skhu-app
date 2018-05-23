import React, { Component } from 'react';
import { 
  StyleSheet, Text ,View, Image, TextInput,
  TouchableWithoutFeedback, StatusBar, SafeAreaView,
  Keyboard, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';

export default class Login extends Component {
    render() {
      return (
        <SafeAreaView style={ styles.container }>
          <KeyboardAvoidingView behavior='padding' style={ styles.container }>
            <View style={ styles.container }>
              <View style={ styles.title_container }>
                <Image style={ styles.skhu_logo } 
                  source={ require('./assets/login/skhu_logo.png') }>
                </Image>
                <Text style={ styles.title_text }>App Title</Text>
              </View>
              <View style={ styles.login_container }>
                <TextInput style={ styles.login_input } placeholder='아이디 입력' keyboardType='default' returnKeyType='next' autocorrect={ false } onSubmitEditing={ () => this.refs.password.focus() }>
                </TextInput>
                <TextInput style={ styles.login_input } placeholder='패스워드 입력' keyboardType='visible-password' returnkeyType='go' ref={ 'password' } secureTextEntry={ true } autocorrect={ false }>
                </TextInput>
                <TouchableOpacity style={ styles.button_container }>
                  <Text style={ styles.button_text }>접속하기</Text>
                </TouchableOpacity>
                <View style={ styles.footer }>
                  <Text style={ styles.info }>* 종합정보시스템의 계정정보를 입력해주세요.</Text>
                  <Text style={ styles.info }>* 최초 로그인 1회시 자동접속 됩니다.</Text>
                </View>
                <Text style={ styles.copy }>'App Title' was made Sleey OWL 2018-</Text>
                <Image style={ styles.sowl_logo } source={ require('./assets/login/Sowl_Logo.png') }>
                </Image>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column'
    },
    title_container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40
    },
    title_text: {
      fontWeight: 'bold',
      fontSize: 30,
      color: 'black',
      textAlign: 'center'
    },
    skhu_logo: {
      width: 100,
      height: 100
    },
    login_container: {
      flex: 1,
      marginBottom: 140,
      marginLeft: 20,
      marginRight: 20
    },
    login_input: {
      height: 50,
      backgroundColor: 'rgba(220, 220, 220, 0.8)',
      marginBottom: 15,
      paddingHorizontal: 20,
      borderRadius: 10
    },
    button_container: {
      height: 60,
      borderRadius: 10,
      backgroundColor: 'rgba(60, 60, 60, 0.8)',
      paddingVertical: 20
    },
    button_text: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    footer: {
      marginHorizontal: 40,
      marginTop: 40,
      alignItems: 'center'
    },
    sowl_logo: {
      marginLeft: 260,
      width: 100,
      height: 100,
    },
    info: {
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'left',
      marginBottom: 5
    },
    copy: {
      fontWeight: '200',
      marginTop: 30
    }
  });
  