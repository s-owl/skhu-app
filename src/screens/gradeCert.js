import React, {Component} from 'react';
import {CardItem} from '../components/components';
import { View, Text, FlatList, Button } from 'react-native';
import ForestApi from '../tools/apis';
import Printer from '../tools/printer';
import { MaterialHeaderButtons} from '../components/headerButtons';



export default class GradeCert extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
          
      return {
        title: '학내 제출용 성적증명서',
        headerRight: (
          <MaterialHeaderButtons>
            <MaterialHeaderButtons.Item title="인쇄" iconName="print" onPress={navigation.getParam('print')} />
          </MaterialHeaderButtons>
        )
      };
    };
    constructor(props){
      super(props);
      this.state = {
        userinfo: [],
        details: [],
        summary: [],
        date: ''
      };
    }
    async componentDidMount(){
      this.props.navigation.setParams({ print: this.print });
      const gradeCert = await ForestApi.get('/grade/certificate', true);
      if(gradeCert.ok){
        const data = await gradeCert.json();
        this.setState({
          userinfo: data.userinfo,
          details: data.details,
          summary: data.summary,
          date: data.date
        });
      }
    }
    print = () =>{
      Printer.printGradeCert(this.state.userinfo, this.state.details,
        this.state.summary, this.state.date);
    }
    render(){
      return(
        <FlatList
          ListHeaderComponent={()=>(
            <View>
              <CardItem isHeader={true}>
                <Text style={{fontWeight: 'bold'}}>학생 정보</Text>
              </CardItem>
              <CardItem>
                {this.state.userinfo.map(((item, index)=>{
                  return(
                    <Text key={`info${index}`}>{item.name}: {item.value}</Text>
                  );
                }))}
              </CardItem>
              <CardItem isHeader={true}>
                <Text style={{fontWeight: 'bold'}}>성적 내역 상세</Text>
              </CardItem>
            </View>
          )}
        
          data={this.state.details}
          renderItem={({item}, index)=>(
            <CardItem style={{flex:0, flexDirection: 'row'}} key={`details${index}`}>
              <Text style={{flex: 2}}>{item.year}{'\n'}{item.semester}</Text>
              <View style={{flex: 4}}>
                <Text style={{fontWeight: 'bold'}}>{item.subject}</Text>
                <Text>{item.code}</Text>
              </View>
              <Text style={{flex: 1}}>{item.type}</Text>
              <Text style={{flex: 1}}>{item.credit}</Text>
              <Text style={{flex: 1}}>{item.grade}</Text>
            </CardItem>
          )}
          ListFooterComponent={()=>(
            <View>
              <CardItem isHeader={true}>
                <Text style={{fontWeight: 'bold'}}>요약</Text>
              </CardItem>
              <CardItem style={{flex:0, flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.state.summary.map(((item, index)=>{
                  return(
                    <View style={{padding: 2}} key={`summ${index}`}>
                      <Text style={{fontWeight: 'bold'}}>{item.type}</Text>
                      <Text>{item.credit}</Text>
                    </View>
                  );
                }))}
              </CardItem>
              <CardItem>
                <Text style={{fontWeight: 'bold'}}>{this.state.date}</Text>
              </CardItem>
            </View>
          )}
        />
      );
    }
}

