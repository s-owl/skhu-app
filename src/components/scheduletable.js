import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {ThemedText} from '../components/components';
import BuildConfigs from '../config';
import ForestApi from '../tools/apis';

export default class ScheduleTable extends Component{
  constructor(props){
    super(props);
    this.state = {
      dates: [],
      contents: [],
      isLoading: false
    };
  }
  async componentDidMount(){
    this.setState({isLoading: true});
    let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
      'year': this.props.year,
      'month': this.props.month
    }), false);
    if(schedule.ok){
      let data = await schedule.json();
      let dates = [], contents = [];
      for(let item of data.schedules){
        dates.push(`${item.period}`);
        contents.push(` | ${item.content}`);
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
        <View style={{justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      scheduleTable = [];
      for (const i in this.state.dates) {
        const con = this.state.contents[i];
        const date = this.state.dates[i];
        scheduleTable.push(
          <View style={{width: '100%', flexDirection: 'row'}} key={con + date}>
            <ThemedText style={{flex:0, width: '35%',fontWeight: 'bold'}}>{date}</ThemedText>
            <ThemedText style={{flex:1, flexWrap: 'wrap'}}>{con}</ThemedText>
          </View>
        );
      }
      content = (
        <View style={{alignItems: 'center'}}>
          { scheduleTable }
        </View>
      );
    }
    return(
      <View>
        {content}
      </View>
    );
  }
}
