import React, {Component} from 'react';
import {RefreshControl, Modal, Text, View, FlatList,
  TextInput, Picker, SafeAreaView, ActivityIndicator, Alert} from 'react-native';
import { Map } from 'immutable';
import {CardItem} from '../components/components';
import SearchBar, {createSearchCondition} from '../components/searchBar';
import DateTools, {SemesterCodes} from '../tools/datetools';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';

function errorMessage() {
  Alert.alert("조회 실패", "기간에 따른 제한 일 수 있으며 혹은 네트워크나 서버의 문제일 수 있습니다.");
}

function getTypesInSearchData(searchData) {
  majorCodes = Map({});
  searchData.options.major.forEach(
    (major)=>{
      majorCodes = majorCodes.set(major.title, major.value);});
  return {
    year: "년도(필수)",
    semester: {
      name: "학년(필수)",
      values: SemesterCodes
    },
    major: {
      name: "개설 소속(필수)",
      values: majorCodes.toJS()
    },
    professor: "교수 이름(선택)" 
  };
}

function getParamInSearchData(searchData) {
  const today = new Date();
  const year = today.getFullYear().toString();
  const semester = DateTools.getSemesterCode(today.getMonth()+1).code;
  const major = searchData.options.major_current.value;
  return {
    year: year,
    semester: semester,
    major: major
  };
}

function getResultInSearchData(searchData) {
  let arr = searchData.list.map((item)=>{
    return {
      key: `${item.code}-${item.class}`,
      subjectCode: item.code,
      classCode: item.class,
      subject: item.subject,
      professor: item.professor,
      available: item.available,
      type: item.type,
      grade: item.grade,
      score: item.score,
      grade_limit: item.grade_limit,
      major_limit: item.major_limit,
      time: item.time,
      note: item.note
    }
  });
  return arr;
}

export default class Subjects extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
      
    return {
      title: '학과/학부별 개설과목 조회',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      condition: Map({}),
      display: Map({
        result: [],
        refreshing: false,
        firstLoad: true
      })
    };
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

  async loadSearchData() {
    const condition = this.getCondition();
    const display = this.getDisplay();

    if(display.get('firstLoad')) {
      return await ForestApi.get('/enroll/subjects', true);
    }
  
    return await ForestApi.post('/enroll/subjects',
      JSON.stringify({
        'year': condition.get('year'),
        'semester': condition.get('semester'),
        'major': condition.get('major'),
        'professor': condition.get('professor')
    }), true);
  }

  async initSearch() {
    try {
      res = await this.loadSearchData();
      if (res.ok) {
        const searchData = await res.json();
        this.dataType = Map(getTypesInSearchData(searchData));
        this.initParam = Map(getParamInSearchData(searchData));
        this.setCondition(createSearchCondition(this.dataType, this.initParam));
        this.setDisplay(this.getDisplay()
          .set('firstLoad', false)
          .set('refreshing', false)
          .set('result', getResultInSearchData(searchData)));
      }
    } catch (e) {
      console.log(e);
      errorMessage();
    }
  }

  async runSearch() {
    try {
      const condition = this.getDisplay();
      this.setDisplay(
        condition
          .set('refreshing', true));
      res = await this.loadSearchData();

      if (res.ok) {
        const searchData = await res.json();
        this.setDisplay(
          condition
            .set('refreshing', false)
            .set('result', getResultInSearchData(searchData)));
      }
    } catch (e) {
      console.log(e);
      errorMessage();
    }
  }

  handleCondition(condition) {
    this.setCondition(condition);
    this.runSearch();
    this.refs.itemList.scrollToOffset({animated: true, x: 0, y: 0});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.getDisplay() == nextState.display)
      return true;
    else 
      return false;
  }

  componentDidMount(){
    this.initSearch();
  }

  render(){
    const display = this.getDisplay();
    const condition = this.getCondition();

    if(display.get('firstLoad')){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      return(
        <View style={{backgroundColor: 'whitesmoke'}}>
          <SearchBar
            dataType={this.dataType}
            initParam={this.initParam}
            onChange={this.handleCondition.bind(this)}
          />
          <FlatList style={{backgroundColor: 'whitesmoke'}}
            ref="itemList"
            data={display.get('result')}
            ListFooterComponent={()=>(
              <CardItem style={{height: 50}}/>
            )}
            refreshControl={
              <RefreshControl
                refreshing={display.get('refreshing')}
                onRefresh={this.runSearch.bind(this)}
                tintColor={BuildConfigs.primaryColor}
                colors={[BuildConfigs.primaryColor]}
              />
            }
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
                <Text>{item.type}, {item.grade} 학년, {item.score}학점 | {item.professor}</Text>
                <Text>학년제한: {item.grade_limit}, 학과제한: {item.major_limit}, 신청/정원: {item.available}</Text>
                <Text>{item.time}</Text>
                <Text>{item.note}</Text>
              </CardItem>
            }
          />
        </View>
      );
    }
  }
}
