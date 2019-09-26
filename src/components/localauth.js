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
  display: '______',
  msg: '',
  pinRegistered: false,
  icon: 'lock-outline'
};


export default class LocalAuth extends Component {
  constructor(props){
    super(props);
    this.state = initState;
  }

  getDisplayString(len=0){
    if(len >= 6){
      return '*'.repeat(6);
    }else{
      return '*'.repeat(len) + '_'.repeat(6-len);
    }
  }

  async bioAuth(){
    const availableHws = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const type = availableHws.includes(2) ? ['얼굴인식',  'face'] : ['지문인식', 'fingerprint'];
    this.setState({msg: `${type[0]} 또는 6자리 PIN으로 인증하세요`, icon: type[1]});
    const result = await LocalAuthentication.authenticateAsync({fallbackLabel: '', promptMessage: '계속하려면 인증이 필요합니다.'});
    if(result.success){
      this.authSuccess();
    }else if(result.error != 'user_cancel'){
      console.log(result.error);
      this.setState({
        msg: `${type[0]} 인증에 실패하였습니다.`,
        pin: '',
        pinCheck: '',
        display: this.getDisplayString(),
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
      display: this.getDisplayString(),
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
    this.setState(initState);
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
        display: this.getDisplayString(newPin.length)
      }); 
      
    }else if(digit != '<' && this.state.pin.length < 6){
      newPin = `${this.state.pin}${digit}`;
      this.setState({
        pin: newPin,
        display: this.getDisplayString(newPin.length)
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
              display: this.getDisplayString(),
              icon: 'error-outline'
            });
          }
        }else{
          if(this.state.pinCheck.length == 0){
            this.setState({
              pin: '',
              pinCheck: newPin,
              display: this.getDisplayString(),
              msg: '동일한 PIN을 다시 한번 입력하세요.'
            });
          }else if(this.state.pinCheck == newPin){
            await SecureStore.setItemAsync('localAuthPin', newPin);
            this.setState({
              msg: '등록 완료. 방금 등록한 PIN 으로 인증하세요.',
              pin: '',
              pinCheck: '',
              display: this.getDisplayString(),
              pinRegistered: true
            });
          }else if(this.state.pinCheck != newPin){
            this.setState({
              msg: '틀렸습니다. 처음부터 다시 시작하세요.',
              pin: '',
              pinCheck: '',
              display: this.getDisplayString(),
              icon: 'error-outline'
            });
            setTimeout(()=>this.startAuth(), 500);
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
        <View style={{paddingTop: 30, padding: 16, flex: 1}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <MaterialIcons name={this.state.icon} size={32} style={{padding: 16}}/>
            <Text>{this.state.msg}</Text>
            <Text style={{fontSize: 32}}>{this.state.display}</Text>
          </View>
          <View style={{flex: 3, justifyContent: 'flex-end'}}>
            <View style={styles.digitRow}>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(1)}><Text style={{ fontSize: 24 }}>1</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(2)}><Text style={{ fontSize: 24 }}>2</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(3)}><Text style={{ fontSize: 24 }}>3</Text></Touchable>
            </View>
            <View style={styles.digitRow}>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(4)}><Text style={{ fontSize: 24 }}>4</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(5)}><Text style={{ fontSize: 24 }}>5</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(6)}><Text style={{ fontSize: 24 }}>6</Text></Touchable>
            </View>
            <View style={styles.digitRow}>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(7)}><Text style={{ fontSize: 24 }}>7</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(8)}><Text style={{ fontSize: 24 }}>8</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(9)}><Text style={{ fontSize: 24 }}>9</Text></Touchable>
            </View>
            <View style={styles.digitRow}>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit(0)}><Text style={{ fontSize: 24 }}>0</Text></Touchable>
              <Touchable style={styles.digitButton} borderless={true}
                onPress={()=>this.inputDigit('<')}><Text style={{ fontSize: 24 }}>{'<'}</Text></Touchable>
            </View>
            <View style={styles.digitRow}>
              <ListItem style={{flex:1, alignItems:'center', justifyContent: 'center'}} onPress={async ()=>{
                this.setState(initState);
                if(Platform.OS == 'android'){
                  await LocalAuthentication.cancelAuthenticate();
                }
              }}>
                <Text>취소</Text>
              </ListItem>
            </View>
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
  },
  digitRow: {
    flex: 1, flexDirection: 'row', width:'100%',
    marginTop: 8, marginBottom: 8,
  }
});
