import React, {Component} from 'react';
import ListItem from '../components/listitem';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import Printer from '../tools/printer';
import {MaterialHeaderButtons} from '../components/headerButtons';
import BuildConfigs from '../config';

export default class GradeCert extends Component{
    static navigationOptions = ({navigation, navigationOptions}) => {
      const {params} = navigation.state;
          
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
        date: '',
        isLoading: false
      };
    }
    async componentDidMount(){
      this.setState({isLoading: true});
      this.props.navigation.setParams({print: this.print});
      const gradeCert = await ForestApi.get('/grade/certificate', true);
      if(gradeCert.ok){
        const data = await gradeCert.json();
        this.setState({
          userinfo: data.userinfo,
          details: data.details,
          summary: data.summary,
          date: data.date,
          isLoading: false
        });
      }
    }
    print = () =>{
      Printer.printGradeCert(this.state.userinfo, this.state.details,
        this.state.summary, this.state.date);
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
          <FlatList style={{height: '100%', backgroundColor: 'white'}}
            ListHeaderComponent={()=>(
              <View>
                <ListItem isHeader={true}>
                  <Text style={{fontWeight: 'bold'}}>학생 정보</Text>
                </ListItem>
                <ListItem>
                  {this.state.userinfo.map(((item, index)=>{
                    return(
                      <Text key={`info${index}`}>{item.name}: {item.value}</Text>
                    );
                  }))}
                </ListItem>
                <ListItem isHeader={true}>
                  <Text style={{fontWeight: 'bold'}}>성적 내역 상세</Text>
                </ListItem>
              </View>
            )}
        
            data={this.state.details}
            renderItem={({item}, index)=>(
              <ListItem style={{flex: 0, flexDirection: 'row'}} key={`details${index}`}>
                <Text style={{flex: 2}}>{item.year}{'\n'}{item.semester}</Text>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: 'bold'}}>{item.subject}</Text>
                  <Text>{item.code}</Text>
                </View>
                <Text style={{flex: 1}}>{item.type}</Text>
                <Text style={{flex: 1}}>{item.credit}</Text>
                <Text style={{flex: 1}}>{item.grade}</Text>
              </ListItem>
            )}
            ListFooterComponent={()=>(
              <View>
                <ListItem isHeader={true}>
                  <Text style={{fontWeight: 'bold'}}>요약</Text>
                </ListItem>
                <ListItem style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap'}}>
                  {this.state.summary.map(((item, index)=>{
                    return(
                      <View style={{padding: 2}} key={`summ${index}`}>
                        <Text style={{fontWeight: 'bold'}}>{item.type}</Text>
                        <Text>{item.credit}</Text>
                      </View>
                    );
                  }))}
                </ListItem>
                <ListItem>
                  <Text style={{fontWeight: 'bold'}}>{this.state.date}</Text>
                </ListItem>
              </View>
            )}
          />
        );
      }
    }
}

