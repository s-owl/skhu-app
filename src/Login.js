import React, { Component } from 'react';
import {
  StyleSheet, Text ,View, Image, TextInput, Button,
  StatusBar, SafeAreaView, Keyboard, KeyboardAvoidingView,
  Alert, ActivityIndicator, NetInfo
} from 'react-native';
import ForestApi from './tools/apis';
import NavigationService from './tools/NavigationService';
import {SecureStore, Constants} from 'expo';
import SnackBar from 'rn-snackbar';
import {CardView} from './components/components';

export default class Login extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      header: null // 헤더 비활성화
    };
  };
  constructor(props){
    super(props);
    this.state = {
      isLoading: false
    };
    this.textInput = {
      idInput: '',
      pwInput: ''
    };
  }
  async componentDidMount() {
    const isLoggedOut = this.props.navigation.getParam('loggedOut', false);
    if(isLoggedOut){
      SnackBar.show('로그아웃 되었습니다.', { position: 'top', style: { paddingTop: 30 } });
    }
    const connInfo = await NetInfo.getConnectionInfo();
    if(connInfo.type == 'none'){
      alert('본 앱을 사용하려면 네트워크 연결이 필요합니다. 네트워크 연결 상태 확인 후, 앱을 다시 샐행하세요.');
    }else{
      let id = await SecureStore.getItemAsync('userid');
      let pw = await SecureStore.getItemAsync('userpw');
      if(id !== null && pw !== null){
        this.runLogInProcess(id, pw);
      }
    }
  }

  render() {
    let logInContainer;
    if(this.state.isLoading){
      logInContainer = (
        <ActivityIndicator size="large" color="#616A6B" />
      );
    }else{
      logInContainer = (
        <View>
          <Text style={ styles.info }>성공회대학교 종합정보시스템{'\n'}계정으로 로그인 하세요.</Text>
          <TextInput style={ styles.login_input } placeholder='아이디(학번) 입력'
            underlineColorAndroid="transparent"
            returnKeyType='next' autocorrect={ false } onSubmitEditing={ () => this.refs.password.focus() }
            onChangeText={(text)=>{this.textInput.idInput = text;}} keyboardType='default'>
          </TextInput>
          <TextInput style={ styles.login_input } placeholder='비밀번호 입력' secureTextEntry={ true }
            underlineColorAndroid="transparent"
            returnkeyType='go' ref={ 'password' }  autocorrect={ false }
            onSubmitEditing={ () => {
              let id = this.textInput.idInput.replace(/\s/g,'');
              let pw = this.textInput.pwInput.replace(/\s/g,'');
              this.runLogInProcess(id, pw);
            } }
            onChangeText={(text)=>{
              this.textInput.pwInput = text;
            }}>
          </TextInput>
          <CardView onPress={()=>{
            let id = this.textInput.idInput.replace(/\s/g,'');
            let pw = this.textInput.pwInput.replace(/\s/g,'');
            this.runLogInProcess(id, pw);
          }} style={{backgroundColor: '#569f59', alignItems: 'center'}}>
            <Text style={{color: 'white'}}>Log In</Text>
          </CardView>
          
        </View>
      );
    }

    return (
      <SafeAreaView style={ styles.container }>
        <KeyboardAvoidingView  style={ styles.container }>
          <View style={ styles.container }>
            <View style={ styles.title_container }>
              <Image source={ require('../assets/icon.png') } width={100} height={100}/>
            </View>
            <View style={ styles.login_container }>
              {logInContainer}
              <View style={ styles.footer }>
                <Text style={ styles.copy }>(C)2018-Present Sleepy OWL</Text>
                <Image width={100} height={100} source={ require('../assets/login/Sowl_Logo.png') }/>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  async runLogInProcess(id, pw){
    console.log('Logging in...');
    try{
      this.setState({isLoading: true});
      if(id.length <= 0 || pw.length <= 0){
        alert('학번 또는 비밀번호가 입력되지 않았습니디.');
        this.setState({isLoading: false});
      }else{
        let response = await ForestApi.login(id, pw);
        if(response.ok){
          let data = await response.json();
          await SecureStore.setItemAsync('CredentialOld', data['credential-old']);
          await SecureStore.setItemAsync('CredentialNew', data['credential-new']);
          await SecureStore.setItemAsync('CredentialNewToken', data['credential-new-token']);
          await SecureStore.setItemAsync('userid', id);
          await SecureStore.setItemAsync('userpw', pw);
          this.setState({isLoading: false});
          NavigationService.reset('Main');
          // this.props.navigation.navigate('Main');
        }else if(response.status == 400){
          this.setState({isLoading: false});
          setTimeout(() => {
            Alert.alert(
              '로그인 오류',
              '입력된 학번(아이디) 또는 비밀번호가 올바르지 않습니다.',
              [
                {text: '확인', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
          }, 10);

        }else if(response.status == 401){
          this.setState({isLoading: false});
          setTimeout(()=>{
            Alert.alert(
              '로그인 실패',
              '입력된 학번(아이디) 또는 비밀번호를 다시한번 확인하세요.',
              [
                {text: '확인', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
          }, 10);
        }else{
          this.setState({isLoading: false});
        }
      }
    }catch(err){
      this.setState({isLoading: false});
      console.log(err);
      setTimeout(()=>{
        Alert.alert(
          '로그인 오류',
          '서버에 문제가 있거나 네트워크 상태에 문제가 있을 수 있습니다.\n'+err,
          [
            {text: '확인', onPress: () => console.log('OK Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
      }, 100);

    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // flexDirection: 'column',
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
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 140
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
  footer: {
    marginTop: 20,
    alignItems: 'center'
  },
  info: {
    textAlign: 'center',
    padding: 5
  },
  copy: {
    marginTop: 20
  }
});
