import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import DateTools from '../tools/datetools';
import moment from 'moment';

// professorNameCol: 가끔씩 교수이름 칸만 이름이  다른 경우가 있다.

export function extractFromData(Data, professorNameCol='GyosuNm') {

  return Data.map((item) => {
    return {
      title: item.GwamogKorNm,
      professor: item[professorNameCol],
      room: item.HosilCd,
      day: DateTools.dayOfWeekStrToNum(item.YoilNm),
      starts_at: item.FrTm,
      ends_at: item.ToTm,
      lecture_id: `${item.GwamogCd}-${item.Bunban}`,
      semester_code: item.Haggi,
      year: item.Yy
    };
  });
}

export function mergeClassesInSametime(arr){
  for(let i=1; i<arr.length; i++){
    let prev = arr[i-1];
    let current = arr[i];
    if(current.starts_at == prev.start_at && current.ends_at == prev.ends_at &&
        current.day == prev.day){
      if(Array.isArray(prev.professor) && Array.isArray(prev.room) && Array.isArray(prev.lecture_id)){
        arr[i-1].professor = [...prev.professor, current.professor];
        arr[i-1].room = [...prev.room, current.room];
        arr[i-1].lecture_id = [...prev.lecture_id, current.lecture_id];
      }else{
        arr[i-1].professor = [prev.professor, current.professor];
        arr[i-1].room = [prev.room, current.room];
        arr[i-1].lecture_id = [prev.lecture_id, current.lecture_id]; 
      }
      arr.splice(i, 1);
    }
  }
}
export function convertForTimetable(arr) {
  let displayData = [];
  let calcHeight = (start, end)=>(((end.hour - start.hour) * 60)
                                    + (end.mins - start.mins));

  for(let i=0; i<arr.length; i++){
    let item = arr[i];
    console.log(item);

    let timeTemplate = 'HH:mm:ss';
    let minTemplate;
    if (item.starts_at.length == 8 && item.ends_at.length == 8) {
      minTemplate = '08:00:00';
    }
    else {
      minTemplate = '08:00';
    }

    let startsAt = moment(item.starts_at, timeTemplate);
    let startsAtDatetime = {
      hour: startsAt.hours(),
      mins: startsAt.minutes()};

    let endsAt = moment(item.ends_at, timeTemplate);
    let endsAtDatetime = {
      hour: endsAt.hours(),
      mins: endsAt.minutes()};

    let sevenMorning = {hour: 8, mins: 0};

    if(displayData[item.day]==undefined){
      console.log(`init ${item.day}`);
      displayData[item.day] = [];
      displayData[item.day].push({
        isEmptyCell: true,
        time: `${minTemplate} ~ ${item.starts_at}`,
        endsAt: startsAtDatetime,
        name:'',
        room:'',
        height: calcHeight(sevenMorning, startsAtDatetime)
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
        height: calcHeight(prevEndsAt, startsAtDatetime)
      });
    }
    displayData[item.day].push({
      isEmptyCell: false,
      time: `${item.starts_at} ~ ${item.ends_at}`,
      endsAt: endsAtDatetime,
      name: item.title,
      room: item.room,
      height: calcHeight(startsAtDatetime, endsAtDatetime),
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

  render() {
    return (
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
      </ScrollView>);
  }
}

export default withNavigation(Timetable);

