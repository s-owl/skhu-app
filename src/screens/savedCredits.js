import React, {Component} from 'react';
import ListItem from '../components/listitem';
import {View, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ThemeText} from '../components/components';


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
          <FlatList
            ListHeaderComponent={()=>(
              <View>
                <ListItem isHeader={true}>
                  <ThemeText>학점세이브 상태</ThemeText>
                </ListItem>
                <ListItem style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <ThemeText style={{fontWeight: 'bold'}}>누적학점</ThemeText>
                    <ThemeText>{this.state.status.accrued}</ThemeText>
                  </View>
                  <View style={{flex: 1}}>
                    <ThemeText style={{fontWeight: 'bold'}}>누적학점 기준(누적시기)</ThemeText>
                    <ThemeText>{this.state.status.accrued_criteria}</ThemeText>
                  </View>
                </ListItem>
                <ListItem style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <ThemeText style={{fontWeight: 'bold'}}>사용학점</ThemeText>
                    <ThemeText>{this.state.status.used}</ThemeText>
                  </View>
                  <View style={{flex: 2}}>
                    <ThemeText style={{fontWeight: 'bold'}}>사용학점 기준(사용시기)</ThemeText>
                    <ThemeText>{this.state.status.used_criteria}</ThemeText>
                  </View>
                  <View style={{flex: 1}}>
                    <ThemeText style={{fontWeight: 'bold'}}>사용 가능 학점</ThemeText>
                    <ThemeText>{this.state.status.available}</ThemeText>
                  </View>
                </ListItem>
                <ListItem isHeader={true}>
                  <ThemeText>학점 세이브 상세사항</ThemeText>
                </ListItem>
              </View>
            )}
            data={this.state.details}
            renderItem={({item})=>(
              <ListItem>
                <ThemeText style={{fontWeight: 'bold'}}>{item.year}년 {item.semester}</ThemeText>
                <ThemeText>세이브 학점: {item.saved}, 사용 학점: {item.used}</ThemeText>
              </ListItem>
            )}
          />
        );
      }
    }
}

