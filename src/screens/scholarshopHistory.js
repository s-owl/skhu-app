import React, {Component} from 'react';
import {CardItem} from '../components/components';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';


export default class ScholarshipHistory extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
          
      return {
        title: '장학 내역 조회',
      };
    };
    constructor(props){
      super(props);
      this.state = {
        history: [],
        isLoading: false
      };
    }
    async componentDidMount(){
      this.setState({isLoading: true});
      const scholarship_history = await ForestApi.get('/scholarship/history', true);
      if(scholarship_history.ok){
        const data = await scholarship_history.json();
        this.setState({
          history: data.scholarship_history,
          isLoading: false
        });
      }
    }
    render(){
      if(this.state.isLoading){
        return(
          <View style={{justifyContent: 'center', padding: 32}}>
            <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
          </View>
        );
      }else{
        return(
          <FlatList style={{backgroundColor: 'whitesmoke'}}
            data={this.state.history}
            renderItem={({item})=>(
              <CardItem>
                <Text>{item.year}년 {item.semester} {item.grade}학년</Text>
                <Text style={{fontWeight: 'bold'}}>{item.scholarship_name} - {item.order}</Text>
                <Text>입학장학 {item.amount_entrance}원, 수업장학 {item.amount_class}원 {item.benefit_type}</Text>
                <Text>{item.note}</Text>
              </CardItem>
            )}
          />
        );
      }
    }
}

