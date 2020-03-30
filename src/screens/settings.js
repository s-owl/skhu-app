import React, {Component, useState, useRef} from 'react';
import { 
  Switch, SafeAreaView, SectionList, AsyncStorage, Button, Platform,
  View, Alert, KeyboardAvoidingView, InputAccessoryView, TextInput
} from 'react-native';
import ListItem from '../components/listitem';
import * as SecureStore from 'expo-secure-store';
import SnackBar from 'react-native-snackbar-component';
import {ThemedText} from '../components/components';
import {useTheme} from '@react-navigation/native';

export class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.sectionData = [
      {title: 'PIN 관리', data: [
        {label: 'PIN 변경', type: 'nav', name: 'changePin', navigateTo: 'ChangePin'},
        {label: 'PIN 복구', type: 'nav', name: 'recoverPin', navigateTo: 'PinRecovery'}
      ]},
      {title: '기타', data: [
        {label: '홈 화면에서 프로필 사진 숨김', type: 'bool', name: 'hideProfile', default: true},
      ]},
    ];
  }

  componentDidMount(){
    this.sectionData.forEach((item)=>{
      item.data.forEach(async (subitem)=>{
        if(subitem.type == 'bool'){
          let savedValue = await AsyncStorage.getItem(subitem.name);
          console.log(JSON.stringify(subitem));
          if(savedValue == null || savedValue == undefined){
            this.setState({
              ...this.state,
              [subitem.name]: subitem.default
            });
          }else{
            this.setState({
              ...this.state,
              [subitem.name]: JSON.parse(savedValue)
            });
          }
        }
      });
    });
  }
  render() {
    return(
      <SafeAreaView>
        <SectionList style={{height: '100%'}}
          renderItem={({item, index, section}) => {
            switch(item.type){
            case 'nav':
              return(
                <ListItem key={index} onPress={()=>this.props.navigation.navigate(item.navigateTo)}
                  style={{flex: 0, flexDirection: 'row'}}>
                  <ThemedText style={{flex: 1}}>{item.label}</ThemedText>
                </ListItem> 
              );
            case 'bool':
              return(
                <ListItem key={index} onPress={async ()=>{
                  const value = !this.state[item.name];
                  this.setState({
                    [item.name]: value
                  });
                  await AsyncStorage.setItem(item.name, value.toString());
                }}
                style={{flex: 0, flexDirection: 'row'}}>
                  <ThemedText style={{flex: 1}}>{item.label}</ThemedText>
                  <Switch value={this.state[item.name]} onValueChange={
                    async (value)=>{
                      this.setState({
                        [item.name]: value
                      });
                      await AsyncStorage.setItem(item.name, value.toString());
                    }
                  }/>
                </ListItem> 
              );
            default:
              return(
                <ListItem key={index}
                  style={{flex: 0, flexDirection: 'row'}}>
                  <ThemedText style={{flex: 1}}>{item.label}</ThemedText>
                </ListItem> 
              );
            }
          }}
          renderSectionHeader={({section: {title}}) => (
            <ListItem style={{flex: 0, flexDirection: 'row'}} isHeader={true}>
              <ThemedText style={{fontWeight: 'bold'}}>{title}</ThemedText>
            </ListItem>
          )}
          sections={this.sectionData}
          keyExtractor={(item, index) => item + index}
        />
      </SafeAreaView>
    );
  }
}

