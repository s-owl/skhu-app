import React, { Component } from 'react';
import { StyleSheet, Text ,View, 
  ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { CardView } from './components/components';
import { MaterialIcons } from '@expo/vector-icons';
import ForestApi from './tools/apis';
import { SmallWeatherWidget } from './components/weather';
import BuildConfigs from './config';
import DateTools from './tools/datetools';
import DBHelper from './tools/dbhelper';
import SnackBar from 'rn-snackbar';

export default class Main extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
      return {
        title: '홈',
        header: null // 헤더 비활성화
      };
    };
    constructor(props){
      super(props);
      this.db = new DBHelper();
      // this.db.removeUnnecessaryData();
      this.db.fetchAttendance();
      this.db.fetchTimeTable();
    }
    render() {
      return(
        <SafeAreaView>
          <ScrollView>
            <View style={{marginTop: 50, padding: 16}}>
              <SmallWeatherWidget unit="metric" appid={BuildConfigs.OPENWEATHERMAP_API_KEY}/>
              <CardView style={{flex: 0, flexDirection: 'row'}} 
                onPress={()=>{
                  this.props.navigation.navigate('Attendance');
                }}>
                <MaterialIcons name="check-circle" size={20} style={{flex: 1}}/>
                <Text style={{flex: 0}}>나의 출결 현황</Text>
              </CardView>
              <CardView style={{flex: 0, flexDirection: 'row'}} onPress={()=>{
                this.props.navigation.navigate('Credits');
              }}>
                <MaterialIcons name="insert-chart" size={20} style={{flex: 1}}/>
                <Text style={{flex: 0}}>현재 이수 학점</Text>
              </CardView>
              <Text style={{fontSize: 20, marginTop: 16}}>다음 강의</Text>
              <NextClassInfo dbHelper={this.db} onPress={()=>{
                this.props.navigation.navigate('Timetable');
              }}/>
              <Text style={{fontSize: 20, marginTop: 16}}>학사 일정</Text>
              <MonthlySchedule onPress={()=>{
                this.props.navigation.navigate('Schedules');
              }}/>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    async componentDidMount(){
      let res = await ForestApi.get('/user/userinfo', true);
      if(res.ok){
        const data = await res.json();
        SnackBar.show(`${data.userinfo.name}(${data.userinfo.id})님, 안녕하세요.`, 
          { position: 'top', style: { paddingTop: 30 }, duration: 2000  });
      }
    }
}

class NextClassInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      time: '',
      attendance: '',
      isLoading: false
    };
  }
  async componentDidMount(){
    try{
      this.setState({isLoading: true});
      const data = await this.props.dbHelper.getNextClassInfo();
      if(data != undefined){
        this.setState({
          name: data.title, time: `${DateTools.dayOfWeekNumToStr(data.day)} `
          +`${data.starts_at} ~ ${data.ends_at} @ ${data.room}`,
          attendance:`출석 ${data.attend}, 지각 ${data.late}, 결석 ${data.absence}, `
                + `공결 ${data.approved}, 생공 ${data.menstrual}, 조퇴 ${data.early}`,
          isLoading: false 
        });
      }else{
        this.setState({time: '다음 강의가 없습니다.', isLoading: false});
      }
      
    }catch(err){
      this.setState({time: '다음 강의 정보를 조회하지 못했습니다.', isLoading: false});
      console.log(err);
      
    }
    
  }
  render(){
    let content;
    if(this.state.isLoading){
      content = (
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      content = (
        <View>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>{this.state.name}</Text>
          <Text style={{fontSize: 20}}>{this.state.time}</Text>
          <Text>{this.state.attendance}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'grey'}}>이번 학기 시간표 보기</Text>
            <MaterialIcons name="chevron-right" size={16}/>
          </View>
        </View>
      );
    }
    return(
      <CardView onPress={this.props.onPress}>
        {content}
      </CardView>
    );
  }
}

class MonthlySchedule extends Component{
  constructor(props){
    super(props);
    this.state = {
      dates: '',
      contents: '',
      isLoading: false
    };
  }
  async componentDidMount(){
    this.setState({isLoading: true});
    let today = new Date();
    let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
      'year': today.getFullYear(),
      'month': today.getMonth()+1
    }), false);
    if(schedule.ok){
      let data = await schedule.json();
      let dates = '', contents = '';
      for(let item of data.schedules){
        dates += `${item.period}\n`;
        contents += ` | ${item.content}\n`;
      }
      this.setState({
        dates: dates,
        contents: contents,
        isLoading: false
      });
    }
  }
  render(){
    let content;
    if(this.state.isLoading){
      content = (
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      content = (
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{flex: 0, fontWeight: 'bold'}}>{this.state.dates}</Text>
            <Text style={{flex: 1}}>{this.state.contents}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'grey'}}>학사 일정 더 보기</Text>
            <MaterialIcons name="chevron-right" size={16}/>
          </View>
        </View>
      );
    }
    return(
      <CardView onPress={this.props.onPress}>
        {content}
      </CardView>
    );
  }
}