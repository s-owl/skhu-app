import React, {Component, useState, useEffect, useRef} from 'react';
import {
  StyleSheet, View, Image, TextInput,
  StatusBar, SafeAreaView, KeyboardAvoidingView,
  ActivityIndicator, Platform
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ForestApi from './tools/apis';
import ChunkSecureStore from './tools/chunkSecureStore';
import * as SecureStore from 'expo-secure-store';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import SnackBar from 'react-native-snackbar-component';
import {CardView, ThemedText} from './components/components';
import BuildConfigs from './config';
import Touchable from './components/touchable';
import {ErrorModal, CommonErrors} from './components/errorModal';
import {HelpModal} from './components/helpModal';
import moment from 'moment';
import {Appearance} from 'react-native-appearance';
import {CommonActions} from '@react-navigation/native';

export default function Login(props){
  let [isLoading, setLoading] = useState(false);
  let [enableHelp, toggleHelp] = useState(true);
  let [msg, setMsg] = useState('');
  let [snackBar, toggleSnackBar] = useState(false);
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [helpModal, setHelpModal] = useState(false);
  let pwInput = useRef();

  const [errorModal, setErrorModal] = useState(false);
  const [errorObj, setErrorObj] = useState(CommonErrors.loginError);
  const [errorMsg, setErrorMsg] = useState('');

  const showSnackbar = (msg) => {
    setMsg(msg);
    toggleSnackBar(true);
    setTimeout(()=>{
      setMsg('');
      toggleSnackBar(false);
    }, 3000);
  };

  const runLogInProcess = async(id, pw) => {
    console.log('Logging in...');
    try{
      let sessionUpdatedAt = await SecureStore.getItemAsync('sessionUpdatedAt');
      if (sessionUpdatedAt != null) {
        sessionUpdatedAt = moment.utc(sessionUpdatedAt);
        const loginRequired = moment().utc().isAfter(sessionUpdatedAt.add('60', 'minutes'));
        if(!loginRequired){
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {name: 'MainStack'}
              ]
            })
          );
          return;
        }
      }
    }catch(err){
      console.error(err);
    }
    try{
      setLoading(true);
      toggleHelp(false);
      if(id.length <= 0 || pw.length <= 0){
        showSnackbar('학번 또는 비밀번호가 입력되지 않았습니다.');
        setLoading(false);
        toggleHelp(true);
      }else if(pw.length < 8){
        setErrorObj(CommonErrors.wrongLogin);
        setErrorModal(true);
        setLoading(false);
        toggleHelp(true);
      }else{
        let samLogin = ForestApi.login(id, pw, 'credentialNew');
        let forestLogin = ForestApi.login(id, pw, 'credentialOld');
        
        let forestLoginRes = await forestLogin;
        let forestData = await forestLoginRes.json();
        if(forestLoginRes.ok){
          await ChunkSecureStore.setItemAsync('CredentialOld', forestData['credential-old']);
        }else if(forestLoginRes.status == 400){
          setLoading(false);
          toggleHelp(true);
          setErrorObj(CommonErrors.wrongLogin);
          setErrorModal(true);
        }else if(forestLoginRes.status == 401){
          setLoading(false);
          toggleHelp(true);
          let msg = forestData['error'];
          setErrorObj(CommonErrors.loginError);
          setErrorMsg(msg);
          setErrorModal(true);
        }else{
          setLoading(false);
          toggleHelp(true);
        }

        if(forestLoginRes.status != 200) {
          return;
        }

        let samLoginRes = await samLogin;
        let samData = await samLoginRes.json();
        if(samLoginRes.ok){
          await ChunkSecureStore.setItemAsync('CredentialNew', samData['credential-new']);
          await ChunkSecureStore.setItemAsync('CredentialNewToken', samData['credential-new-token']);
        }else if(samLoginRes.status == 400){
          setLoading(false);
          toggleHelp(true);
          setErrorObj(CommonErrors.wrongLogin);
          setErrorModal(true);
        }else if(samLoginRes.status == 401){
          setLoading(false);
          toggleHelp(true);
          let msg = samData['error'];
          setErrorObj(CommonErrors.loginError);
          setErrorMsg(msg);
          setErrorModal(true);
        }else{
          setLoading(false);
          toggleHelp(true);
        }

        if(forestLoginRes.ok && samLoginRes.ok){
          await SecureStore.setItemAsync('userid', id);
          await SecureStore.setItemAsync('userpw', pw);
          await SecureStore.setItemAsync('sessionUpdatedAt', moment().utc().format());
          setLoading(false);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {name: 'MainStack'}
              ]
            })
          );
        }
      }
    }catch(err){
      setLoading(false);
      toggleHelp(true);
      setErrorObj(CommonErrors.netError);
      setErrorMsg(`${err}\n${err.message}\n${err.stack}`);
      setErrorModal(true); 
      console.log(err);
    }
  };

  useEffect(() => {
    async function runAsync(){
      if(Platform.OS == 'ios') StatusBar.setBarStyle({barStyle: 'light-content'});
      const connInfo = await NetInfo.fetch();
      if(connInfo.type == 'none'){
        setErrorObj(CommonErrors.noNetwork);
        setErrorModal(true);
      }else{
        let id = await SecureStore.getItemAsync('userid');
        let pw = await SecureStore.getItemAsync('userpw');
        if(id !== null && pw !== null){
          runLogInProcess(id, pw);
        }
      }
    }
    runAsync();
  }, []);

  let logInContainer;
  if(isLoading){
    logInContainer = (
      <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
    );
  }else{
    logInContainer = (
      <View>
        <ThemedText style={ styles.info }>성공회대학교 종합정보시스템{'\n'}계정으로 로그인 하세요.</ThemedText>
        <LoginInput placeholder='아이디(학번) 입력'
          underlineColorAndroid="transparent" autoCompleteType='username'
          returnKeyType='next' autocorrect={ false } onSubmitEditing={ () => pwInput.current.focus() }
          onChangeText={(text)=>setUsername(text)} keyboardType='default'/>
        <LoginInput placeholder='비밀번호 입력' secureTextEntry={ true }
          underlineColorAndroid="transparent" autoCompleteType='password'
          returnkeyType='go' ref={pwInput}  autocorrect={ false }
          onSubmitEditing={ () => {
            let id = username.replace(/\s/g, '');
            let pw = password.replace(/\s/g, '');
            runLogInProcess(id, pw);
          } }
          onChangeText={(text)=>setPassword(text)}/>
        <CardView elevate={true} onPress={()=>{
          let id = username.replace(/\s/g, '');
          let pw = password.replace(/\s/g, '');
          runLogInProcess(id, pw);
        }} style={{backgroundColor: '#569f59', justifyContent: 'center', flexDirection: 'row'}}>
          <MaterialCommunityIcons name={'login'} size={16} color={'white'} style={{marginRight: 8}}/>
          <ThemedText style={{color: 'white'}}>Log In</ThemedText>
        </CardView>
      </View>
    );
  }

  let helpButton;
  if(enableHelp){
    helpButton = (
      <Touchable onPress={()=>{
        if(!isLoading){
          setHelpModal(true);
        }
      }}>
        <View style={ styles.footer }>
          <ThemedText>여기를 눌러 도움 얻기</ThemedText>
          <ThemedText>(C)2018-Present Sleepy OWL</ThemedText>
          <Image style={{width: 60, height: 60, backgroundColor: 'white', borderRadius: 30, margin: 8}}
            source={ require('../assets/imgs/Sowl_Logo.png') }/>
        </View>
      </Touchable>
    );
  }else{
    helpButton = (
      <View style={ styles.footer }>
        <ThemedText>(C)2018-Present Sleepy OWL</ThemedText>
        <Image style={{width: 60, height: 60, backgroundColor: 'white', borderRadius: 30, margin: 8}} 
          source={ require('../assets/imgs/Sowl_Logo.png') }/>
      </View>
    );
  }

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView  style={ styles.container } behavior="padding" enabled>
        <View style={ styles.container }>
          <View style={ styles.title_container }>
            <Image source={ require('../assets/imgs/icon.png') } style={{width: 150, height: 150}}/>
          </View>
          <View style={ styles.login_container }>
            {logInContainer}
            {helpButton}
          </View>
        </View>
        <SnackBar visible={snackBar} textMessage={msg}/>
        <ErrorModal visible={errorModal} navigation={props.navigation}
          error={errorObj} errorMsg={errorMsg} onClose={()=>setErrorModal(false)}/>
        <HelpModal visible={helpModal} navigation={props.navigation}
          onClose={()=>setHelpModal(false)} isDuringLogin={true}/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

