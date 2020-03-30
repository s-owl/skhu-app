import React from 'react'; //default
import {
  StyleSheet, View
} from 'react-native';
import Touchable from './touchable';
import {useTheme} from '@react-navigation/native';

export default function ListItem(props){
  
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    ListItem: {
      padding: 16,
      backgroundColor: colors.background,
    },
    ListItemHeader: {
      padding: 16,
      paddingBottom: 8,
      paddingTop: 24,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      backgroundColor: colors.background,
    },
  });
  let itemStyle = props.isHeader? styles.ListItemHeader : styles.ListItem;
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

  
