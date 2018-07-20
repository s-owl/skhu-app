import React, {Component} from 'react';
import {CardItem} from '../components/components';
import { ScrollView, View, Text } from 'react-native';
import ForestApi from '../tools/apis';


export default class Schedules extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
          
      return {
        title: '학사 일정',
      };
    };
    constructor(props){
      super(props);
    }
    render(){
      const today = new Date();
      return(
        <ScrollView>
          <ScheduleComponent year={today.getFullYear()} month={today.getMonth()+1}/>
          <ScheduleComponent year={today.getFullYear()} month={today.getMonth()+2}/>
          <ScheduleComponent year={today.getFullYear()} month={today.getMonth()+3}/>
        </ScrollView>
      );
    }
}

class ScheduleComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      dates: '',
      contents: ''
    };
  }
  async componentDidMount(){
    let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
      'year': this.props.year,
      'month': this.props.month
    }), false);
    console.log(schedule);
    if(schedule.ok){
      let data = await schedule.json();
      let dates = '', contents = '';
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
      <View>
        <CardItem isHeader={true}>
          <Text>{this.props.year}{'.'}{this.props.month}</Text>
        </CardItem>
        <CardItem style={{flexDirection: 'row'}}>
          <Text style={{flex: 0, fontWeight: 'bold'}}>{this.state.dates}</Text>
          <Text style={{flex: 1}}>{this.state.contents}</Text>
        </CardItem>
      </View>
    );
  }
}