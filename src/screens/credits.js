import React, { Component } from 'react';
import {View, FlatList, Text} from 'react-native';
import {CardItem} from '../components/components';
import ForestApi from '../tools/apis';
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
        summary: ''
      };
    }
    async componentDidMount(){
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
          summary: data.summary
        });
      }
    }
    render(){
      return(
        <View>
          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index}
            ListFooterComponent={()=>(
              <CardItem>
                <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                  {this.state.summary}
                </Text>
              </CardItem>
            )}
            renderItem={({item})=>
              <CardItem style={{flex:1, flexDirection: 'row'}}>
                {item.map((subItem, index)=>{
                  return(
                    <View style={{flex: 1}}>
                      <Text style={{fontWeight: 'bold',  textAlign: 'center'}}>{subItem.type}</Text>
                      <Text style={{ textAlign: 'center'}}>{subItem.earned}</Text>
                    </View>
                  );
                })}
              </CardItem>
            }/>
        </View>
      );
    }
}