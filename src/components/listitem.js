import React, { Component } from 'react'; //default
import {
  StyleSheet, View
} from 'react-native';
import Touchable from './touchable';


export default class ListItem extends Component{
    render(){
      const itemStyle = this.props.isHeader ? styles.ListItemHeader : styles.ListItem;
      if(this.props.onPress != undefined){
        return(
          <Touchable onPress={this.props.onPress}
            style={[itemStyle, this.props.style, (this.props.elevate)? {elevation: 1}:{}]}>
            {this.props.children}
          </Touchable>
        );
      }else{
        return(
          <View style={[itemStyle, this.props.style, (this.props.elevate)? {elevation: 1}:{}]}>
            {this.props.children}
          </View>
        );
      }
    }
  }

  
const styles = StyleSheet.create({
    ListItem: {
      padding: 16,
      backgroundColor: 'white',
    },
    ListItemHeader: {
      padding: 16,
      paddingBottom: 8,
      paddingTop: 24,
      borderTopColor: 'lightgrey',
      borderTopWidth: 1,
      backgroundColor: 'white',
    }
  });
  