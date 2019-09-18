import React, { Component } from 'react';
import {
  Text, View, Image, 
  ScrollView, SafeAreaView, ActivityIndicator, 
} from 'react-native';
import { CardView } from './components/components';
import ForestApi from './tools/apis';
import SummaryWidget from './components/summaryWidget';
import BuildConfigs from './config';
import DateTools from './tools/datetools';
import DBHelper from './tools/dbhelper';
import FetchHelper from './tools/fetchHelper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import Touchable from './components/touchable';

export default class Main extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: '홈',
      header: null // 헤더 비활성화
    };
  };
  constructor(props) {
    super(props);
    this.db = new DBHelper();
    this.db.fetchAttendance();
    this.db.fetchTimetable();
    FetchHelper.fetchMealsUrl().then(url => this.setState({ url }));
  }
  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'whitesmoke'}}>
        <ScrollView>
          <View style={{ marginTop: 50, padding: 16 }}>
            <SummaryWidget />
            <View style={{flex: 0, flexDirection: 'row', width:'100%',
              marginTop: 8, marginBottom: 8}}>
              <ShortcutButton
                icon="check-circle"
                label="출결 현황"
                onPress={() => this.props.navigation.navigate('Attendance')}/>
              <ShortcutButton
                icon="insert-chart"
                label="이수 학점"
                onPress={() => this.props.navigation.navigate('Credits')}/>
              <ProfileButton/>
            </View>

            <Text style={{ fontSize: 20, marginTop: 16, marginLeft: 16 }}>다음 강의</Text>
            <NextClassInfo dbHelper={this.db} onPress={() => {
              this.props.navigation.navigate('Timetable');
            }} />
            <Text style={{ fontSize: 20, marginTop: 16, marginLeft: 16 }}>학사 일정</Text>
            <MonthlySchedule onPress={() => {
              this.props.navigation.navigate('Schedules');
            }} />
            <Text style={{ fontSize: 20, marginTop: 16, marginLeft: 16 }}>학식</Text>
            <Meal url={this.state.url} onPress={() => {
              this.props.navigation.navigate('Meal');
            }} />

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

class ProfileButton extends Component{
  constructor(props){
    super(props);
    this.state = {
      image:{
        uri: require('../assets/imgs/icon.png')
      },
      name: '인증 정보'
    };
  }


  async componentDidMount(){
    try{
      let res = await ForestApi.get('/user/profile', true);
      if(res.ok){
        let profile = await res.json();
        this.setState({
          name: profile.name,
          image: {uri: profile.image}
        });
      }
    }catch(err){
      console.log(err);
    }
  }

  render(){
    return(
      <Touchable borderless={true} style={{flex:1, alignItems:'center'}}
        onPress={this.props.onPress}>
        <Image
          style={{width: 50, height: 50, borderRadius: 25, padding: 8,
            borderColor: 'lightgrey', borderWidth: 1, backgroundColor: 'lightgrey'}}
          source={this.state.image}
          onError={(error)=>console.log(error)}
        />
        <Text style={{padding: 8}}>{this.state.name}</Text>
      </Touchable>
    );
  }
}

class ShortcutButton extends Component{
  render(){
    return(
      <Touchable borderless={true} style={{flex:1, alignItems:'center'}}
        onPress={this.props.onPress}>
        <MaterialIcons name={this.props.icon} size={32}
          style={{borderRadius: 24,
            borderColor: 'lightgrey',
            borderWidth: 1,
            padding: 8}} />
        <Text style={{padding: 8}}>{this.props.label}</Text>
      </Touchable>
    );
  }
}

class NextClassInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      time: '',
      attendance: '',
      isLoading: false
    };
  }
  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      const data = await this.props.dbHelper.getNextClassInfo();
      if (data != undefined) {
        this.setState({
          name: data.title, time: `${DateTools.dayOfWeekNumToStr(data.day)} `
            + `${data.starts_at} ~ ${data.ends_at} @ ${data.room}`,
          attendance: `출석 ${data.attend}, 지각 ${data.late}, 결석 ${data.absence}, `
            + `공결 ${data.approved}, 생공 ${data.menstrual}, 조퇴 ${data.early}`,
          isLoading: false
        });
      } else {
        this.setState({ time: '다음 강의가 없습니다.', isLoading: false });
      }


    } catch (err) {
      this.setState({ time: '다음 강의 정보를 조회하지 못했습니다.', isLoading: false });
      console.log(err);

    }
  }
  render() {
    let content;
    if (this.state.isLoading) {
      content = (
        <View style={{ justifyContent: 'center', padding: 32 }}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    } else {
      content = (
        <View>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{this.state.name}</Text>
          <Text style={{ fontSize: 20 }}>{this.state.time}</Text>
          <Text>{this.state.attendance}</Text>
        </View>
      );
    }
    return (
      <CardView onPress={this.props.onPress} elevate={true}
        actionLabel="이번 학기 시간표 보기 >">
        {content}
      </CardView>
    );
  }
}

class MonthlySchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: '',
      contents: '',
      isLoading: false
    };
  }
  async componentDidMount() {
    this.setState({ isLoading: true });
    let today = new Date();
    let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
      'year': today.getFullYear(),
      'month': today.getMonth() + 1
    }), false);
    if (schedule.ok) {
      let data = await schedule.json();
      let dates = '', contents = '';
      for (let item of data.schedules) {
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
  render() {
    let content;
    if (this.state.isLoading) {
      content = (
        <View style={{ justifyContent: 'center', padding: 32 }}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    } else {
      content = (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 0, fontWeight: 'bold' }}>{this.state.dates}</Text>
            <Text style={{ flex: 1 }}>{this.state.contents}</Text>
          </View>
        </View>
      );
    }
    return (
      <CardView onPress={this.props.onPress} elevate={true}
        actionLabel="학사 일정 더 보기 >">
        {content}
      </CardView>
    );
  }
}

//메인 오늘학식
class Meal extends Component {
  state = {
    meal: null,
    isLoading: true
  };

  componentDidMount() {
    FetchHelper.fetchMealsData(this.props.url).then(meals => {
      
      // TODO: 오늘 구하는 공식 들어가야함 일단은 첫번째 인덱스 배열 값 가져옴...

      let day = new Date().getDay(); //0 : 일요일,  1: 월요일...
      day = (day == 0 || day == 6) ? 4 : day - 1;

      console.log(meals.length);
      this.setState({
        meal:  meals[day],
        isLoading: false
      });
    });
  }

  render() {
    let content;
    const { isLoading, meal } = this.state;
    if (isLoading || !meal) {
      content = (
        <View style={{ justifyContent: 'center', padding: 32 }}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }
    else {
      content = (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="rice" size={20}/>
            <Text style={{ marginStart: 5 }}>{meal.day} 식단</Text>
          </View>
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <CardView outlined={true} style={{margin: 5, flex: 1}}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>학식</Text>
                <Text style={{ marginBottom: 10, marginTop: 5 }}>{meal.lunch.a.diet}</Text>
              </CardView>
              <CardView outlined={true} style={{margin: 5, flex: 1}}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>일품</Text>
                <Text style={{ marginBottom: 10, marginTop: 5 }}>{meal.lunch.b.diet}</Text>
              </CardView>
              <CardView outlined={true} style={{margin: 5, flex: 1}}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>석식</Text>
                <Text style={{ marginBottom: 10, marginTop: 5 }}>{meal.dinner.a.diet}</Text>
              </CardView>
            </View>
          </View>
        </View>
      );
    }
    return (
      <CardView onPress={this.props.onPress} elevate={true}
        actionLabel="주간 식단 보기 >">
        {content}
      </CardView>

    );
  }
}