export function PinRecovery(props){
  const [newPin, setNewPin] = useState('');
  const [newPinCheck, setNewPinCheck] = useState('');
  const [userpw, setUserpw] = useState('');
  const [msg, setMsg] = useState('');
  const [snackbar, setSnackbar] = useState(false);
  const {colors} = useTheme();

  const newPinInput = useRef();
  const newPinCheckInput = useRef();
  const userpwInput = useRef();

  const showSnackbar = (msg) => {
    setMsg(msg);
    setSnackbar(true);
    setTimeout(()=>{
      setMsg('');
      setSnackbar(false);
    }, 3000);
  };

  const recoverPin = async() => {
    if(newPin.length == 6 && newPinCheck.length == 6){
      if(newPin == newPinCheck){
        const userpw = await SecureStore.getItemAsync('userpw');
        if(userpw == userpw){
          await SecureStore.setItemAsync('localAuthPin', newPin);
          Alert.alert(
            'PIN 복구',
            'PIN 이 복구되었습니다.',
            [
              {text: '확인', onPress: ()=>props.navigation.goBack()}
            ]);
        }else{
          showSnackbar('틀린 로그인 비밀번호 입니다.');
        }
      }else{
        showSnackbar('새 PIN 과 PIN 확인 값이 다릅니다.');
      }
    }else{
      showSnackbar('PIN은 6자리여야 합니다.');
    }
  };

  const idToNewPinCheck = 'idToNewPinCheck';
  const idToUserpw = 'idToUserpw';
  const idRecover = 'idRecover';
  let keyboardToolbar = (Platform.OS == 'ios') ? (
    <View>
      <InputAccessoryView nativeID={idToNewPinCheck}>
        <Button
          onPress={() =>newPinCheckInput.current.focus()}
          title="새 PIN 확인(6자) 입력"
        />
      </InputAccessoryView>
      <InputAccessoryView nativeID={idToUserpw}>
        <Button
          onPress={() =>userpwInput.current.focus()}
          title="로그인 비밀번호 입력"
        />
      </InputAccessoryView>
      <InputAccessoryView nativeID={idRecover}>
        <Button
          onPress={() => recoverPin()}
          title="PIN 복구"
        />
      </InputAccessoryView>
    </View>) : (<View></View>);
  return(
    <KeyboardAvoidingView behavior="padding" enabled style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ListItem>
          <TextInput style={{color: colors.text}} placeholder='새 PIN 입력(6자)'
            returnkeyType='next' keyboardType='number-pad'
            maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={newPinInput}
            onSubmitEditing={ () => newPinCheckInput.current.focus() }
            onChangeText={(value)=>setNewPin(value)}
            inputAccessoryViewID={idToNewPinCheck}/>
        </ListItem>
        <ListItem>
          <TextInput style={{color: colors.text}} placeholder='새 PIN 확인(6자)'
            returnkeyType='next' keyboardType='number-pad'
            maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={newPinCheckInput}
            onSubmitEditing={ () => userpwInput.current.focus() }
            onChangeText={(value)=>setNewPinCheck(value)}
            inputAccessoryViewID={idToUserpw}/>
        </ListItem>
        <ListItem>
          <TextInput style={{color: colors.text}} placeholder='로그인 비밀번호 입력'
            returnkeyType='go'
            secureTextEntry={ true } autocorrect={ false } ref={userpwInput}
            onSubmitEditing={()=>recoverPin()}
            onChangeText={(value)=>setUserpw(value)}
            inputAccessoryViewID={idRecover}/>
        </ListItem>
      </View>
      <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
        height: 50, width: '100%', marginBottom: 16}}>
        <ListItem style={{flex: 1, alignItems: 'center'}}
          onPress={()=>props.navigation.goBack()}>
          <ThemedText>취소</ThemedText>
        </ListItem>
        <ListItem style={{flex: 1, alignItems: 'center'}}
          onPress={()=>recoverPin()}>
          <ThemedText>복구</ThemedText>
        </ListItem>
      </View>
      <SnackBar visible={snackbar} textMessage={msg}/>
      {keyboardToolbar}
    </KeyboardAvoidingView>
  );
  

  
}

