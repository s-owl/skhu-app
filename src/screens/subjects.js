import React, {Component} from 'react';
import {RefreshControl, Modal, Text, View, FlatList,
  TextInput, Picker, SafeAreaView, ActivityIndicator} from 'react-native';
import {CardItem, BottomModal} from '../components/components';
import DateTools from '../tools/datetools';
import { MaterialIcons } from '@expo/vector-icons';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';

export default class Subjects extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
      
    return {
      title: '학과/학부별 개설과목 조회',
    };
  };
  constructor(props){
    super(props);
    const today = new Date();
    const semester = DateTools.getSemesterCode(today.getMonth()+1);
    this.state = {
      showSearchModal: false,
      year: today.getFullYear().toString(),
      semester: {title: semester.name, code: semester.code},
      major: {title:'', code:''},
      professor:'',
      majorOptions: [],
      semesterOptions: [],
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
            style={{flex:0, flexDirection: 'row'}} elevate={true}>
            <Text style={{flex:1}}>
              {this.state.year}-{this.state.semester.title}, {this.state.major.title}, {this.state.professor}
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
                  semesterCode: this.state.semester.code,
                  year: this.state.year
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
          <BottomModal
            title='학과/학부별 개설과목 검색'
            visible={this.state.showSearchModal}
            onRequestClose={() => this.setState({showSearchModal: false})}
            buttons={[
              {label: '취소', onPress: ()=>{this.setState({showSearchModal: false});}},
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
                selectedValue={this.state.semester.code}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    semester:{
                      title: this.state.semesterOptions[itemIndex].title,
                      code: itemValue
                    }
                  });
                }}>
                {this.state.semesterOptions.map((item, index)=>{
                  return(
                    <Picker.Item label={item.title} value={item.value} />
                  );
                })}
              </Picker>
            </CardItem>
            <CardItem>
              <Picker
                selectedValue={this.state.major.code}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    major:{
                      title: this.state.majorOptions[itemIndex].title,
                      code: itemValue
                    }
                  });
                }}>
                {this.state.majorOptions.map((item, index)=>{
                  return(
                    <Picker.Item label={item.title} value={item.value} />
                  );
                })}
              </Picker>
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
      let results;
      if(this.state.firstLoad){
        results = await ForestApi.get('/enroll/subjects', true);
      }else{
        results = await ForestApi.post('/enroll/subjects',
          JSON.stringify({
            'year': this.state.year,
            'semester': this.state.semester.code,
            'major': this.state.major.code,
            'professor': this.state.professor
          }), true);
      }
      let arr = [];
      if(results.ok){
        const data = await results.json();
        for(let item of data.list){
          arr.push({
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
          });
        }
        console.log(arr);
        if(this.state.firstLoad){
          this.setState({
            result: arr,
            semesterOptions: data.options.semester,
            majorOptions: data.options.major,
            refreshing: false,
            firstLoad: false,
            major: {
              title: data.options.major_current.title,
              code: data.options.major_current.value
            }
          });
        }else{
          this.setState({
            result: arr,
            semesterOptions: data.options.semester,
            majorOptions: data.options.major,
            refreshing: false,
            firstLoad: false
          });
        }
        
      }
    }catch(err){
      console.log(err);
    }
  }
}