import React, {Component} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Timetable, {convertForTimetable} from '../components/Timetable'
import DBHelper from '../tools/dbhelper';
import DateTools from '../tools/datetools';
import BuildConfigs from '../config';

export default class StudentTimetable extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
        
    return {
      title: '시간표',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      timetable: [],
      isLoading: false
    };
    this.db = new DBHelper();
  }

  componentDidMount(){
    this.loadTimetable();
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else if(this.state.timetable.length <= 0){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <Text>시간표를 불러오지 못했거나, 수강한 강의가 없어 표시할 시간표 데이터가 없습니다.</Text>
        </View>
      );
    }else{
      return(
        <Timetable timetable={this.state.timetable} />
      );
    }
  }

  loadTimetable(){
    this.setState({isLoading: true});
    this.db.getTimetableData().then((query)=>{
      this.setState({
        timetable: convertForTimetable(query._array),
        isLoading: false
      });
    });
  }
}
