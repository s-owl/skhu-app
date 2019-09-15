import React, { Component } from 'react';
import {View, FlatList, Text, ActivityIndicator} from 'react-native';
import ListItem from '../components/listitem';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';

export default class Credits extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
      
      return {
        title: '현재 이수 학점',
      };
    };
    constructor(props){
      super(props);
      this.state = {
        data: [],
        summary: '',
        isLoading: false
      };
    }
    async componentDidMount(){
      this.setState({isLoading: true});
      const credits = await ForestApi.get('/user/credits', true);
      if(credits.ok){
        let finalArr = [];
        let data = await credits.json();
        const chunk = 3;
        for (let i=0, j=data.credits.length; i<j; i+=chunk) {
          let tempArr = data.credits.slice(i,i+chunk);
          finalArr.push(tempArr);
        }
        this.setState({
          data: finalArr,
          summary: data.summary,
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
          <View>
            <FlatList style={{height:'100%', backgroundColor: 'white'}}
              data={this.state.data}
              keyExtractor={(item, index) => index}
              ListFooterComponent={()=>(
                <ListItem>
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                    {this.state.summary}
                  </Text>
                </ListItem>
              )}
              renderItem={({item})=>
                <ListItem style={{flex:1, flexDirection: 'row'}}>
                  {item.map((subItem, index)=>{
                    return(
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold',  textAlign: 'center'}}>{subItem.type}</Text>
                        <Text style={{ textAlign: 'center'}}>{subItem.earned}</Text>
                      </View>
                    );
                  })}
                </ListItem>
              }/>
          </View>
        );
      }
      
    }
}