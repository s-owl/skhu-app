import React, {Component} from 'react';
import {ScrollView, Modal, Text, View, FlatList,
  TextInput, Picker, SafeAreaView} from 'react-native';
import {CardItem} from '../components/components';
import { MaterialIcons } from '@expo/vector-icons';
import ForestApi from '../tools/apis';

export default class SyllabusDetails extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
      
    return {
      title: '강의계획서 상세',
    };
  };
  constructor(props){
    super(props);
    this.state = {
      subjectCode: this.props.navigation.getParam('subjectCode',''),
      classCode: this.props.navigation.getParam('classCode',''),
      semesterCode: this.props.navigation.getParam('semesterCode',''),
      year: this.props.navigation.getParam('year',''),
      details: undefined
    };
  }
  componentDidMount(){

    this.loadSearchResults();
  }
  render(){
    const details = this.state.details;
    if(details != undefined){
      return(
        <View>
          <CardItem isHeader={true}>
            <Text>강의 정보</Text>
          </CardItem>
          <CardItem>
            <Text style={{padding: 2}}>{details.Yy}-{details.HaggiNm}</Text>
            <Text style={{fontWeight: 'bold'}}>
              {details.GwamogKorNm}({details.GwamogCd}-{details.Bunban})
            </Text>
            <Text style={{padding: 2}}>과목영역: {details.YeongyeogGbNm} | 이수구분: {details.IsuGbNm}</Text>
            <Text style={{padding: 2}}>
                  총학점수: {details.Hagjeom} | 이론/실습: {details.IronSisu}/{details.SilseubSisu} | 성적부여방식: {details.SeongjeogGbNm}
            </Text>
            <Text style={{padding: 2}}>수강대상: {details['수강가능학년']}</Text>
            <Text style={{padding: 2}}>강의실/수업시간:{'\n'}{details.Times}</Text>
          </CardItem>

          <CardItem isHeader={true}>
            <Text>담당교수 정보</Text>
          </CardItem>
          <CardItem>
            <Text style={{padding: 2}}>{details.Yy}-{details.HaggiNm}</Text>
            <Text style={{fontWeight: 'bold'}}>
              {details.GwamogKorNm}({details.GwamogCd}-{details.Bunban})
            </Text>
            <Text style={{padding: 2}}>과목영역: {details.YeongyeogGbNm} | 이수구분: {details.IsuGbNm}</Text>
            <Text style={{padding: 2}}>
                  총학점수: {details.Hagjeom} | 이론/실습: {details.IronSisu}/{details.SilseubSisu} | 성적부여방식: {details.SeongjeogGbNm}
            </Text>
            <Text style={{padding: 2}}>수강대상: {details['수강가능학년']}</Text>
            <Text style={{padding: 2}}>강의실/수업시간:{'\n'}{details.Times}</Text>
          </CardItem>
        </View>

        
      );
    }else{
      return(<View></View>);
    }
  }

  async loadSearchResults(){
    try{
      const details = await ForestApi.postToSam(
        '/SSE/SSEA1/SSEA102_Get%EA%B0%95%EC%9D%98%EA%B3%84%ED%9A%8D%EC%84%9C',
        JSON.stringify({
          'ActionMode': 'R',
          'Bunban':this.state.classCode,
          'GwamogCd':this.state.subjectCode,
          'Haggi':this.state.semesterCode,
          'Yy':this.state.year,
          '주별내용count': 15
        }));
      let arr = [];
      if(details.ok){
        const data = await details.json();
        this.setState({
          details: data.DAT
        });
      }
    }catch(err){
      console.log(err);
    }
  }
}