export function ChangePin(props){
  const [newPin, setNewPin] = useState('');
  const [newPinCheck, setNewPinCheck] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [msg, setMsg] = useState('');
  const [snackbar, setSnackbar] = useState(false);
  const {colors} = useTheme();

  const newPinInput = useRef();
  const newPinCheckInput = useRef();
  const currentPinInput = useRef();

  const showSnackbar = (msg) => {
    setMsg(msg);
    setSnackbar(true);
    setTimeout(()=>{
      setMsg('');
      setSnackbar(false);
    }, 3000);
  };

  const changePin = async()=>{
    if(currentPin.length == 6 &&
      newPin.length == 6 && 
      newPinCheck.length == 6){
      if(newPin == newPinCheck){
        const currentPin = await SecureStore.getItemAsync('localAuthPin');
        if(currentPin == currentPin){
          await SecureStore.setItemAsync('localAuthPin', newPin);
          Alert.alert(
            'PIN 변경',
            'PIN 이 변경되었습니다.',
            [
              {text: '확인', onPress: ()=>props.navigation.goBack()}
            ]);
        }else{
          showSnackbar('틀린 PIN 입니다.');
        }
      }else{
        showSnackbar('새 PIN 과 PIN 확인 값이 다릅니다.');
      }
    }else{
      showSnackbar('PIN은 6자리여야 합니다.');
    }
  };

  const idToNewPin = 'idToNewPin';
  const idToNewPinCheck = 'idToNewPinCheck';
  const idChange = 'idChange';

  let keyboardToolbar = (Platform.OS == 'ios') ? (
    <View>
      <InputAccessoryView nativeID={idToNewPin}>
        <Button
          onPress={() => newPinInput.current.focus()}
          title="새 PIN(6자) 입력"
        />
      </InputAccessoryView>
      <InputAccessoryView nativeID={idToNewPinCheck}>
        <Button
          onPress={() => newPinCheckInput.current.focus()}
          title="새 PIN 확인(6자) 입력"
        />
      </InputAccessoryView>
      <InputAccessoryView nativeID={idChange}>
        <Button
          onPress={() => changePin()}
          title="PIN 변경"
        />
      </InputAccessoryView>
    </View>) : (<View></View>);
  return(
    <KeyboardAvoidingView behavior="padding" enabled style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ListItem>
          <TextInput style={{color: colors.text}} placeholder='기존 PIN 입력' 
            returnkeyType='next' keyboardType='number-pad'
            secureTextEntry={ true } autocorrect={ false } ref={currentPinInput}
            onSubmitEditing={ () => newPinInput.current.focus() } maxLength={6}
            onChangeText={(value)=>setCurrentPin(value)}
            inputAccessoryViewID={idToNewPin}/>
        </ListItem>
        <ListItem>
          <TextInput style={{color: colors.text}} placeholder='새 PIN 입력(6자)' 
            returnkeyType='next' keyboardType='number-pad'
            maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={newPinInput}
            onSubmitEditing={ () => newPinCheckInput.current.focus() }
            onChangeText={(value)=>setNewPin(value)}
            inputAccessoryViewID={idToNewPinCheck}/>
        </ListItem>
        <ListItem>
          <TextInput style={{color: colors.text}} placeholder='새 PIN 확인(6자)' 
            returnkeyType='go' keyboardType='number-pad'
            maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={newPinCheckInput}
            onSubmitEditing={ () => changePin() }
            onChangeText={(value)=>setNewPinCheck(value)}
            inputAccessoryViewID={idChange}/>
        </ListItem>
      </View>
      <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
        height: 50, width: '100%', marginBottom: 16}}>
        <ListItem style={{flex: 1, alignItems: 'center'}}
          onPress={()=>props.navigation.goBack()}>
          <ThemedText>취소</ThemedText>
        </ListItem>
        <ListItem style={{flex: 1, alignItems: 'center'}}
          onPress={()=>changePin()}>
          <ThemedText>복구</ThemedText>
        </ListItem>
      </View>
      <SnackBar visible={snackbar} textMessage={msg}/>
      {keyboardToolbar}
    </KeyboardAvoidingView>
  );
}
