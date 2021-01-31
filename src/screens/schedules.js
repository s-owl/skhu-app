import React, {Component} from 'react';
import ListItem from '../components/listitem';
import {ThemedText} from '../components/components';
import ScheduleTable from '../components/scheduletable';
import {ScrollView, View} from 'react-native';
import moment from 'moment';

export default class Schedules extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let tables = [];
    let months = moment();

    for (let i = 0; i < 3; i++) {
      let year = moment().year();
      tables.push(
        <View>
          <ListItem isHeader={true}>
            <ThemedText>{year}{'.'}{months.month() + 1}</ThemedText>
          </ListItem>
          <ListItem>
            <ScheduleTable year={year} month={months.month()+1}/>
          </ListItem>
        </View>
      );

      months.add(1, 'months');
    }

    return(
      <ScrollView style={{height: '100%'}}>
        { tables }
      </ScrollView>
    );
  }
}
