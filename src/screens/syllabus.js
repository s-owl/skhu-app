import React, {Component} from 'react';
import {RefreshControl, Text, View, FlatList, Alert} from 'react-native';
import {Map} from 'immutable';
import ListItem from '../components/listitem';
import SearchBar, {createSearchCondition} from '../components/searchBar.js';
import DateTools, {SemesterCodes} from '../tools/datetools';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ThemeText} from '../components/components';

// 강의계획서 목록 조회
export default class Syllabus extends Component{
  // 초기화
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
      subject: '강의 이름(선택)',
      major: '개설 소속(선택)',
      professor: '교수 이름(선택)'
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
        refreshing: true,
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

  // 검색 조건 변경 시 작동 지정
  handleCondition(condition) {
    // 검색시 스크룰을 맨 위로 올린다.
    this.refs.itemList.scrollToOffset({animated: true, offset: 0});

    // 조건을 변경하고 바로 검색한다.
    this.setCondition(condition);
    this.loadSearchResults();
  }

  // 컴포넌트 초기화 후 바로 검색을 한다.
  componentDidMount(){
    this.loadSearchResults();
  }

  // 출력 조건의 변경에만 업데이트하게 강제한다.
  shouldComponentUpdate(nextProps, nextState) {
    if (this.getDisplay() == nextState.display)
      return true;
    else 
      return false;
  }

  // 렌더링
  render(){
    // 조건들을 가져온다.
    const display = this.getDisplay();
    const condition = this.getCondition();

    return(
      <View>
        <SearchBar dataType={this.dataType}
          initParam={this.initParam}
          onChange={this.handleCondition.bind(this)} />
        <FlatList
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
            <ListItem style={{height: 50}}/>
          )}
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
              <ThemeText>{item.college} {item.major} | {item.professor}({item.professorNo})</ThemeText>
              <ThemeText>작성여부: {item.availablity}</ThemeText>
            </ListItem>
          }
        />
      </View>
    );
  }

  // 비동기로 검색조건을 가져온다.
  async loadSearchResults(){
    // 검색 조건을 가져오기
    const condition = this.getCondition();
    try{
      // 검색 중이라는 것을 출력
      this.setDisplay(this.getDisplay().set('refreshing', true));
      // api 규격에 맞춰
      const req = JSON.stringify({
        'Haggi': condition.get('semester'),
        'Yy': condition.get('year'),
        'GwamogParam': condition.get('subject'),
        'ProfParam': condition.get('professor'),
        'SosogParam': condition.get('major')
      });
      // 전송한다.
      const results = await ForestApi.postToSam('/SSE/SSEA1/SSEA104_GetList', req);

      // 결과를 넣을 배열 초기화
      let arr = [];
      if(results != null){
        // json으로 파싱해서 배열에 원하는 형태로 변형해서 배열에 추가한다.
        // postToSam 형식 변경에 대한 임시방편
        const data = results;
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
        // 검색 중 표시 해제 및 결과 출력
        this.setDisplay(
          this.getDisplay()
            .set('result', arr)
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
}
