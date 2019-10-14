import React, {Component} from 'react';
import ListItem from '../components/listitem';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';


export default class SavedCredits extends Component{
    static navigationOptions = ({navigation, navigationOptions}) => {
      const {params} = navigation.state;
          
      return {
        title: '학점 세이브 조회',
      };
    };
    constructor(props){
      super(props);
      this.state = {
        status: {
          accrued: '',
          accrued_criteria: '',
          used: '',
          used_criteria: '',
          available: ''
        },
        details: [],
        isLoading: false
      };
    }
    async componentDidMount(){
      this.setState({isLoading: true});
      const savedCredits = await ForestApi.get('/enroll/saved_credits', true);
      if(savedCredits.ok){
        const data = await savedCredits.json();
        this.setState({
          status: data.status,
          details: data.details,
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
          <FlatList style={{backgroundColor: 'white'}}
            ListHeaderComponent={()=>(
              <View>
                <ListItem isHeader={true}>
                  <Text>학점세이브 상태</Text>
                </ListItem>
                <ListItem style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>누적학점</Text>
                    <Text>{this.state.status.accrued}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>누적학점 기준(누적시기)</Text>
                    <Text>{this.state.status.accrued_criteria}</Text>
                  </View>
                </ListItem>
                <ListItem style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>사용학점</Text>
                    <Text>{this.state.status.used}</Text>
                  </View>
                  <View style={{flex: 2}}>
                    <Text style={{fontWeight: 'bold'}}>사용학점 기준(사용시기)</Text>
                    <Text>{this.state.status.used_criteria}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>사용 가능 학점</Text>
                    <Text>{this.state.status.available}</Text>
                  </View>
                </ListItem>
                <ListItem isHeader={true}>
                  <Text>학점 세이브 상세사항</Text>
                </ListItem>
              </View>
            )}
            data={this.state.details}
            renderItem={({item})=>(
              <ListItem>
                <Text style={{fontWeight: 'bold'}}>{item.year}년 {item.semester}</Text>
                <Text>세이브 학점: {item.saved}, 사용 학점: {item.used}</Text>
              </ListItem>
            )}
          />
        );
      }
    }
}

