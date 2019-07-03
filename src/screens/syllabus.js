import React, {Component} from 'react';
import {RefreshControl, Text, View, FlatList,
  TextInput, Picker, Alert} from 'react-native';
import { Map } from 'immutable';
import {CardItem} from '../components/components';
import SearchBar, {createSearchCondition} from '../components/searchBar.js';
import DateTools, {SemesterCodes} from '../tools/datetools';
import { MaterialIcons } from '@expo/vector-icons';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';

export default class Syllabus extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: '강의계획서 조회',
    };
  };

  constructor(props){
    super(props);
    const today = new Date();
    const semester = DateTools.getSemesterCode(today.getMonth()+1);
    
    this.dataType = Map({
      year: "년도(필수)",
      semester: {
        name: "학기",
        values: SemesterCodes
      },
      subject: "강의 이름(선택)",
      major: "개설 소속(선택)",
      professor: "교수 이름(선택)"
    });

    this.initParam = Map({
      year: today.getFullYear().toString(),
      semester: semester.code
    });

    this.state = {
      condition: createSearchCondition(this.dataType, this.initParam),
      display: Map({
        result: [],
        refreshing: true,
      })
    };

    this.itemList = undefined;
  }

  getCondition() {
    return this.state.condition;
  }

  getDisplay() {
    return this.state.display;
  }

  setCondition(condition) {
    state = this.state;
    state.condition = condition;
    this.setState(state);
  }

  setDisplay(display) {
    state = this.state;
    state.display = display;
    this.setState(state);
  }

  handleCondition(condition) {
    this.setCondition(condition);
    this.loadSearchResults();
    this.refs.itemList.scrollToOffset({animated: true, x: 0, y: 0});
  }

  shouldUpdateComponent(nextProps, nextState) {
    if (this.getDisplay().get("refreshing") != nextState.display("refreshing"))
      return true;
    return false;
  }

  componentDidMount(){
    this.loadSearchResults();
  }

  render(){
    const display = this.getDisplay();
    const condition = this.getCondition();
    return(
      <View style={{backgroundColor: 'whitesmoke'}}>
        <SearchBar dataType={this.dataType}
                   initParam={this.initParam}
                   onChange={this.handleCondition.bind(this)} />
        <FlatList style={{backgroundColor: 'whitesmoke'}}
          ref='itemList'
          data={display.get('result')}
          refreshControl={
            <RefreshControl
              refreshing={display.get('refreshing')}
              onRefresh={this.loadSearchResults.bind(this)}
              tintColor={BuildConfigs.primaryColor}
              colors={[BuildConfigs.primaryColor]}
            />
          }
          ListFooterComponent={()=>(
            <CardItem style={{height: 50}}/>
          )}
          renderItem={({item})=>
            <CardItem onPress={()=>{
              this.props.navigation.navigate('SyllabusDetails', {
                subjectCode: item.subjectCode,
                classCode: item.classCode,
                semesterCode: condition.get('semester'),
                year: condition.get('year')
              });
            }}>
              <Text style={{fontWeight: 'bold'}}>{item.subject}({item.subjectCode}-{item.classCode})</Text>
              <Text>{item.college} {item.major} | {item.professor}({item.professorNo})</Text>
              <Text>작성여부: {item.availablity}</Text>
            </CardItem>
          }
        />
      </View>
    );
  }

  async loadSearchResults(){
    try{
      this.setDisplay(this.getDisplay().set("refreshing", true));
      const condition = this.getCondition();
      const req = JSON.stringify({
        'Haggi': condition.get("semester"),
        'Yy': condition.get("year"),
        'GwamogParam': condition.get("subject"),
        'ProfParam': condition.get("professor"),
        'SosogParam': condition.get("major")
      });
      const results = await ForestApi.postToSam('/SSE/SSEA1/SSEA104_GetList', req);
      let arr = [];
      if(results.ok){
        const data = await results.json();
        for(let item of data.DAT){
          arr.push({
            key: `${item.GwamogCd}-${item.Bunban}`,
            subjectCode: item.GwamogCd,
            classCode: item.Bunban,
            subject: item.GwamogKorNm,
            college: item.GaeseolDaehagNm,
            depart: item.GaeseolHagbuNm,
            major: item.GaeseolSosogNm,
            professor: item.ProfKorNm,
            professorNo: item.ProfNo,
            availablity: item.SueobGyehoegYn
          });
        }
        this.setDisplay(
          this.getDisplay()
            .set('result',arr)
            .set('refreshing',false));
      }
    }catch(err){
      console.log(err);
      Alert.alert('조회 실패', '기간에 따른 제한 일 수 있으며 혹은 네트워크 문제일 수도 있습니다.');
    }
  }
}
