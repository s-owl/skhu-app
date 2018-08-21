import React, {Component} from 'react';
import {RefreshControl, Text, View, FlatList,
  TextInput, Picker, ActivityIndicator} from 'react-native';
import {CardItem, BottomModal} from '../components/components';
import DateTools from '../tools/datetools';
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
    this.state = {
      showSearchModal: false,
      year: today.getFullYear().toString(),
      semester: semester.name,
      semesterCode: semester.code,
      subject: '',
      major: '',
      professor:'',
      result: [],
      refreshing: false,
      firstLoad: true
    };
  }
  componentDidMount(){
    this.loadSearchResults();
  }
  render(){
    if(this.state.firstLoad){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      return(
        <View>
          <CardItem onPress={()=>this.setState({showSearchModal: true})}
            style={{flex:0, flexDirection: 'row'}}>
            <Text style={{flex:1}}>
              {this.state.year}-{this.state.semester}, {this.state.subject}, {this.state.major}, {this.state.professor}
            </Text>
            <MaterialIcons name="search" size={20} style={{flex: 0}}/>
          </CardItem>
          <FlatList
            data={this.state.result}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.loadSearchResults}
                tintColor={BuildConfigs.primaryColor}
                colors={[BuildConfigs.primaryColor]}
              />
            }
            renderItem={({item})=>
              <CardItem onPress={()=>{
                this.props.navigation.navigate('SyllabusDetails', {
                  subjectCode: item.subjectCode,
                  classCode: item.classCode,
                  semesterCode: this.state.semesterCode,
                  year: this.state.year
                });
              }}>
                <Text style={{fontWeight: 'bold'}}>{item.subject}({item.subjectCode}-{item.classCode})</Text>
                <Text>{item.college} {item.major} | {item.professor}({item.professorNo})</Text>
                <Text>작성여부: {item.availablity}</Text>
              </CardItem>
            }
          />
          <BottomModal
            title='강의계획서 검색'
            visible={this.state.showSearchModal}
            onRequestClose={() => this.setState({showSearchModal: false})}
            buttons={[
              {label: '취소', onPress: ()=>{
                this.setState({showSearchModal: false});
              }},
              {label: '검색', onPress: ()=>{
                this.setState({showSearchModal: false});
                this.loadSearchResults();              
              }}
            ]}>
            <CardItem>
              <TextInput placeholder={'년도(필수)'} defaultValue={this.state.year} style={{fontSize: 16, padding: 8}}
                onChangeText={(text)=>this.setState({year: text})}/>
            </CardItem>
            <CardItem>
              <Picker
                selectedValue={this.state.semesterCode}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    semesterCode: itemValue,
                    semester: ['1학기', '2학기', '여름학기', '겨울학기'][itemIndex]
                  });
                }}>
                <Picker.Item label="1학기" value="Z0101" />
                <Picker.Item label="2학기" value="Z0102" />
                <Picker.Item label="여름학기" value="Z0103" />
                <Picker.Item label="겨울학기" value="Z0104" />
              </Picker>
            </CardItem>
            <CardItem>
              <TextInput placeholder={'강의 이름(선택)'} style={{fontSize: 16, padding: 8}}
                defaultValue={this.state.subject}
                onChangeText={(text)=>this.setState({subject: text})}/>
            </CardItem>
            <CardItem>
              <TextInput placeholder={'개설 소속(선택)'} style={{fontSize: 16, padding: 8}}
                defaultValue={this.state.major}
                onChangeText={(text)=>this.setState({major: text})}/>
            </CardItem>
            <CardItem>
              <TextInput placeholder={'교수 이름(선택)'} style={{fontSize: 16, padding: 8}}
                defaultValue={this.state.professor}
                onChangeText={(text)=>this.setState({professor: text})}/>
            </CardItem>
          </BottomModal>
        </View>
      );
    }
  }

  async loadSearchResults(){
    try{
      this.setState({refreshing: true});
      const results = await ForestApi.postToSam('/SSE/SSEA1/SSEA104_GetList',
        JSON.stringify({
          'Haggi': this.state.semesterCode,
          'HaggiNm': this.state.semester,
          'Yy': this.state.year,
          'GwamogParam': this.state.subject,
          'ProfParam': this.state.professor,
          'SosogParam': this.state.major
        }));
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
        console.log(arr);
        this.setState({
          result: arr,
          refreshing: false,
          firstLoad: false
        });
      }
    }catch(err){
      console.log(err);
    }
  }
}