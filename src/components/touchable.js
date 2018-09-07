import React, {Component} from 'react';
import {TouchableNativeFeedback, TouchableOpacity, Platform, View} from 'react-native';
export default class Touchable extends Component{
    
  render(){
    if(Platform.OS === 'android' && Platform.Version >= 21){
      return(
        <TouchableNativeFeedback onPress={this.props.onPress} 
          delayPressIn={1} delayPressOut={10}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={this.props.style}>{this.props.children}</View>
        </TouchableNativeFeedback>
      );
    }else{
      return(
        <TouchableOpacity {...this.props}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}