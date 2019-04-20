import React, { Component } from 'react';
import { CardItem, CardView } from '../components/components';
import { ScrollView, SafeAreaView, View, Text, ActivityIndicator, FlatList } from 'react-native';
import FetchHelper from '../tools/fetchHelper';
import BuildConfigs from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';  //아이콘임포트


export default class Meal extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: '주간 식단',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      meals: [],
      isLoading: true
    };
    FetchHelper.fetchMealsUrl().then(url => this.setState({ url }));
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
    const { meals, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={{ justifyContent: 'center', padding: 32 }}>
          <ActivityIndicator size='large' color={BuildConfigs.primaryColor} />
        </View>
      );
    }
    else {
      return (
        <SafeAreaView>
          <ScrollView>
            <FlatList
              data={meals}
              renderItem={({ item }) => (
                      <View style={{ flexDirection: 'column', padding: 16 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                          <MaterialCommunityIcons name="rice" size={20}/>
                          <Text style={{ marginStart: 5 }}>{item.day} 식단</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <CardView style={{ backgroundColor: 'whitesmoke', margin: 5, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>학식</Text>
                            <Text style={{ marginBottom: 10, marginTop: 5 }}>{item.lunch.a.diet}</Text>
                          </CardView>
                          <CardView style={{ backgroundColor: 'whitesmoke', margin: 5, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>일품</Text>
                            <Text style={{ marginBottom: 10, marginTop: 5 }}>{item.lunch.b.diet}</Text>
                          </CardView>
                          <CardView style={{ backgroundColor: 'whitesmoke', margin: 5, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>석식</Text>
                            <Text style={{ marginBottom: 10, marginTop: 5 }}>{item.dinner.a.diet}</Text>
                          </CardView>
                        </View>
                      </View>
                  )}
            />
          </ScrollView>
          </SafeAreaView>
      );
    }
  }
}
