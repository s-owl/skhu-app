import React, {Component} from 'react';
import {View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ThemeText} from './components';
import {useColorScheme} from 'react-native-appearance';

class WeatherUtils{
  static fetchWeatherData(lat, lon, unit, appid){
    return new Promise((resolve, reject)=>{
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${appid}`;
      fetch(url).then(async (res)=>{
        if(res.ok){
          let data = await res.json();
          resolve({
            conditionCode: data.weather[0].id,
            temp: data.main.temp
          });
        }else{
          reject(res);
        }
      });
    });
  }

  static whereAmI(){
    return new Promise((resolve, reject)=>{
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position)=>{
          resolve(position.coords);
        });
      } else {
        reject('GeoLocation not available');
      }
    });
  }
  static getGeoName(lat, lon){
    return new Promise((resolve, reject)=>{
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      fetch(url).then(async (response)=>{
        if(response.ok){
          let data = await response.json();
          resolve(data.address.village);
        }else{
          reject(response);
        }
      });
    });
  
  }

}


function WeatherIcon(props){
  let colorScheme = useColorScheme();
  const textColor = (colorScheme==='dark')? 'white' : 'black';
  const code = props.code;
  const size = (!props.size)? 10 : props.size;
  if(code>=200 && code<300){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-lightning"/>);
  }else if(code>=300 && code<400){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-pouring"/>);
  }else if(code>=500 && code<=504){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-rainy"/>);
  }else if(code==511){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-snowy-rainy"/>);
  }else if(code>511 && code<600){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-pouring"/>);
  }else if(code>=600 && code<700){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-snowy"/>);
  }else if(code>=700 && code<800){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-fog"/>);
  }else if(code==800){
    let hour = new Date().getHours();
    if(hour>=5 && hour<18){
      return(<MaterialCommunityIcons color={textColor} size={size} name="weather-sunny"/>);
    }else{
      return(<MaterialCommunityIcons color={textColor} size={size} name="weather-night"/>);
    }
  }else if(code==801){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-partlycloudy"/>);
  }else if(code>801 && code<=804){
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-cloudy"/>);
  }else{
    return(<MaterialCommunityIcons color={textColor} size={size} name="weather-sunny"/>);
  }
}

class SmallWeatherWidget extends Component{
  constructor(props){
    super(props);
    this.state = {
      today: new Date(),
      current: {
        name: '...',
        conditionCode: 0,
        temp: 0,
        icon: (<MaterialCommunityIcons size={25} name="weather-snowy"/>)
      }
    };
  }

  componentDidMount(){
    //position.coords.longitude
    //'37.48750', '126.82564'
    this.updateData();
  }

  componentWillReceiveProps(){
    this.updateData();
  }

  async updateData(){
    try{
      let pos = (this.props.position) ? this.props.position : await WeatherUtils.whereAmI();
      let name = await WeatherUtils.getGeoName(pos.latitude, pos.longitude);
      let weather = await WeatherUtils.fetchWeatherData(pos.latitude, pos.longitude,
        this.props.unit, this.props.appid);
      this.setState({
        current: {
          name: (this.props.name)? this.props.name : name,
          conditionCode: weather.conditionCode,
          temp: weather.temp,
          icon: (<WeatherIcon size={25} code={weather.conditionCode} />)
        }
      });
    }catch(err){
      console.log(err);
    }
  }

  render(){
    return(
      <View style={{flexDirection: 'row', flex: 0, alignItems: 'center', padding: 8}}>
        {this.state.current.icon}
        <View style={{flexDirection: 'column', flex: 0, alignItems: 'center'}}>
          <ThemeText style={{fontSize: 10, marginLeft: 4}}>{this.state.current.name}</ThemeText>
          <ThemeText style={{fontSize: 10, marginLeft: 4}}>{this.state.current.temp}°</ThemeText>
        </View>
      </View>
    );
  }

}


export{
  SmallWeatherWidget
};
