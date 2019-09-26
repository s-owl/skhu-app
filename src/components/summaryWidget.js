import React, {Component} from 'react';
import {View, Text} from 'react-native';
import DBHelper from '../tools/dbhelper';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {SmallWeatherWidget} from './weather';

 
export default class SummaryWidget extends Component{
  constructor(props){
    super(props);
    this.state = {
      msg: '좋은 하루 되세요!'
    };
  }

  async componentDidMount(){
    let choice = Math.round(Math.random() * 2);
    let msg = '좋은 하루 되세요!';
    if(choice==0){
      let now = new Date().getHours();
      if(now >= 6 && now <= 9){
        msg = '좋은 아침입니다.';
      }else if(now >= 12 && now < 15){
        msg = '점심 식사는 하셨나요?';
      }else if(now >= 20 && now < 24){
        msg = '오늘 하루 어떠셨나요?';
      }else{
        msg = '좋은 하루 되세요!';
      }
    }else if(choice==1){
      this.db = new DBHelper();
      const result = await this.db.getTodayClassCount();
      if(result != undefined){
        if(result.classes > 0){
          msg = `오늘 ${result.classes}개의 강의가 있습니다.`;
        }else{
          msg = '오늘은 강의가 없습니다.';
        }
       
      }
    }else{
      let today = new Date();
      let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
        'year': today.getFullYear(),
        'month': today.getMonth() + 1
      }), false);
      if (schedule.ok) {
        let data = await schedule.json();
        for (let item of data.schedules) {
          const rawArr = item.period.includes(' ~ ')? item.period.split(' ~ ') : [item.period];
          const dates = rawArr.map(item => {
            const date = item.split('-');
            return({
              month: date[0], day: date[1]
            });
          });
          console.log('today:'+JSON.stringify(today.getDate()));
          if((dates.length == 2 && parseInt(today.getDate()) <= parseInt(dates[1].day)) || 
          (dates.length == 1 && parseInt(today.getDate()) <= parseInt(dates[0].day))){
            msg = `${item.content}(${item.period})`;
            break;
          }
        }
      }
    }
    this.setState({msg: msg});
  }

  render(){
    return(
      <View style={{flexDirection: 'column', flex: 0, width: '100%',
        padding: 8, justifyContent: 'center', marginTop: 8}}>
        <View style={{flexDirection: 'row', flex: 0, width: '100%', justifyContent: 'center'}}>
          <Text style={{fontSize: 24}}>{this.state.msg}</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 8, flex: 0, width: '100%', justifyContent: 'center'}}>
          <SmallWeatherWidget
            unit='metric' appid={BuildConfigs.OPENWEATHERMAP_API_KEY}/>
          <SmallWeatherWidget
            unit='metric' appid={BuildConfigs.OPENWEATHERMAP_API_KEY}
            name='성공회대' position={{latitude:'37.48750', longitude:'126.82564'}}/>
        </View>
      </View>
    );
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}