import React, { Component } from 'react';
import {
  StyleSheet, View, ActivityIndicator, Modal, TouchableOpacity, Text
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BuildConfigs from '../config';


class WeatherUtils{
  static fetchWeatherData(lat, lon, unit, appid){
    return new Promise(async (resolve, reject)=>{
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${appid}`;
      let response = await fetch(url);
      if(response.ok){
        let data = await response.json();
        resolve({
          conditionCode: data.weather.id,
          temp: data.main.temp
        });
      }else{
        reject(response);
      }
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
    return new Promise(async (resolve, reject)=>{
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      let response = await fetch(url);
      if(response.ok){
        let data = await response.json();
        resolve(data.address.village);
      }else{
        reject(response);
      }
    });
  
  }

  static getIconForCode(code, size=10){
    if(code>=200 && code<300){
      return(<MaterialCommunityIcons size={size} name="weather-lightning"/>);
    }else if(code>=300 && code<400){
      return(<MaterialCommunityIcons size={size} name="weather-pouring"/>);
    }else if(code>=500 && code<=504){
      return(<MaterialCommunityIcons size={size} name="weather-rainy"/>);
    }else if(code==511){
      return(<MaterialCommunityIcons size={size} name="weather-snowy-rainy"/>);
    }else if(code>511 && code<600){
      return(<MaterialCommunityIcons size={size} name="weather-pouring"/>);
    }else if(code>=600 && code<700){
      return(<MaterialCommunityIcons size={size} name="weather-snowy"/>);
    }else if(code>=700 && code<800){
      return(<MaterialCommunityIcons size={size} name="weather-fog"/>);
    }else if(code==800){
      let hour = new Date().getHours();
      if(hour>=5 && hour<18){
        return(<MaterialCommunityIcons size={size} name="weather-sunny"/>);
      }else{
        return(<MaterialCommunityIcons size={size} name="weather-night"/>);
      }
    }else if(code==801){
      return(<MaterialCommunityIcons size={size} name="weather-partlycloudy"/>);
    }else if(code>801 && code<=804){
      return(<MaterialCommunityIcons size={size} name="weather-cloudy"/>);
    }else{
      return(<MaterialCommunityIcons size={size} name="weather-sunny"/>);
    }
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
        icon: (<MaterialCommunityIcons size={50} name="weather-snowy"/>)
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
        current:{
          name: (this.props.name)? this.props.name : name,
          conditionCode: weather.conditionCode,
          temp: weather.temp,
          icon: WeatherUtils.getIconForCode(weather.conditionCode, 50)
        }
      });
    }catch(err){
      console.log(err);
    }
  }

  render(){
    return(
      <View style={{flexDirection: 'column', flex: 0, alignItems: 'center'}}>
        {this.state.current.icon}
        <Text style={{fontSize: 10}}>{this.state.current.temp}°</Text>
        <Text style={{fontSize: 10}}>{this.state.current.name}</Text>
      </View>
    );
  }

}

class TopWidget extends Component{
  constructor(props){
    super(props);
    this.state = {
      today: new Date(),
      currentPosition: {}
    };
  }

  // async componentDidMount(){
  //   navigator.geolocation.getCurrentPosition((position)=>{
  //     try{
  //       this.setState({
  //         currentPosition:{
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude
  //         }
  //       });

  //     }catch(err){
  //       console.log(err);
  //     }

  //   });
  // }

  render(){
    return(
      <View style={{flexDirection: 'row', flex: 0, padding: 8}}>
        <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 30}}>{this.state.today.getFullYear()}. {this.state.today.getMonth()+1}. {this.state.today.getDate()}.</Text>
        </View>
        <SmallWeatherWidget
          unit='metric' appid={BuildConfigs.OPENWEATHERMAP_API_KEY}/>
        <SmallWeatherWidget
          unit='metric' appid={BuildConfigs.OPENWEATHERMAP_API_KEY}
          name='성공회대' position={{latitude:'37.48750', longitude:'126.82564'}}/>
      </View>
    );
  }

}

export{
  SmallWeatherWidget, TopWidget
};
