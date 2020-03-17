import React, {Component} from 'react';
import {RefreshControl, Text, View, FlatList,
  ActivityIndicator, Alert} from 'react-native';
import {Map} from 'immutable';
import ListItem from '../components/listitem';
import SearchBar, {createSearchCondition} from '../components/searchBar';
import DateTools, {SemesterCodes} from '../tools/datetools';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ThemeText} from '../components/components';

// 에러 표시
function errorMessage() {
  Alert.alert('조회 실패', '기간에 따른 제한 일 수 있으며 혹은 네트워크나 서버의 문제일 수 있습니다.');
}

// 검색 데이터에서 조건의 형태를 생성한다.
function getTypesInSearchData(searchData) {
  let majorCodes = Map({});
  searchData.options.major.forEach(
    (major)=>{
      majorCodes = majorCodes.set(major.title, major.value);});
  return {
    year: '년도(필수)',
    semester: {
      name: '학년(필수)',
      values: SemesterCodes
    },
    major: {
      name: '개설 소속(필수)',
      values: majorCodes.toJS()
    },
    professor: '교수 이름(선택)' 
  };
}

// 검색 데이터에서 초기 검색 조건을 얻는다.
function getParamInSearchData(searchData) {
  const today = new Date();
  const year = today.getFullYear().toString();
  const semester = DateTools.getSemesterCode(today.getMonth()+1).code;
  console.log(searchData.options.major_current);
  const major = searchData.options.major_current.value;
  return {
    year: year,
    semester: semester,
    major: major
  };
}

// 검색 데이터에서 결과를 얻는다.
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
    };
  });
  return arr;
}

export default class Subjects extends Component{
  // 초기화
  constructor(props){
    super(props);
    this.state = {
      // 서버와 통신하기 전에는 조건을 알 수 없다.
      condition: Map({}),
      // 출력 상태를 초기화한다.
      display: Map({
        result: [],
        refreshing: false,
        firstLoad: true
      })
    };
  }

  // 검색 조건의 getter
  getCondition() {
    return this.state.condition;
  }

  // 출력 조건의 getter
  getDisplay() {
    return this.state.display;
  }

  // 검색 조건의 setter
  setCondition(condition) {
    let state = this.state;
    state.condition = condition;
    this.setState(state);
  }

  // 출력 조건의 setter
  setDisplay(display) {
    let state = this.state;
    state.display = display;
    this.setState(state);
  }

  // 검색 데이터를 가져온다.
  async loadSearchData() {
    const condition = this.getCondition();
    const display = this.getDisplay();

    // 초기화 후 처음이라면 GET으로 가져온다.
    if(display.get('firstLoad')) {
      return await ForestApi.get('/enroll/subjects', true);
    }
  
    // POST로 검색 조건을 전달하고 결과를 받아온다.
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
      // 검색 데이터 가져오기
      let res = await this.loadSearchData();
      if (res.ok) {
        // json 으로 파싱
        const searchData = await res.json();
        // 검색 조건 초기화 및 searchBar 초기화
        this.dataType = Map(getTypesInSearchData(searchData));
        this.initParam = Map(getParamInSearchData(searchData));
        this.setCondition(createSearchCondition(this.dataType, this.initParam));
        // 검색 결과 표시
        this.setDisplay(this.getDisplay()
          .set('firstLoad', false)
          .set('result', getResultInSearchData(searchData)));
      }
    } catch (e) {
      console.log(e);
      errorMessage();
    }
  }

  async runSearch() {
    try {
      // 화면 표시 조건 가져오기
      const condition = this.getDisplay();
      // 검색 중 표시
      this.setDisplay(
        condition
          .set('refreshing', true));
      // 검색 데이터 가져오기
      let res = await this.loadSearchData();

      if (res.ok) {
        //json 으로 파싱
        const searchData = await res.json();
        // 검색 결과표시
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

  // 검색 조건 변경 시 동작 설정
  handleCondition(condition) {
    // 스크룰을 맨 위까지 올린다.
    this.refs.itemList.scrollToOffset({animated: true, x: 0, y: 0});
    // 검색 조건 설정 후 검색 시작
    this.setCondition(condition);
    this.runSearch();
  }

  // 출력 조건 변경 시 업데이트 강제
  shouldComponentUpdate(nextProps, nextState) {
    if (this.getDisplay() == nextState.display)
      return true;
    else 
      return false;
  }

  // 초기화 후 검색 및 검색바 초기화
  componentDidMount(){
    this.initSearch();
  }

  render(){
    const display = this.getDisplay();
    const condition = this.getCondition();

    // 맨 처음에는 검색바가 초기화가 돠지 않아 검색 중 표시를 출력한다.
    if(display.get('firstLoad')){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      return(
        <View>
          <SearchBar
            dataType={this.dataType}
            initParam={this.initParam}
            onChange={this.handleCondition.bind(this)}
          />
          <FlatList
            ref="itemList"
            data={display.get('result')}
            ListFooterComponent={()=>(
              <ListItem style={{height: 50}}/>
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
              <ListItem onPress={()=>{
                this.props.navigation.navigate('SyllabusDetails', {
                  subjectCode: item.subjectCode,
                  classCode: item.classCode,
                  semesterCode: condition.get('semester'),
                  year: condition.get('year')
                });
              }}>
                <ThemeText style={{fontWeight: 'bold'}}>{item.subject}({item.subjectCode}-{item.classCode})</ThemeText>
                <ThemeText>{item.type}, {item.grade} 학년, {item.score}학점 | {item.professor}</ThemeText>
                <ThemeText>학년제한: {item.grade_limit}, 학과제한: {item.major_limit}, 신청/정원: {item.available}</ThemeText>
                <ThemeText>{item.time}</ThemeText>
                <ThemeText>{item.note}</ThemeText>
              </ListItem>
            }
          />
        </View>
      );
    }
  }
}
