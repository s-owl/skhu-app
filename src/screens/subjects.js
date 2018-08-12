import React, {Component} from 'react';
import {ScrollView, Modal, Text, View, FlatList,
  TextInput, Picker, SafeAreaView} from 'react-native';
import {CardItem} from '../components/components';
import DateTools from '../tools/datetools';
import { MaterialIcons } from '@expo/vector-icons';
import ForestApi from '../tools/apis';

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
      result: []
    };
    this.firstLoad = true;
  }
  componentDidMount(){
    this.loadSearchResults();
  }
  render(){
    
    return(
      <View>
        <CardItem onPress={()=>this.setState({showSearchModal: true})}
          style={{flex:0, flexDirection: 'row'}}>
          <Text style={{flex:1}}>
            {this.state.year}-{this.state.semester.title}, {this.state.major.title}, {this.state.professor}
          </Text>
          <MaterialIcons name="search" size={20} style={{flex: 0}}/>
        </CardItem>
        <FlatList
          data={this.state.result}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showSearchModal}
          onRequestClose={() => this.setState({showSearchModal: false})}>
          <SafeAreaView style={{flexDirection: 'column', flex:1, justifyContent:'flex-end'}} 
            forceInset={{ vertical: 'always', horizontal: 'never' }}>
            <CardItem isHeader={true}>
              <Text style={{fontWeight: 'bold'}}>학과/학부별 개설과목 검색</Text>
            </CardItem>
            <CardItem>
              <TextInput placeholder={'년도(필수)'} defaultValue={this.state.year} style={{fontSize: 16, padding: 8}}
                onChangeText={(text)=>this.setState({year: text})}/>
            </CardItem>
            <CardItem>
              <Picker
                selectedValue={this.state.semester.value}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    semester:{
                      title: this.state.semesterOptions[itemIndex].title,
                      value: itemValue
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
                selectedValue={this.state.major.value}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    major:{
                      title: this.state.majorOptions[itemIndex].title,
                      value: itemValue
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
            <View style={{flex:0, flexDirection: 'row', backgroundColor: 'white',
              height:50, width:'100%'}}>
              <CardItem style={{flex:1, alignItems:'center'}} onPress={()=>{
                this.setState({showSearchModal: false});
              }}>
                <Text>취소</Text>
              </CardItem>
              <CardItem style={{flex:1, alignItems:'center'}} onPress={()=>{
                this.setState({showSearchModal: false});
                this.loadSearchResults();
              }}>
                <Text>검색</Text>
              </CardItem>
            </View>
            <CardItem/>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }

  async loadSearchResults(){
    try{
      let results;
      if(this.firstLoad){
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
        this.setState({
          result: arr,
          semesterOptions: data.options.semester,
          majorOptions: data.options.major
        });
      }
    }catch(err){
      console.log(err);
    }
  }
}