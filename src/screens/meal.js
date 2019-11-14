import React, {Component} from 'react';
import {CardView} from '../components/components';
import {ScrollView, SafeAreaView, View, Text, ActivityIndicator, FlatList} from 'react-native';
import FetchHelper from '../tools/fetchHelper';
import BuildConfigs from '../config';
import {MaterialCommunityIcons} from '@expo/vector-icons';  //아이콘임포트
import {Appearance} from 'react-native-appearance';
import {ThemeText, ThemeBackground} from '../components/components';


export default class Meal extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;

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
        <ThemeBackground type="safeAreaView" hasCardViews={true}>
          <ScrollView>
            <FlatList
              data={meals}
              renderItem={({item}) => (
                <View style={{flexDirection: 'column', padding: 16}}>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <MaterialCommunityIcons name="rice" size={20}
                      color={Appearance.getColorScheme()==='dark'?'white':'black'}/>
                    <ThemeText style={{marginStart: 5}}>{item.day} 식단</ThemeText>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <CardView style={{margin: 5, flex: 1}}>
                      <ThemeText style={{fontWeight: 'bold', fontSize: 16}}>학식</ThemeText>
                      <ThemeText style={{marginBottom: 10, marginTop: 5}}>{item.lunch.a.diet}</ThemeText>
                    </CardView>
                    <CardView style={{margin: 5, flex: 1}}>
                      <ThemeText style={{fontWeight: 'bold', fontSize: 16}}>일품</ThemeText>
                      <ThemeText style={{marginBottom: 10, marginTop: 5}}>{item.lunch.b.diet}</ThemeText>
                    </CardView>
                    <CardView style={{margin: 5, flex: 1}}>
                      <ThemeText style={{fontWeight: 'bold', fontSize: 16}}>석식</ThemeText>
                      <ThemeText style={{marginBottom: 10, marginTop: 5}}>{item.dinner.a.diet}</ThemeText>
                    </CardView>
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </ThemeBackground>
      );
    }
  }
}
