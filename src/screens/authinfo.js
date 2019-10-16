import React, {Component} from 'react';
import {View, Image, Text, ActivityIndicator, Clipboard, Linking} from 'react-native';
import {CardView} from '../components/components';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ScrollView} from 'react-native-gesture-handler';


export default class Authinfo extends Component{
    static navigationOptions = ({navigation, navigationOptions}) => {
      const {params} = navigation.state;
        
      return {
        title: '',
        headerStyle: {
          backgroundColor: 'whitesmoke',
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          shadowRadius: 0,
        }
      };
    };

    render(){
      return(
        <ScrollView style={{padding: 8, backgroundColor: 'whitesmoke'}}>
          <Profile style={{marginTop: 24}}/>
          <ClassInfoCard style={{padding: 8}}/>
          <OtpCard/>
        </ScrollView>
      );
    }
}

class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      image: require('../../assets/imgs/profilePlaceholder.png'),
      name: '이름', id: '학번',
      classtype: '주간/야간',
      college: '대학',
      coursetype: '과정',
      department: '학부/과',
      grade: '학년',
      major: '전공',
      state: '학적'
    };
  }

  async componentDidMount(){
    try{
      let res = await ForestApi.get('/user/profile', true);
      if(res.ok){
        let profile = await res.json();
        this.setState({
          ...profile,
          image: {uri: profile.image}
        });
      }
    }catch(err){
      console.log(err);
    }
  }

  render(){
    return(
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          style={{width: 100, height: 100, borderRadius: 50, padding: 8,
            borderColor: 'lightgrey', borderWidth: 1, backgroundColor: 'lightgrey'}}
          source={this.state.image}
          onError={(error)=>console.log(error)}
        />
        <Text style={{padding: 8, fontSize: 24}}>{this.state.name}({this.state.id})</Text>
        <Text>{this.state.college} {this.state.department} {this.state.major}</Text>
        <Text>{this.state.grade} {this.state.coursetype} {this.state.classtype} {this.state.state}</Text>
      </View>
    );
  }
  
}

class ClassInfoCard extends Component{
  constructor(props){
    super(props);
    this.state = {
      counselor: '지도교수',
      class: '반/분반',
      google: 'Google Classroom',
      isLoading: true
    };
  }

  async componentDidMount(){
    let res = await ForestApi.get('/user/classinfo', true);
    if(res.ok){
      let data = await res.json();
      console.log(data);
      this.setState({
        counselor: data.counselor,
        class: (data.class == '')? '(없음)' : data.class,
        google: data.google,
        isLoading: false
      });
    }
  }

  render(){
    let googleClassroom;
    if (this.state.isLoading) {
      googleClassroom = (
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    } else {
      googleClassroom = (
        <View>
          <Text  style={{fontSize: 20}}>{this.state.google}</Text>
          <Text>Google Classroom 사용에 필요한 최초 로그인 정보입니다.</Text>
        </View>
      );
    }
    return(
      <View style={{marginTop: 8}}>
        <View style={{alignItems: 'center'}}>
          <Text>{this.state.counselor}</Text>
          <Text>반/분반: {this.state.class}</Text>
        </View>
        <Text style={{fontSize: 20, marginTop: 16, marginLeft: 16}}>Google Classroom</Text>
        <CardView elevate={true} style={{margin: 8}} actionLabel='Google Classroom 으로 이동 >'
          onPress={()=>{
            Linking.openURL('https://classroom.google.com');
          }}>
          {googleClassroom} 
        </CardView>
      </View>
    );
  }
}

class OtpCard extends Component{
  constructor(props){
    super(props);
    this.state = {
      otpCode: '##########',
      timeLeft: 60
    };
  }

  componentDidMount(){
    this.refreshOtp();
    setInterval(()=>{
      if(this.state.timeLeft <= 1){
        this.refreshOtp();
      }else if(this.state.timeLeft >= 1){
        this.setState({
          timeLeft: this.state.timeLeft - 1
        });
      }
    }, 1000);
  }

  async refreshOtp(){
    let res = await ForestApi.get('/user/otp', true);
    if(res.ok){
      let data = await res.json();
      console.log(data);
      this.setState({
        otpCode: data.otpcode,
        timeLeft: data.time_left_sec 
      });
    }
  }

  render(){
    return(
      <View>
        <Text style={{fontSize: 20, marginTop: 16, marginLeft: 16}}>OTP 코드</Text>
        <CardView actionLabel='터치하여 복사하기' elevate={true} style={{margin: 8}}
          onPress={()=>{
            Clipboard.setString(this.state.otpCode);
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 32}}>{this.state.otpCode}</Text>
          <Text>{this.state.timeLeft}초 후 코드가 변경됩니다.</Text>
        </CardView>
      </View>
    );
  }
}