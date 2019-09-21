import React, { Component } from 'react';
import {Modal, Text, View, StyleSheet, Platform} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ListItem from './listitem';
import Touchable from './touchable';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';


const initState = {
  visible: false,
  bioRegistered: false,
  hasSensor: false,
  pin: '',
  pinCheck: '',
  display: '',
  msg: '',
  pinRegistered: false,
  icon: 'lock-outline'
};


export default class LocalAuth extends Component {
  constructor(props){
    super(props);
    this.state = initState;
  }

  async bioAuth(){
    const availableHws = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const type = availableHws.includes(2) ? ['얼굴인식',  'face'] : ['지문인식', 'fingerprint'];
    this.setState({msg: `${type[0]} 또는 6자리 PIN으로 인증하세요`, icon: type[1]});
    const result = await LocalAuthentication.authenticateAsync({fallbackLabel: ''});
    if(result.success){
      this.authSuccess();
    }else if(result.error != 'user_cancel'){
      console.log(result.error);
      this.setState({
        msg: `${type[0]} 인증에 실패하였습니다.`,
        pin: '',
        pinCheck: '',
        display: '',
        icon: 'error-outline'});
      if(Platform.OS == 'android'){
        setTimeout(()=>{
          this.bioAuth();
        },1000);
      }
    }
  } 

  authSuccess(){
    this.setState({
      msg: '인증되었습니다.',
      pin: '',
      pinCheck: '',
      display: '',
      icon: 'lock-open'});
    setTimeout(async ()=>{
      this.props.onAuthSuccess();
      this.setState(initState);
      if(Platform.OS == 'android'){
        await LocalAuthentication.cancelAuthenticate();
      }
    },500);
  }

  async startAuth(){
    const pin = await SecureStore.getItemAsync('localAuthPin');
    const hasHw = await LocalAuthentication.hasHardwareAsync();
    const bioAuthRegistered = await LocalAuthentication.isEnrolledAsync();
    this.setState({pinRegistered: typeof pin == 'string'});
    if(this.state.pinRegistered){
      if(hasHw && bioAuthRegistered){
        this.bioAuth();
      }else{
        this.setState({msg: '등록한 6자리 PIN으로 인증하세요.'});
      }
    }else{
      this.setState({msg: '새로 등록할 6자리 PIN을 입력하세요.'});
    }
    this.setState({visible: true, bioRegistered: bioAuthRegistered});
  }

  
  async inputDigit(digit){
    let newPin;
    if(digit == '<' && this.state.pin.length > 0){
      newPin = this.state.pin.slice(0, -1);
      this.setState({
        pin: newPin,
        display: '*'.repeat(newPin.length)
      }); 
      
    }else if(digit != '<' && this.state.pin.length < 6){
      newPin = `${this.state.pin}${digit}`;
      this.setState({
        pin: newPin,
        display: '*'.repeat(newPin.length)
      }); 
      if(newPin.length == 6){
        if(this.state.pinRegistered){
          const pin = await SecureStore.getItemAsync('localAuthPin');
          if(newPin == pin){
            this.authSuccess();
          }else{
            this.setState({
              msg: '틀린 PIN 입니다.',
              pin: '',
              pinCheck: '',
              display: '',
              icon: 'error-outline'
            });
          }
        }else{
          if(this.state.pinCheck.length == 0){
            this.setState({
              pin: '',
              pinCheck: newPin,
              display: '',
              msg: '동일한 PIN을 다시 한번 입력하세요.'
            });
          }else if(this.state.pinCheck == newPin){
            await SecureStore.setItemAsync('localAuthPin', newPin);
            this.setState({
              msg: '등록 완료. 방금 등록한 PIN 으로 인증하세요.',
              pin: '',
              pinCheck: '',
              display: '',
              pinRegistered: true
            });
          }
        }
      }
    }
  }
  render(){
    return(
      <Modal
        animationType="fade"
        visible={this.state.visible}>
        <View style={{paddingTop: 50, padding: 16, flex: 1}}>
          <View style={{padding: 8, flex: 1}}>
            <View style={{alignItems: 'center'}}>
              <MaterialIcons name={this.state.icon} size={32}style={{padding: 16}}/>
              <Text>{this.state.msg}</Text>
              <Text style={{fontSize: 32}}>{this.state.display}</Text>
              <View style={{flex: 0, flexDirection: 'row', width:'100%',
                marginTop: 8, marginBottom: 8, height: 100}}>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(1)}><Text style={{ fontSize: 24 }}>1</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(2)}><Text style={{ fontSize: 24 }}>2</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(3)}><Text style={{ fontSize: 24 }}>3</Text></Touchable>
              </View>
              <View style={{flex: 0, flexDirection: 'row', width:'100%',
                marginTop: 8, marginBottom: 8, height: 100}}>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(4)}><Text style={{ fontSize: 24 }}>4</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(5)}><Text style={{ fontSize: 24 }}>5</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(6)}><Text style={{ fontSize: 24 }}>6</Text></Touchable>
              </View>
              <View style={{flex: 0, flexDirection: 'row', width:'100%',
                marginTop: 8, marginBottom: 8, height: 100}}>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(7)}><Text style={{ fontSize: 24 }}>7</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(8)}><Text style={{ fontSize: 24 }}>8</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(9)}><Text style={{ fontSize: 24 }}>9</Text></Touchable>
              </View>
              <View style={{flex: 0, flexDirection: 'row', width:'100%',
                marginTop: 8, marginBottom: 8, height: 100}}>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit(0)}><Text style={{ fontSize: 24 }}>0</Text></Touchable>
                <Touchable style={styles.digitButton} borderless={true}
                  onPress={()=>this.inputDigit('<')}><Text style={{ fontSize: 24 }}>{'<'}</Text></Touchable>
              </View>
            </View>
          </View>
          <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
            height:50, width:'100%', marginBottom: 16}}>
            <ListItem style={{flex:1, alignItems:'center'}} onPress={async ()=>{
              this.setState(initState);
              if(Platform.OS == 'android'){
                await LocalAuthentication.cancelAuthenticate();
              }
            }}>
              <Text>취소</Text>
            </ListItem>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  digitButton:{
    flex:1, 
    alignItems:'center', 
    justifyContent: 'center'
  }
});
