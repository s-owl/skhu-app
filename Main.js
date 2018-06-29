import React, { Component } from 'react';
import { StyleSheet, Text ,View, 
  ScrollView, SafeAreaView } from 'react-native';
import { CardView } from './components';
import { MaterialIcons } from '@expo/vector-icons';
import ForestApi from './apis';
import { SmallWeatherWidget } from './components/weather';
import BuildConfigs from './config';

export default class Main extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;

        return {
          header: null // 헤더 비활성화
        };
    };
    constructor(props){
      super(props);
    }

    render() {
        return(
            <SafeAreaView>
                <ScrollView>
                    <View style={{marginTop: 50, padding: 16}}>
                        <SmallWeatherWidget unit="metric" appid={BuildConfigs.OPENWEATHERMAP_API_KEY}/>
                        <CardView style={{flex: 0, flexDirection: 'row'}} onPress={()=>{alert('clicked!')}}>
                            <MaterialIcons name="check-circle" size={20} style={{flex: 1}}/>
                            <Text style={{flex: 0}}>나의 출결 현황</Text>
                        </CardView>
                        <CardView style={{flex: 0, flexDirection: 'row'}} onPress={()=>{alert('clicked!')}}>
                            <MaterialIcons name="insert-chart" size={20} style={{flex: 1}}/>
                            <Text style={{flex: 0}}>현재 이수 학점</Text>
                        </CardView>
                        <Text style={{fontSize: 20, marginTop: 16}}>다음 강의</Text>
                        <NextClassInfo/>
                        <Text style={{fontSize: 20, marginTop: 16}}>학사 일정</Text>
                        <MonthlySchedule/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
  }

class NextClassInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      time: "",
      attendance: ""
    }
  }
  async componentDidMount(){
    let today = new Date();
    let semester = this.getSemesterCode(today.getMonth()+1);
    let timetable = await ForestApi.postToSam('/SSE/SSEAD/SSEAD03_GetList', JSON.stringify({
      'Yy': today.getFullYear(),
      'Haggi': semester.code,
      'HaggiNm': semester.name
    }), false);
    if(timetable.ok){
      let data = await timetable.json();
      data.DAT[0].GwamogKorNm
      // str += `${item.GwamogKorNm} \n ${item.Times} @ ${item.HosilCd} \n`;
      this.setState({
        name: data.DAT[0].GwamogKorNm,
        time: data.DAT[0].Times
      });
    }
    let attendance = await ForestApi.get('/user/attendance', true);
    if(attendance.ok){
      let data = await attendance.json();
      let item = data.attendance[0];
      console.log(data);
      this.setState({
          attendance:`출석 ${item.attend}, 지각 ${item.late}, 결석 ${item.absence}, `
              + `공결 ${item.approved}, 생공 ${item.menstrual}, 조퇴 ${item.early}` 
      });
    }
  }
  getSemesterCode(month){
    if(month >=1 && month < 3){
      return {code:"Z0104", name:"겨울학기"};
    }
    else if(month >=3 && month < 7){
      return {code:"Z0101", name:"1학기"};
    }
    else if(month >=7 && month < 9){
      return {code:"Z0103", name:"여름학기"};
    }
    else {
      return {code:"Z0102", name:"2학기"};
    }
  }
  render(){
    return(
      <CardView>
        <Text style={{fontSize: 25, fontWeight: 'bold'}}>{this.state.name}</Text>
        <Text style={{fontSize: 20}}>{this.state.time}</Text>
        <Text>{this.state.attendance}</Text>
      </CardView>
    )
  }
}

class MonthlySchedule extends Component{
  constructor(props){
    super(props);
    this.state = {
      dates: "",
      contents: ""
    }
  }
  async componentDidMount(){
    let today = new Date();
    let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
      'year': today.getFullYear(),
      'month': today.getMonth()+1
    }), false);
    if(schedule.ok){
        let data = await schedule.json();
        let dates = "", contents = "";
        for(let item of data.schedules){
          dates += `${item.period}\n`;
          contents += ` | ${item.content}\n`;
        }
        this.setState({
          dates: dates,
          contents: contents
        });
    }
  }
  render(){
    return(
      <CardView style={{flexDirection: 'row'}}>
        <Text style={{flex: 0, fontWeight: 'bold'}}>{this.state.dates}</Text>
        <Text style={{flex: 1}}>{this.state.contents}</Text>
      </CardView>
    )
  }
}