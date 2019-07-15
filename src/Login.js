import React, { Component } from 'react';
import {
  StyleSheet, Text ,View, Image, TextInput, Linking,
  StatusBar, SafeAreaView, KeyboardAvoidingView,
  Alert, ActivityIndicator, NetInfo, Platform
} from 'react-native';
import ForestApi from './tools/apis';
import NavigationService from './tools/NavigationService';
import * as SecureStore from 'expo-secure-store';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import SnackBar from 'react-native-snackbar-component';
import {CardView, CardItem, BottomModal} from './components/components';
import BuildConfigs from './config';
import Touchable from './components/touchable';


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
      isLoading: false,
      showHelp: false,
      enableHelp: true,
      msg: '',
      snackbar: false
    };
    this.textInput = {
      idInput: '',
      pwInput: ''
    };
  }
  showSnackbar(msg){
    this.setState({msg: msg, snackbar: true});
    setTimeout(()=>{
      this.setState({msg: '', snackbar: false});
    },3000);
  }
  async componentDidMount() {
    if(Platform.OS == 'ios') StatusBar.setBarStyle({barStyle: 'light-content'});
    const isLoggedOut = this.props.navigation.getParam('loggedOut', false);
    if(isLoggedOut){
      this.showSnackbar('로그아웃 되었습니다.');
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
        <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
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
          <CardView elevate={true} onPress={()=>{
            let id = this.textInput.idInput.replace(/\s/g,'');
            let pw = this.textInput.pwInput.replace(/\s/g,'');
            this.runLogInProcess(id, pw);
          }} style={{backgroundColor: '#569f59', justifyContent: 'center', flexDirection: 'row'}}>
            <MaterialCommunityIcons name={'login'} size={16} color={'white'} style={{marginRight: 8}}/>
            <Text style={{color: 'white'}}>Log In</Text>
          </CardView>
        </View>
      );
    }

    let helpButton;
    if(this.state.enableHelp){
      helpButton = (
        <Touchable onPress={()=>{
          if(!this.state.isLoading){
            this.setState({showHelp: true});
          }
        }}>
          <View style={ styles.footer }>
            <Text>여기를 눌러 도움 얻기</Text>
            <Text>(C)2018-Present Sleepy OWL</Text>
            <Image style={{width: 60, height: 60}} source={ require('../assets/imgs/Sowl_Logo.png') }/>
          </View>
        </Touchable>
      );
    }else{
      helpButton = (
        <View style={ styles.footer }>
          <Text>(C)2018-Present Sleepy OWL</Text>
          <Image style={{width: 60, height: 60}} source={ require('../assets/imgs/Sowl_Logo.png') }/>
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
          <BottomModal
            title="도움 얻기" visible={this.state.showHelp}
            onRequestClose={()=>{
              this.setState({showHelp: false});
            }}
            buttons={[{
              label: '닫기',
              onPress: ()=>{this.setState({showHelp: false});}
            }]}>
            <CardItem onPress={()=>{
              Linking.openURL('http://sid.skhu.ac.kr/SID03/SID0301');
              this.setState({showHelp: false});
            }}>
              <Text>계정 찾기</Text>
            </CardItem>
            <CardItem onPress={()=>{
              Linking.openURL('http://sid.skhu.ac.kr/SID02/SID0201');
              this.setState({showHelp: false});
            }}>
              <Text>비밀번호 복구</Text>
            </CardItem>
            <CardItem onPress={()=>{
              NavigationService.navigate('About');
              this.setState({showHelp: false});
            }}>
              <Text>앱 정보</Text>
            </CardItem>
          </BottomModal>
          <SnackBar visible={this.state.snackbar} textMessage={this.state.msg}/>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  async runLogInProcess(id, pw){
    console.log('Logging in...');
    try{
      this.setState({isLoading: true, enableHelp: false});
      if(id.length <= 0 || pw.length <= 0){
        alert('학번 또는 비밀번호가 입력되지 않았습니디.');
        this.setState({isLoading: false, enableHelp: true});
      }else if(pw.length < 8){
        alert('비밀번호가 너무 짧습니다. 비밀번호는 8자리 이상입니다.\n\n'
        +'신/편입생 신규 계정에 종합정보시스템이 부여하는 초기 비밀번호는 s + (주민번호 뒤 7자리)로, 총 8자리 이며, 비밀번호 변경시 9자리 이상을 요구합니다.\n\n'
        +'8자리 미만 비밀번호 사용 시 PC 에서 종합정보시스템에 접속하여 비밀번호 변경 후 사용해 주세요.\n\n'
        +'비밀번호 변경에 문제가 있는 경우 성공회대학교 전자계산소에 문의하시기 바랍니다.');
        this.setState({isLoading: false, enableHelp: true});
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
          this.setState({isLoading: false, enableHelp: true});
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
          this.setState({isLoading: false, enableHelp: true});
          let msg = await response.text();
          setTimeout(()=>{
            Alert.alert(
              '로그인 실패',
              '입력된 학번(아이디) 또는 비밀번호를 다시한번 확인하세요.\n\n'
              +'forest.skhu.ac.kr 그리고 sam.skhu.ac.kr 양쪽 모두 로그인 가능해야 앱에서 로그인이 가능합니다.\n\n'
              +'sam.skhu.ac.kr 쪽에서 로그인이 불가능한 경우, 성공회대학교 전자계산소에 문의하세요.\n\n'
              +`추가정보:\n${msg}`,
              [
                {text: '확인', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
          }, 10);
        }else{
          this.setState({isLoading: false, enableHelp: true});
        }
      }
    }catch(err){
      this.setState({isLoading: false, enableHelp: true});
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
    marginTop: 10,
    alignItems: 'center'
  },
  info: {
    textAlign: 'center',
    padding: 5
  },
});
