import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import DateTools from '../tools/datetools';
import moment from 'moment';

export function convertForTimetable(arr) {
  let displayData = [];
  for(let i=0; i<arr.length; i++){
    let item = arr[i];
    console.log(item);
    let startsAtDatetime = {
      hour: moment(item.starts_at, 'HH:mm:ss').hours(),
      mins: moment(item.starts_at, 'HH:mm:ss').minutes()};
    let endsAtDatetime = {
      hour: moment(item.ends_at, 'HH:mm:ss').hours(),
      mins: moment(item.ends_at, 'HH:mm:ss').minutes()};
    let sevenMorning = {hour: 8, mins: 0};
    if(displayData[item.day]==undefined){
      console.log(`init ${item.day}`);
      displayData[item.day] = [];
      displayData[item.day].push({
        isEmptyCell: true,
        time: `08:00:00 ~ ${item.starts_at}`,
        endsAt: startsAtDatetime,
        name:'',
        room:'',
        height: (((startsAtDatetime.hour - sevenMorning.hour)*60)
            + (startsAtDatetime.mins - sevenMorning.mins))
      });
    }else{
      console.log(`add to ${item.day}`);
      let prevEndsAt = displayData[item.day][displayData[item.day].length-1].endsAt;
      displayData[item.day].push({
        isEmptyCell: true,
        time: `${prevEndsAt.hour}:${prevEndsAt.mins} ~ ${item.starts_at}`,
        endsAt: startsAtDatetime,
        name:'',
        room:'',
        height: (((startsAtDatetime.hour - prevEndsAt.hour)*60)
            + (startsAtDatetime.mins - prevEndsAt.mins))
      });
    }
    displayData[item.day].push({
      isEmptyCell: false,
      time: `${item.starts_at} ~ ${item.ends_at}`,
      endsAt: endsAtDatetime,
      name: item.title,
      room: item.room,
      height: (((endsAtDatetime.hour - startsAtDatetime.hour)*60) 
          + (endsAtDatetime.mins - startsAtDatetime.mins)),
      syllabus:{
        code: item.lecture_id,
        semester: item.semester_code,
        year: item.year
      }
    });
  }
  return displayData;
}

class Timetable extends Component {
  constructor(props) {
    super(props);
  }

  render = ()=>(
    <ScrollView style={{backgroundColor: 'whitesmoke'}}>
      <View style={{flex:1, flexDirection: 'row'}}>
        {this.props.timetable.map((item, i)=>{
          return(
            <View style={{flex: 1}}>
              <View style={{height: item.height, backgroundColor: 'white', padding: 2}}>
                <Text style={{color: 'black'}}>{DateTools.dayOfWeekNumToStr(i)}</Text>
              </View>
              {item.map((subject, j)=>{
                let bgColor = subject.isEmptyCell ? 'rgba(0, 0, 0, 0)' : 'silver';
                if(subject.isEmptyCell){
                  return(
                    <View style={{height: subject.height, backgroundColor: bgColor, padding: 2}}
                      key={`subject_${i}_${j}`}>
                    </View>
                  );
                }else{
                  return(
                    <TouchableHighlight style={{}}
                      key={`subject_${i}_${j}`} onPress={()=>{
                        this.props.navigation.navigate('SyllabusDetails', {
                          subjectCode: subject.syllabus.code.split('-')[0],
                          classCode: subject.syllabus.code.split('-')[1],
                          semesterCode: subject.syllabus.semester,
                          year: subject.syllabus.year
                        });
                      }}>
                      <View style={{height: subject.height, backgroundColor: bgColor, padding: 2}}>
                        <Text style={{color: 'black', fontSize: 12}}>{subject.name}</Text>
                        <Text style={{color: 'black', fontSize: 8}}>{subject.time}</Text>
                        <Text style={{color: 'black', fontSize: 8}}>{subject.room}</Text>
                      </View>
                    </TouchableHighlight>
                  );
                }
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>)
}

export default withNavigation(Timetable);

