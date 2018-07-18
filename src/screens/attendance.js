import React, { Component } from 'react';
import {View, FlatList, Text} from 'react-native';
import {CardItem} from '../components/components';
import DBHelper from '../tools/dbhelper';
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
          approved:'공결', menstrual:'생공', early:'조퇴'}]
      };
      this.db = new DBHelper();
    }
    async componentDidMount(){
      const data = await this.db.queryAttendance();
      data.unshift({id:0, lecture_name: '강의명', attend:'출석', late:'지각', absence:'결석', 
        approved:'공결', menstrual:'생공', early:'조퇴'});
      this.setState({
        data: data
      });
    }
    render(){
      return(
        <View>
          <FlatList
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