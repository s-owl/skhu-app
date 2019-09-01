import React, {Component} from 'react';
import {RefreshControl, View, Text, ActivityIndicator, Alert, FlatList} from 'react-native';
import { CardItem } from '../components/components';
import Timetable, {extractFromData, convertForTimetable} from '../components/Timetable';
import BuildConfigs from '../config';
import SearchBar, {createSearchCondition} from '../components/searchBar.js';
import DateTools, {SemesterCodes} from '../tools/datetools';
import ForestApi from '../tools/apis';
import { Map } from 'immutable';


export class ProfessorTimetable extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
        
    return {
      title: '교원별 시간표',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      semesterCode: this.props.navigation.getParam('semesterCode',''),
      year: this.props.navigation.getParam('year',''),
      professorName: this.props.navigation.getParam('professorName',''),
      professorId: this.props.navigation.getParam('professorId',''),
      timetable: [],
      isLoading: false
    };
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
          <Text>시간표를 불러오지 못했거나, 표시할 시간표 데이터가 없습니다.</Text>
        </View>
      );
    }else{
      return(
        <Timetable timetable={this.state.timetable} />
      );
    }
  }

  async loadTimetable(){
    try{
      this.setState({isLoading: true});
      const timetable = await ForestApi.postToSam(
        '/SSE/SSEAD/SSEAD05_GetList',
        JSON.stringify({
          'Haggi': this.state.semesterCode,
          'StaffName':this.state.professorName,
          'StaffNo':this.state.professorId,
          'Yy':this.state.year,
        }));
      if(timetable.ok){
        const data = await timetable.json();
        const extracted = extractFromData(data.DAT);
        this.setState({
          timetable: convertForTimetable(extracted),
          isLoading: false
        });
      }
    }catch(err){
      console.log(err);
      this.setState({
        timetable: [],
        isLoading: false
      });
    }

    
  }
}


export class SearchProfessors extends Component{
  // 상단에 이름 출력
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: '교원 검색(교원별 시간표)',
    };
  };

  constructor(props){
    super(props);
    const today = new Date();
    const semester = DateTools.getSemesterCode(today.getMonth()+1);
    
    // 검색 조건의 타입(형태)
    this.dataType = Map({
      year: '년도(필수)',
      semester: {
        name: '학기',
        values: SemesterCodes
      },
      professorId: '교번',
      professorName: '성명',
    });

    // 초기 검색 조건
    this.initParam = Map({
      year: today.getFullYear().toString(),
      semester: semester.code
    });

    // 현 컴포넌트의 상태
    this.state = {
      // 검색조건 초기화
      condition: createSearchCondition(this.dataType, this.initParam),
      // 출력에 관한 상태 초기화
      display: Map({
        result: [],
        refreshing: false,
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

  // 검색 조건 변경 시 동작 설정
  handleCondition(condition) {
    // 스크룰을 맨 위까지 올린다.
    this.refs.itemList.scrollToOffset({animated: true, x: 0, y: 0});
    // 검색 조건 설정 후 검색 시작
    this.setCondition(condition);
    this.loadSearchResults();
  }

  // 출력 조건 변경 시 업데이트 강제
  shouldComponentUpdate(nextProps, nextState) {
    if (this.getDisplay() == nextState.display)
      return true;
    else 
      return false;
  }

  
  // 비동기로 검색조건을 가져온다.
  async loadSearchResults(){
    let condition = {};
    try{
      // 검색 중이라는 것을 출력
      this.setDisplay(this.getDisplay().set('refreshing', true));
      // 검색 조건을 가져오기
      condition = this.getCondition();
      // api 규격에 맞춰
      const req = JSON.stringify({
        'Haggi': condition.get('semester'),
        'Yy': condition.get('year'),
      });
      // 전송한다.
      const results = await ForestApi.postToSam('/SSE/SSEAD/SSEAD05_GetStaff', req);

      // 결과를 넣을 배열 초기화
      let arr = [];
      if(results.ok){
        // json으로 파싱해서 배열에 원하는 형태로 변형해서 배열에 추가한다.
        const data = await results.json();
        for(let item of data.DAT){
          arr.push({
            key: `${item.StaffNo}-${item.StaffName}`,
            professorName: item.StaffName,
            professorId: item.StaffNo,
            department: item.OrgNm,
            state: item.StaffStateNm,
            position: item.JikGubCodeNm
          });
        }

        let filtered = arr.filter(item =>
          item.professorName.includes(condition.get('professor')));
        // 검색 중 표시 해제 및 결과 출력
        this.setDisplay(
          this.getDisplay()
            .set('result', filtered)
            .set('refreshing', false));
      }
    // 예외 처리
    }catch(err){
      console.log(err);
      Alert.alert('조회 실패', '기간에 따른 제한 일 수 있으며 혹은 네트워크 문제일 수도 있습니다.');
      // 검색 조건이 변하지 않았다면 결과를 지우고 대기한다.
      if (condition == this.getCondition()) {
        this.setDisplay(
          this.getDisplay()
            .set('result', [])
            .set('refreshing', false)
        );
      }
    }
  }

  render(){
    // 조건들을 가져온다.
    const display = this.getDisplay();
    const condition = this.getCondition();

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
              onRefresh={this.loadSearchResults.bind(this)}
              tintColor={BuildConfigs.primaryColor}
              colors={[BuildConfigs.primaryColor]}
            />
          }
          renderItem={({item})=>
            <CardItem onPress={()=>{
              this.props.navigation.navigate('ProfessorTimetable', {
                semesterCode: condition.get('semester'),
                year: condition.get('year'),
                professorName: `${item.professor} (${item.professorId})`,
                professorId: item.professorId
              });
            }}>
              <Text style={{fontWeight: 'bold'}}>{item.professorName}({item.position})</Text>
              <Text>{item.department} | {item.state} | {item.professorId}</Text>
            </CardItem>
          }
        />
      </View>
    );
  }
}