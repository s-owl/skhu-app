import React, {Component} from 'react';
import {CardView} from '../components/components';
import {ScrollView, View, ActivityIndicator, FlatList} from 'react-native';
import BuildConfigs from '../config';
import {MaterialCommunityIcons} from '@expo/vector-icons';  //아이콘임포트
import {Appearance} from 'react-native-appearance';
import {ThemeText, ThemeBackground} from '../components/components';
import ForestApi from '../tools/apis';


export class Meal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      meals: [],
      isLoading: true
    };
  }

  static async fetchMealData() {
    console.log('fetching meals urls');
    let thisWeekUrl = '';
    let thisWeekMeals = [];
    const urls = await ForestApi.get('/life/meal/urls', false);
    if (urls.ok) {
      console.log('urls');
      const data = await urls.json();
      thisWeekUrl = await data.urls[0].url;
    }
    const meals = await ForestApi.post('/life/meal/data', JSON.stringify({'url': thisWeekUrl}), false);
    if (meals.ok) {
      console.log('meals');
      const data = await meals.json();
      thisWeekMeals = await data.data.map(item => item);
    }
    return thisWeekMeals;
  }

  async componentDidMount() {
    let mealData = await Meal.fetchMealData();
    this.setState({
      meals: mealData,
      isLoading: false
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
        <ThemeBackground viewType="safeAreaView" hasCardViews={true}>
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

//메인 오늘학식
export class MealCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      meal: null,
      isLoading: true,
      textColor: Appearance.getColorScheme()==='dark'? 'white' : 'black'
    };
  }

  async componentDidMount() {
    this.subscription = Appearance.addChangeListener(({colorScheme}) => {
      this.setState({textColor: colorScheme==='dark'? 'white' : 'black'});
    });
    let mealData = await Meal.fetchMealData();
    // TODO: 오늘 구하는 공식 들어가야함 일단은 첫번째 인덱스 배열 값 가져옴...
    let day = new Date().getDay(); //0 : 일요일,  1: 월요일...
    day = (day == 0 || day == 6) ? 4 : day - 1;
    this.setState({
      meal: mealData[day],
      isLoading: false,
    });
  }

  render() {
    let content;
    const {isLoading, meal} = this.state;
    if (isLoading || !meal) {
      content = (
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else {
      content = (
        <View>
          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons name="rice" color={this.state.textColor} size={20}/>
            <ThemeText style={{marginStart: 5}}>{meal.day} 식단</ThemeText>
          </View>
          <View style={{flexDirection: 'column', marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
              <CardView outlined={true} style={{margin: 5, flex: 1}}>
                <ThemeText style={{fontWeight: 'bold', fontSize: 16}}>학식</ThemeText>
                <ThemeText style={{marginBottom: 10, marginTop: 5}}>{meal.lunch.a.diet}</ThemeText>
              </CardView>
              <CardView outlined={true} style={{margin: 5, flex: 1}}>
                <ThemeText style={{fontWeight: 'bold', fontSize: 16}}>일품</ThemeText>
                <ThemeText style={{marginBottom: 10, marginTop: 5}}>{meal.lunch.b.diet}</ThemeText>
              </CardView>
              <CardView outlined={true} style={{margin: 5, flex: 1}}>
                <ThemeText style={{fontWeight: 'bold', fontSize: 16}}>석식</ThemeText>
                <ThemeText style={{marginBottom: 10, marginTop: 5}}>{meal.dinner.a.diet}</ThemeText>
              </CardView>
            </View>
          </View>
        </View>
      );
    }
    return (
      <CardView onPress={this.props.onPress} elevate={true}
        actionLabel="주간 식단 보기 >">
        {content}
      </CardView>

    );
  }
}