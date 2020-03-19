import React, {useState, useEffect} from 'react';
import {Modal, View, StyleSheet, Platform} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import ListItem from './listitem';
import Touchable from './touchable';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import {ThemeText} from './components';
import {useTheme} from '@react-navigation/native';

export default function LocalAuth(props){
  const {colors} = useTheme();
  const [pin, setPin] = useState('');
  const [pinCheck, setPinCheck] = useState('');
  const [display, setDisplay] = useState('______');
  const [msg, setMsg] = useState('');
  const [pinRegistered, setPinRegistered] = useState(false);
  const [icon, setIcon] = useState('lock-outline');

  const resetStates = ()=>{
    setPin('');
    setPinCheck('');
    setDisplay('______');
    setMsg('');
    setPinRegistered(false);
    setIcon('lock-outline');
  };

  useEffect(()=>{
    resetStates();
  }, []);

  useEffect(()=>{
    if(props.visible){
      startAuth();
    }else{
      resetStates();
      (async()=>{
        if(Platform.OS == 'android'){
          await LocalAuthentication.cancelAuthenticate();
        }
      })();
    }
  }, [props.visible]);

  const getDisplayString = (len=0)=>{
    if(len >= 6){
      return '*'.repeat(6);
    }else{
      return '*'.repeat(len) + '_'.repeat(6-len);
    }
  };

  const bioAuth = async()=>{
    const availableHws = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const type = availableHws.includes(2) ? ['얼굴인식',  'face'] : ['지문인식', 'fingerprint'];
    setMsg(`${type[0]} 또는 6자리 PIN으로 인증하세요`);
    setIcon(type[1]);
    const result = await LocalAuthentication.authenticateAsync({fallbackLabel: '', promptMessage: '계속하려면 인증이 필요합니다.'});
    if(result.success){
      authSuccess();
    }else if(result.error != 'user_cancel'){
      console.log(result.error);
      setMsg(`${type[0]} 인증에 실패하였습니다.`);
      setPin('');
      setPinCheck('');
      setDisplay(getDisplayString());
      setIcon('error-outline');
      if(Platform.OS == 'android'){
        setTimeout(()=>{
          bioAuth();
        }, 1000);
      }
    }
  }; 

  const authSuccess = async()=>{
    setMsg('인증되었습니다.');
    setPin('');
    setPinCheck('');
    setDisplay(getDisplayString());
    setIcon('lock-open');
    setTimeout(async ()=>{
      props.onAuthSuccess();
      props.onClose();
      resetStates();
      if(Platform.OS == 'android'){
        await LocalAuthentication.cancelAuthenticate();
      }
    }, 500);
  };

  const startAuth = async()=>{
    resetStates();
    const pin = await SecureStore.getItemAsync('localAuthPin');
    const hasHw = await LocalAuthentication.hasHardwareAsync();
    const bioAuthRegistered = await LocalAuthentication.isEnrolledAsync();
    setPinRegistered( typeof pin == 'string');
    if(pinRegistered){
      if(hasHw && bioAuthRegistered){
        bioAuth();
      }else{
        setMsg('등록한 6자리 PIN으로 인증하세요.');
      }
    }else{
      setMsg('새로 등록할 6자리 PIN을 입력하세요.');
    }
  };

  
  const inputDigit = async(digit)=>{
    let newPin;
    if(digit == '<' && pin.length > 0){
      newPin = pin.slice(0, -1);
      setPin(newPin),
      setDisplay(getDisplayString(newPin.length));
    }else if(digit != '<' && pin.length < 6){
      newPin = `${pin}${digit}`;
      setPin(newPin),
      setDisplay(getDisplayString(newPin.length));
      if(newPin.length == 6){
        if(pinRegistered){
          const pin = await SecureStore.getItemAsync('localAuthPin');
          if(newPin == pin){
            authSuccess();
          }else{
            setMsg('틀린 PIN 입니다.');
            setPin('');
            setPinCheck('');
            setDisplay(getDisplayString());
            setIcon('error-outline');
          }
        }else{
          if(pinCheck.length == 0){
            setMsg('동일한 PIN을 다시 한번 입력하세요.');
            setPin('');
            setPinCheck(newPin);
            setDisplay(getDisplayString());
          }else if(pinCheck == newPin){
            await SecureStore.setItemAsync('localAuthPin', newPin);
            setMsg('등록 완료. 방금 등록한 PIN 으로 인증하세요.');
            setPin('');
            setPinCheck('');
            setDisplay(getDisplayString());
            setPinRegistered(true);
          }else if(pinCheck != newPin){
            setMsg('틀렸습니다. 처음부터 다시 시작하세요.');
            setPin('');
            setPinCheck('');
            setDisplay(getDisplayString());
            setIcon('error-outline');
            setTimeout(()=>startAuth(), 500);
          }
        }
      }
    }
  };
  return(
    <Modal
      animationType="fade"
      visible={props.visible}>
      <View style={{paddingTop: 30, padding: 16, flex: 1, backgroundColor: colors.background}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MaterialIcons color={colors.text} name={icon} size={32} style={{padding: 16}}/>
          <ThemeText>{msg}</ThemeText>
          <ThemeText style={{fontSize: 32}}>{display}</ThemeText>
        </View>
        <View style={{flex: 3, justifyContent: 'flex-end'}}>
          <View style={styles.digitRow}>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(1)}><ThemeText style={{fontSize: 24}}>1</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(2)}><ThemeText style={{fontSize: 24}}>2</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(3)}><ThemeText style={{fontSize: 24}}>3</ThemeText></Touchable>
          </View>
          <View style={styles.digitRow}>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(4)}><ThemeText style={{fontSize: 24}}>4</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(5)}><ThemeText style={{fontSize: 24}}>5</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(6)}><ThemeText style={{fontSize: 24}}>6</ThemeText></Touchable>
          </View>
          <View style={styles.digitRow}>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(7)}><ThemeText style={{fontSize: 24}}>7</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(8)}><ThemeText style={{fontSize: 24}}>8</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(9)}><ThemeText style={{fontSize: 24}}>9</ThemeText></Touchable>
          </View>
          <View style={styles.digitRow}>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit(0)}><ThemeText style={{fontSize: 24}}>0</ThemeText></Touchable>
            <Touchable style={styles.digitButton} borderless={true}
              onPress={()=>inputDigit('<')}><ThemeText style={{fontSize: 24}}>{'<'}</ThemeText></Touchable>
          </View>
          <View style={styles.digitRow}>
            <ListItem style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={async ()=>{
              props.onClose();
            }}>
              <ThemeText>취소</ThemeText>
            </ListItem>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  digitButton: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  digitRow: {
    flex: 1, flexDirection: 'row', width: '100%',
    marginTop: 8, marginBottom: 8,
  }
});
