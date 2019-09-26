import React, { Component } from 'react';
import { 
  Switch, Text, SafeAreaView, SectionList, AsyncStorage, Button, Platform,
  TextInput, View, Alert, KeyboardAvoidingView, InputAccessoryView
} from 'react-native';
import ListItem from '../components/listitem';
import * as SecureStore from 'expo-secure-store';
import SnackBar from 'react-native-snackbar-component';


export class Settings extends Component {
static navigationOptions = ({ navigation, navigationOptions }) => {
  const { params } = navigation.state;

  return {
    title: '설정',
  };
};
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
      <SectionList style={{height:'100%', backgroundColor: 'white'}}
        renderItem={({item, index, section}) => {
          switch(item.type){
          case 'nav':
            return(
              <ListItem key={index} onPress={()=>this.props.navigation.navigate(item.navigateTo)}
                style={{flex: 0, flexDirection: 'row'}}>
                <Text style={{flex: 1}}>{item.label}</Text>
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
                <Text style={{flex: 1}}>{item.label}</Text>
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
                <Text style={{flex: 1}}>{item.label}</Text>
              </ListItem> 
            );
          }
        }}
        renderSectionHeader={({section: {title}}) => (
          <ListItem style={{flex: 0, flexDirection: 'row'}} isHeader={true}>
            <Text style={{fontWeight: 'bold'}}>{title}</Text>
          </ListItem>
        )}
        sections={this.sectionData}
        keyExtractor={(item, index) => item + index}
      />
    </SafeAreaView>
  );
}
}

export class PinRecovery extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
  
    return {
      title: 'PIN 복구',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      newPin: '',
      newPinCheck: '',
      userpw: '',
      msg: '',
      snackbar: false
    };

    this.newPin = React.createRef();
    this.newPinCheck = React.createRef();
    this.userpw = React.createRef();
  }

  showSnackbar(msg){
    this.setState({msg: msg, snackbar: true});
    setTimeout(()=>{
      this.setState({msg: '', snackbar: false});
    },3000);
  }

  render(){
    const idToNewPinCheck = 'idToNewPinCheck';
    const idToUserpw = 'idToUserpw';
    const idRecover = 'idRecover';
    let keyboardToolbar = (Platform.OS == 'ios') ? (
      <View>
        <InputAccessoryView nativeID={idToNewPinCheck}>
          <Button
            onPress={() => this.newPinCheck.current.focus()}
            title="새 PIN 확인(6자) 입력"
          />
        </InputAccessoryView>
        <InputAccessoryView nativeID={idToUserpw}>
          <Button
            onPress={() => this.userpw.current.focus()}
            title="로그인 비밀번호 입력"
          />
        </InputAccessoryView>
        <InputAccessoryView nativeID={idRecover}>
          <Button
            onPress={() => this.recoverPin()}
            title="PIN 복구"
          />
        </InputAccessoryView>
      </View>) : (<View></View>);
    return(
      <KeyboardAvoidingView behavior="padding" enabled style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ListItem>
            <TextInput placeholder='새 PIN 입력(6자)'  returnkeyType='next' keyboardType='number-pad'
              maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={this.newPin}
              onSubmitEditing={ () => this.newPinCheck.current.focus() }
              onChangeText={(value)=>this.setState({newPin: value})}
              inputAccessoryViewID={idToNewPinCheck}/>
          </ListItem>
          <ListItem>
            <TextInput placeholder='새 PIN 확인(6자)'  returnkeyType='next' keyboardType='number-pad'
              maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={this.newPinCheck}
              onSubmitEditing={ () => this.userpw.current.focus() }
              onChangeText={(value)=>this.setState({newPinCheck: value})}
              inputAccessoryViewID={idToUserpw}/>
          </ListItem>
          <ListItem>
            <TextInput placeholder='로그인 비밀번호 입력'  returnkeyType='go'
              secureTextEntry={ true } autocorrect={ false } ref={this.userpw}
              onSubmitEditing={()=>this.recoverPin()}
              onChangeText={(value)=>this.setState({userpw: value})}
              inputAccessoryViewID={idRecover}/>
          </ListItem>
        </View>
        <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
          height:50, width:'100%', marginBottom: 16}}>
          <ListItem style={{flex:1, alignItems:'center'}}
            onPress={()=>this.props.navigation.goBack()}>
            <Text>취소</Text>
          </ListItem>
          <ListItem style={{flex:1, alignItems:'center'}}
            onPress={()=>this.recoverPin()}>
            <Text>복구</Text>
          </ListItem>
        </View>
        <SnackBar visible={this.state.snackbar} textMessage={this.state.msg}/>
        {keyboardToolbar}
      </KeyboardAvoidingView>
    );
  }

  async recoverPin(){
    if(this.state.newPin.length == 6 && this.state.newPinCheck.length == 6){
      if(this.state.newPin == this.state.newPinCheck){
        const userpw = await SecureStore.getItemAsync('userpw');
        if(userpw == this.state.userpw){
          await SecureStore.setItemAsync('localAuthPin', this.state.newPin);
          Alert.alert(
            'PIN 복구',
            'PIN 이 복구되었습니다.',
            [
              {text: '확인', onPress:()=>this.props.navigation.goBack()}
            ]);
        }else{
          this.showSnackbar('틀린 로그인 비밀번호 입니다.');
        }
      }else{
        this.showSnackbar('새 PIN 과 PIN 확인 값이 다릅니다.');
      }
    }else{
      this.showSnackbar('PIN은 6자리여야 합니다.');
    }
  }
}

