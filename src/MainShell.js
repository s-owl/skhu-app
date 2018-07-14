import React, { Component } from 'react';
import { Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Main from './Main';
import Menu from './Menu';
import { MaterialIcons } from '@expo/vector-icons';

const MenuStack = createStackNavigator({
  Menu: Menu,
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: Main,
    Menu: MenuStack,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarButtonComponent: TouchableOpacity,
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch(routeName){
        case 'Home': iconName = 'home'; break;
        case 'Menu': iconName = 'menu'; break;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <MaterialIcons name={iconName} size={25} color={tintColor} />;
      },
      tabBarLabel: ({ focused, tintColor}) => {
        const { routeName } = navigation.state;
        let label;
        switch(routeName){
        case 'Home': label = '홈'; break; 
        case 'Menu': label = '메뉴'; break; 
        }
        return <Text style={{color: tintColor, textAlign: 'center'}}>{label}</Text>;
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);

export default class MainShell extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
    
      return {
        header: null // 헤더 비활성화
      };
    };
    render() {
      return <TabNavigator/>;
    }
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', ()=>{
        // If back button pressed, exit the app.
        // Do not move back to the login screen
        BackHandler.exitApp();
      });
    }
}