Login.navigationOptions = {
  header: null
};

class LoginInput extends Component{
  constructor(props){
    super(props);
    const colorScheme =  Appearance.getColorScheme();
    this.state = {
      bgColor: colorScheme === 'dark' ? '#2a2a2a':'rgba(220, 220, 220, 0.8)',
      txtColor: colorScheme === 'dark' ? 'white':'black'
    };
    this.component = React.createRef();
  }
  componentDidMount(){
    Appearance.addChangeListener(({colorScheme}) => {
      this.setState({
        bgColor: colorScheme === 'dark' ? '#2a2a2a':'rgba(220, 220, 220, 0.8)',
        txtColor: colorScheme === 'dark' ? 'white':'black'
      });
    });
  }
  focus(){
    this.component.current.focus();
  }
  render(){
    return(
      <TextInput {...this.props} 
        ref={this.component}
        style={{
          height: 50,
          backgroundColor: this.state.bgColor,
          marginBottom: 15,
          paddingHorizontal: 20,
          borderRadius: 10,
          color: this.state.txtColor
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    textAlign: 'center'
  },
  login_container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 140
  },
  button_container: {
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(60, 60, 60, 0.8)',
    paddingVertical: 20
  },
  footer: {
    marginTop: 10,
    alignItems: 'center'
  },
  info: {
    textAlign: 'center',
    padding: 5
  },
});
