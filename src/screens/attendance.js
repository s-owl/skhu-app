import React, { Component } from 'react';
import {View, FlatList, Text, ActivityIndicator} from 'react-native';
import {CardItem} from '../components/components';
import DBHelper from '../tools/dbhelper';
import BuildConfigs from '../config';

export default class AttendanceScreen extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
      
      return {
        title: '나의 출결 현황',
      };
    };
    constructor(props){
      super(props);
      this.state = {
        data: [{id:0, lecture_name: '강의명', attend:'출석', late:'지각', absence:'결석', 
          approved:'공결', menstrual:'생공', early:'조퇴'}],
        isLoading: false
      };
      this.db = new DBHelper();
    }
    async componentDidMount(){
      this.setState({isLoading: true});
      await this.db.fetchAttendance();
      const data = await this.db.queryAttendance();
      data.unshift({id:0, lecture_name: '강의명', attend:'출석', late:'지각', absence:'결석', 
        approved:'공결', menstrual:'생공', early:'조퇴'});
      this.setState({
        data: data,
        isLoading: false
      });
    }
    render(){
      if(this.state.isLoading){
        return(
          <View style={{justifyContent: 'center', padding: 32}}>
            <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
          </View>
        );
      }else if(this.state.data.length <= 1){
        return(
          <View style={{justifyContent: 'center', padding: 32}}>
            <Text>출결현황을 불러오지 못했거나, 수강한 강의가 없어 표시할 출결현황 데이터가 없습니다.</Text>
          </View>
        );
      }else{
        return(
          <View>
            <FlatList style={{height:'100%', backgroundColor: 'whitesmoke'}}
              data={this.state.data}
              keyExtractor={(item, index) => index}
              renderItem={({item})=>
                <CardItem style={{flex:1, flexDirection: 'row'}}>
                  <Text style={{flex:1}}>{item.lecture_name}</Text>
                  <Text style={{width:30, textAlign: 'center'}}>{item.attend}</Text>
                  <Text style={{width:30, textAlign: 'center'}}>{item.late}</Text>
                  <Text style={{width:30, textAlign: 'center'}}>{item.absence}</Text>
                  <Text style={{width:30, textAlign: 'center'}}>{item.approved}</Text>
                  <Text style={{width:30, textAlign: 'center'}}>{item.menstrual}</Text>
                  <Text style={{width:30, textAlign: 'center'}}>{item.early}</Text>
                </CardItem>
              }/>
          </View>
        );
      }
    }
}