import React, {Component} from 'react';
import {CardItem, CardView} from '../components/components';
import {ScrollView, View, Text, ActivityIndicator, FlatList} from 'react-native';
import FetchHelper from '../tools/fetchHelper';
import BuildConfigs from '../config';

export default class Meal extends Component{
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: '학생 식단',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      meals: [],
      isLoading: true
    };
    FetchHelper.fetchMealsUrl().then(url => this.setState({url}));
  }

  componentDidMount() {
    FetchHelper.fetchMealsData(this.state.url).then(meals => {
      this.setState({
        meals,
        isLoading: false
      });
    });
  }

  render() {
    const {meals, isLoading} = this.state;

    if (isLoading) {
      return (
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size='large' color={BuildConfigs.primaryColor} />
        </View>
      );
    }
    else {
      return (
        <FlatList
          data={meals}
          renderItem={({item})=>(
            <CardView>
              <Text style={{marginBottom:10, fontWeight: 'bold', fontSize: 20}}>[{item.day} 식단입니다]</Text>
              <Text style={{fontWeight: 'bold'}}>점심A</Text>
              <Text style={{marginBottom: 10}}>{item.lunch.a.diet}</Text>
              <Text style={{fontWeight: 'bold'}}>점심B</Text>
              <Text style={{marginBottom: 10}}>{item.lunch.b.diet}</Text>
              <Text style={{fontWeight: 'bold'}}>저녁</Text>
              <Text style={{marginBottom: 10}}>{item.dinner.a.diet}</Text>
            </CardView>
          )}
        />
      );
    }
  }
}