export class ChangePin extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
  
    return {
      title: 'PIN 변경',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      newPin: '',
      newPinCheck: '',
      currentPin: '',
      msg: '',
      snackbar: false
    };

    this.newPin = React.createRef();
    this.newPinCheck = React.createRef();
    this.currentPin = React.createRef();
  }

  showSnackbar(msg){
    this.setState({msg: msg, snackbar: true});
    setTimeout(()=>{
      this.setState({msg: '', snackbar: false});
    },3000);
  }

  render(){
    const idToNewPin = 'idToNewPin';
    const idToNewPinCheck = 'idToNewPinCheck';
    const idChange = 'idChange';

    let keyboardToolbar = (Platform.OS == 'ios') ? (
      <View>
        <InputAccessoryView nativeID={idToNewPin}>
          <Button
            onPress={() => this.newPin.current.focus()}
            title="새 PIN(6자) 입력"
          />
        </InputAccessoryView>
        <InputAccessoryView nativeID={idToNewPinCheck}>
          <Button
            onPress={() => this.newPinCheck.current.focus()}
            title="새 PIN 확인(6자) 입력"
          />
        </InputAccessoryView>
        <InputAccessoryView nativeID={idChange}>
          <Button
            onPress={() => this.changePin()}
            title="PIN 변경"
          />
        </InputAccessoryView>
      </View>) : (<View></View>);
    return(
      <KeyboardAvoidingView behavior="padding" enabled style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ListItem>
            <TextInput placeholder='기존 PIN 입력'  returnkeyType='next' keyboardType='number-pad'
              secureTextEntry={ true } autocorrect={ false } ref={this.currentPin}
              onSubmitEditing={ () => this.newPin.current.focus() } maxLength={6}
              onChangeText={(value)=>this.setState({currentPin: value})}
              inputAccessoryViewID={idToNewPin}/>
          </ListItem>
          <ListItem>
            <TextInput placeholder='새 PIN 입력(6자)'  returnkeyType='next' keyboardType='number-pad'
              maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={this.newPin}
              onSubmitEditing={ () => this.newPinCheck.current.focus() }
              onChangeText={(value)=>this.setState({newPin: value})}
              inputAccessoryViewID={idToNewPinCheck}/>
          </ListItem>
          <ListItem>
            <TextInput placeholder='새 PIN 확인(6자)'  returnkeyType='go' keyboardType='number-pad'
              maxLength={6} secureTextEntry={ true } autocorrect={ false } ref={this.newPinCheck}
              onSubmitEditing={ () => this.changePin() }
              onChangeText={(value)=>this.setState({newPinCheck: value})}
              inputAccessoryViewID={idChange}/>
          </ListItem>
        </View>
        <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
          height:50, width:'100%', marginBottom: 16}}>
          <ListItem style={{flex:1, alignItems:'center'}}
            onPress={()=>this.props.navigation.goBack()}>
            <Text>취소</Text>
          </ListItem>
          <ListItem style={{flex:1, alignItems:'center'}}
            onPress={()=>this.changePin()}>
            <Text>복구</Text>
          </ListItem>
        </View>
        <SnackBar visible={this.state.snackbar} textMessage={this.state.msg}/>
        {keyboardToolbar}
      </KeyboardAvoidingView>
    );
  }

  async changePin(){
    if(this.state.currentPin.length == 6 &&
      this.state.newPin.length == 6 && 
      this.state.newPinCheck.length == 6){
      if(this.state.newPin == this.state.newPinCheck){
        const currentPin = await SecureStore.getItemAsync('localAuthPin');
        if(currentPin == this.state.currentPin){
          await SecureStore.setItemAsync('localAuthPin', this.state.newPin);
          Alert.alert(
            'PIN 변경',
            'PIN 이 변경되었습니다.',
            [
              {text: '확인', onPress:()=>this.props.navigation.goBack()}
            ]);
        }else{
          this.showSnackbar('틀린 PIN 입니다.');
        }
      }else{
        this.showSnackbar('새 PIN 과 PIN 확인 값이 다릅니다.');
      }
    }else{
      this.showSnackbar('PIN은 6자리여야 합니다.');
    }
  }
}
