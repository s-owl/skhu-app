import React, {Component} from 'react'; //default
import {
  StyleSheet, View
} from 'react-native';
import Touchable from './touchable';
import {useColorScheme} from 'react-native-appearance';


export default function ListItem(props){
  let itemStyle;
  let scheme = useColorScheme();
  if(props.isHeader){
    itemStyle = (scheme==='dark')? styles.DarkListItemHeader : styles.ListItemHeader;
  }else{
    itemStyle = (scheme==='dark')? styles.DarkListItem : styles.ListItem;
  }
  if(props.onPress != undefined){
    return(
      <Touchable onPress={props.onPress}
        style={[itemStyle, props.style, (props.elevate)? {elevation: 1}:{}]}>
        {props.children}
      </Touchable>
    );
  }else{
    return(
      <View style={[itemStyle, props.style, (props.elevate)? {elevation: 1}:{}]}>
        {props.children}
      </View>
    );
  }
}

  
const styles = StyleSheet.create({
  ListItem: {
    padding: 16,
    backgroundColor: 'white',
  },
  DarkListItem: {
    padding: 16,
    backgroundColor: 'black',
  },
  ListItemHeader: {
    padding: 16,
    paddingBottom: 8,
    paddingTop: 24,
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  DarkListItemHeader: {
    padding: 16,
    paddingBottom: 8,
    paddingTop: 24,
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    backgroundColor: 'black',
  }
});
  