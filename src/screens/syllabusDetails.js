import React, {Component} from 'react';
import {ScrollView, Text, View, ActivityIndicator} from 'react-native';
import ListItem from '../components/listitem';
import {MaterialIcons} from '@expo/vector-icons';
import {Linking} from 'expo';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ThemeText} from '../components/components';
import {Appearance} from 'react-native-appearance';

export default class SyllabusDetails extends Component{
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;
      
    return {
      title: '강의계획서 상세',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      subjectCode: this.props.navigation.getParam('subjectCode', ''),
      classCode: this.props.navigation.getParam('classCode', ''),
      semesterCode: this.props.navigation.getParam('semesterCode', ''),
      year: this.props.navigation.getParam('year', ''),
      details: undefined,
      isLoading: false
    };
  }
  componentDidMount(){
    this.loadSearchResults();
  }
  render(){
    const textColor = Appearance.getColorScheme() === 'dark'? 'white':'black';
    if(this.state.isLoading){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      const details = this.state.details;
      if(details != undefined){
        let abilityList = JSON.parse(details['개발가능역량'])!=null && JSON.parse(details['개발가능역량'])!=undefined? 
          JSON.parse(details['개발가능역량']) : [];
        let references = JSON.parse(details['교재와참고문헌2'])!=null && JSON.parse(details['교재와참고문헌2'])!=undefined? 
          JSON.parse(details['교재와참고문헌2']) : [];
        let weeklyPlan = JSON.parse(details['주별내용'])!=null && JSON.parse(details['주별내용'])!=undefined? 
          JSON.parse(details['주별내용']) : [];
        let evalMethod = JSON.parse(details['평가방법'])!=null && JSON.parse(details['평가방법'])!=undefined? 
          JSON.parse(details['평가방법']) : [];
        return(
          <ScrollView>
            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>강의 정보</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText style={{padding: 2}}>{details.Yy}-{details.HaggiNm}</ThemeText>
              <ThemeText style={{fontWeight: 'bold'}}>
                {details.GwamogKorNm}({details.GwamogCd}-{details.Bunban})
              </ThemeText>
              <ThemeText style={{padding: 2}}>과목영역: {details.YeongyeogGbNm} | 이수구분: {details.IsuGbNm}</ThemeText>
              <ThemeText style={{padding: 2}}>
                  총학점수: {details.Hagjeom} | 이론/실습: {details.IronSisu}/{details.SilseubSisu} | 성적부여방식: {details.SeongjeogGbNm}
              </ThemeText>
              <ThemeText style={{padding: 2}}>수강대상: {details['수강가능학년']}</ThemeText>
              <ThemeText style={{padding: 2}}>강의실/수업시간:{'\n'}{details.Times}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>담당교수 정보</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText style={{fontWeight: 'bold'}}>
                {details.ProfKorNm}
              </ThemeText>
            </ListItem>
            <View style={{flex: 0, flexDirection: 'row', height: 50, width: '100%'}}>
              <ListItem style={{flex: 1, flexDirection: 'row'}} onPress={()=>{
                if(details['전화번호']!=undefined && details['전화번호']!=''){
                  Linking.openURL(`tel:${details['전화번호']}`);
                }
              }}>
                <MaterialIcons color={textColor} name="call" size={20} style={{flex: 0}}/>
                <ThemeText>{details['전화번호']}</ThemeText>
              </ListItem>
              <ListItem style={{flex: 1, flexDirection: 'row'}} onPress={()=>{
                if(details['휴대전화번호']!=undefined && details['휴대전화번호']!=''){
                  Linking.openURL(`tel:${details['휴대전화번호']}`);
                }
              }}>
                <MaterialIcons color={textColor} name="smartphone" size={20} style={{flex: 0}}/>
                <ThemeText>{details['휴대전화번호']}</ThemeText>
              </ListItem>
            </View>
            <View style={{flex: 0, flexDirection: 'row', height: 50, width: '100%'}}>
              <ListItem style={{flex: 1, flexDirection: 'row'}} onPress={()=>{
                if(details['이메일']!=undefined && details['이메일']!=''){
                  Linking.openURL(`mailto:${details['이메일']}`);
                }
              }}>
                <MaterialIcons color={textColor} name="email" size={20} style={{flex: 0}}/>
                <ThemeText>{details['이메일']}</ThemeText>
              </ListItem>
              <ListItem style={{flex: 1, flexDirection: 'row'}} onPress={()=>{
                if(details['홈페이지']!=undefined && details['홈페이지']!=''){
                  Linking.openURL(`${details['홈페이지']}`);
                }
              }}>
                <MaterialIcons name="link" size={20} style={{flex: 0}}/>
                <ThemeText>{details['홈페이지']}</ThemeText>
              </ListItem>
            </View>
            <ListItem>
              <ThemeText style={{fontWeight: 'bold'}}>상담 가능시간</ThemeText>
              <ThemeText>{details['상담가능시간']}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>교과목 개요</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText>
                {details['교과목개요']}
              </ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>선수 과목과 수강 요건</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText>{details['선수과목']}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>개발가능 역량</ThemeText>
            </ListItem>
            <ListItem>
              {abilityList.map((item, index)=>{
                return item.C > 0? 
                  (<ThemeText key={index}>{item.H1} -> {item.H2} -> {item.T}</ThemeText>):(<View key={index}></View>);
              })}
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>학습내용</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText>{details['수업내용']}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>학습목표</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText>{details['학습목표']}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>수업 진행 방법</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText>{details['수업진행방법']}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>교재와 참고문헌</ThemeText>
            </ListItem>
            <ListItem>
              {references.map((item, index)=>{
                return (
                  <ThemeText key={index} style={{paddingBottom: 2}}>
                    {item['제목']}({item['저자']} 저자, {item['출판연도']}년 {item['출판사']} 출판)
                    {'\n'}{item['비고']}
                  </ThemeText>
                );
              })}
              <ThemeText style={{paddingTop: 2, paddingBottom: 2}}>{details['교재와참고문헌']}</ThemeText>
            </ListItem>

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>주별 학습목표와 학습내용</ThemeText>
            </ListItem>
            {weeklyPlan.map((item, index)=>{
              return (
                <ListItem key={index}>
                  <View style={{flex: 0, flexDirection: 'row'}}>
                    <ThemeText style={{flex: 1, fontWeight: 'bold', padding: 2}}>{item.K}회차</ThemeText>
                    <ThemeText style={{flex: 4, padding: 2}}>{item.C1}</ThemeText>
                    <ThemeText style={{flex: 2, padding: 2}}>{item.C2}</ThemeText>
                  </View>
                  <ThemeText style={{padding: 2}}>준비사항: {item.C3}</ThemeText>
                </ListItem>
              );
            })}

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>평가방법</ThemeText>
            </ListItem>
            {evalMethod.map((item, index)=>{
              return (
                <ListItem key={index}>
                  <ThemeText style={{fontWeight: 'bold', padding: 2}}>{item['평가항목']}({item['비율']}%)</ThemeText>
                  <ThemeText style={{padding: 2}}>평가방식: {item['평가방식']}</ThemeText>
                  <ThemeText style={{padding: 2}}>학습방법: {item['학습방법']}</ThemeText>
                </ListItem>
              );
            })}

            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>참고사항</ThemeText>
            </ListItem>
            <ListItem>
              <ThemeText>{details['참고사항']}</ThemeText>
            </ListItem>
          </ScrollView>
        );
      }else{
        return(<View></View>);
      }
    }
  }

  async loadSearchResults(){
    try{
      this.setState({isLoading: true});
      const details = await ForestApi.postToSam(
        '/SSE/SSEA1/SSEA102_Get%EA%B0%95%EC%9D%98%EA%B3%84%ED%9A%8D%EC%84%9C',
        JSON.stringify({
          'ActionMode': 'R',
          'Bunban': this.state.classCode,
          'GwamogCd': this.state.subjectCode,
          'Haggi': this.state.semesterCode,
          'Yy': this.state.year,
          '주별내용count': 15
        }));
      if(details != null){
        // postToSam 형식 변경에 대한 임시방편
        const data = details;
        this.setState({
          details: data.DAT,
          isLoading: false
        });
      }
    }catch(err){
      console.log(err);
    }
  }
}
