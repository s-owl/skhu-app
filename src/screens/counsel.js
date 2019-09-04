import React, {Component} from 'react';
import {SectionList, Text, ActivityIndicator, View} from 'react-native';
import {CardItem} from '../components/components';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';

export default class CounselHistory extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
        
      return {
        title: '나의 상담 이력',
      };
    };
    constructor(props){
      super(props);
      this.state = {
        professors:[],
        history:[],
        isLoading: false
      };
    }
    async componentDidMount(){
      this.setState({isLoading: true});
      const professors = await ForestApi.postToSam('/ACS/ACSAD/ACSAD01_GetList');
      let professorsList = [];
      professorsList.push({
        timestamp: '년도-학기',
        counselor: '지도교수',
        countOrType: '상담횟수'
      });
      if(professors != null){
        const data = professors;
        for(let item of data.DAT){
          professorsList.push({
            timestamp: `${item.Yy}-${item.HaggiNm}`,
            counselor: item.CounselorNm,
            countOrType: item['상담횟수']
          });
        }
      }

      const history = await ForestApi.postToSam('/ACS/ACSAD/ACSAD01_GetList_02');
      let historyList = [];
      historyList.push({
        timestamp: '년도-학기 / 상담일자',
        counselor: '상담자',
        countOrType: '상담구분'
      });
      if(history != null){
        const data = history;
        for(let item of data.DAT){
          historyList.push({
            timestamp: `${item.Yy}-${item.HaggiNm} / ${item.CounselingDt}`,
            counselor: item.CounselorNm,
            countOrType: item.CounselingGbNm
          });
        }
      }

      this.setState({
        professors: professorsList,
        history: historyList,
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
      }else{
        return(
          <SectionList style={{height:'100%', backgroundColor: 'whitesmoke'}}
            renderItem={({item, index, section}) => (
              <CardItem key={index} style={{flex: 0, flexDirection: 'row'}}>
                <Text style={{flex: 2, textAlign: 'center'}}>{item.timestamp}</Text>
                <Text style={{flex: 1, textAlign: 'center'}}>{item.counselor}</Text>
                <Text style={{flex: 1, textAlign: 'center'}}>{item.countOrType}</Text>
              </CardItem>
            )}
            renderSectionHeader={({section: {title}}) => (
              <CardItem style={{flex: 0, flexDirection: 'row'}} isHeader={true}>
                <Text style={{fontWeight: 'bold'}}>{title}</Text>
              </CardItem>
            )}
            sections={[
              {title: '지도교수 목록', data: this.state.professors},
              {title: '상담 내역', data: this.state.history}
            ]}
            keyExtractor={(item, index) => item + index}
          />
        );
      }
      
    }
} 
