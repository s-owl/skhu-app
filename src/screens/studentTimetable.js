import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import Timetable, {convertForTimetable} from '../components/Timetable';
import DBHelper from '../tools/dbhelper';
import BuildConfigs from '../config';
import {ThemeText} from '../components/components';

export default class StudentTimetable extends Component{
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
          <ThemeText>시간표를 불러오지 못했거나, 수강한 강의가 없어 표시할 시간표 데이터가 없습니다.</ThemeText>
        </View>
      );
    }else{
      return(
        <Timetable timetable={this.state.timetable} />
      );
    }
  }

  async loadTimetable(){
    this.setState({isLoading: true});
    await this.db.fetchTimetable();
    const query = await this.db.getTimetableData();
    this.setState({
      timetable: convertForTimetable(query._array),
      isLoading: false
    });
  }
}
