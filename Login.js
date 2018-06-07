import React, { Component } from 'react';
import { 
  StyleSheet, Text ,View, Image, TextInput, Button,
   StatusBar, SafeAreaView, Keyboard, KeyboardAvoidingView,
  AsyncStorage, Alert, ActivityIndicator
} from 'react-native';
import ForestApi from './apis';

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
        idInput: "",
        pwInput: "",
        isLoading: false
      }
    }
    componentDidMount() {
      this.forestApi = new ForestApi('http://localhost:3000');
    }

    render() {
      let logInContainer;
      if(this.state.isLoading){
        logInContainer = (
          <ActivityIndicator size="large" color="#0000ff" />
        )
      }else{
        logInContainer = (
          <View >
                <TextInput style={{fontSize: 20, padding: 10}} placeholder='아이디(학번) 입력' keyboardType='default' 
                returnKeyType='next' autocorrect={ false } onSubmitEditing={ () => this.refs.password.focus() }
                onChangeText={(text)=>{this.setState({idInput: text})}}>
                </TextInput>
                <TextInput style={{fontSize: 20, padding: 10}} placeholder='비밀번호 입력' 
                returnkeyType='go' ref={ 'password' } secureTextEntry={ true } autocorrect={ false }
                onChangeText={(text)=>{this.setState({pwInput: text})}}>
                </TextInput>
                <Button
                  title="Log In"
                  onPress={async()=>{ 
                   try{
                    this.setState({isLoading: true});
                    let id = this.state.idInput.replace(/\s/g,'');
                    let pw = this.state.pwInput.replace(/\s/g,'');
                    if(id.length <= 0 || pw.length <= 0){
                      alert("학번 또는 비밀번호가 입력되지 않았습니디.");
                      this.setState({isLoading: false});
                    }else{
                      let response = await this.forestApi.login(id, pw);
                      if(response.ok){
                        let data = await response.json();
                        await AsyncStorage.setItem('CredentialOld', data['credential-old']);
                        await AsyncStorage.setItem('CredentialNew', data['credential-new']);
                        await AsyncStorage.setItem('CredentialNewToken', data['credential-new-token']);
                        this.setState({isLoading: false});
                        this.props.navigation.navigate('Main');
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
                          )
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
                        err,
                        [
                          {text: '확인', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                      )
                    }, 10);
                    
                   }
                  }}/>
              </View>
        )
      }
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
              {logInContainer}
              <View style={ styles.footer }>
                  <Text style={ styles.info }>성공회대학교 종합정보시스템{"\n"}계정으로 로그인.</Text>
                  <Text style={ styles.copy }>(C)2018-Present Sleey OWL</Text>
                <Image style={ styles.sowl_logo } source={ require('./assets/login/Sowl_Logo.png') }>
                </Image>
                </View>
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
      flexDirection: 'column',
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
      backgroundColor: 'white',
      marginBottom: 140,
      marginLeft: 20,
      marginRight: 20,
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
      width: 100,
      height: 100,
    },
    info: {
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 5
    },
    copy: {
      fontWeight: '200',
      marginTop: 30
    }
  });
  