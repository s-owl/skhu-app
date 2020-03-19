
import React, {Component} from 'react'; 
import {
  StyleSheet, View, TextInput, Picker, Text
} from 'react-native';
import Touchable from './touchable';
import BuildConfigs from '../config';
import {useTheme} from '@react-navigation/native';
import {withThemeAndRef} from './themes';

export function ThemedPicker(props){
  const {colors} = useTheme();
  return(
    <Picker itemStyle={{color: colors.text}} {...props}>
      {props.children}
    </Picker>);
}

class ThemeTxtInput extends Component{
  constructor(props){
    super(props);
    this.component = React.createRef();
  }
  focus(){
    this.component.current.focus();
  }
  render(){
    return(
      <TextInput style={[{color: this.props.color.text}, this.props.style]}
        ref={this.component} {...this.props}/>
    );
  }
}

export const ThemedTextInput = withThemeAndRef(ThemeTxtInput);

export function ThemedText(props){
  const {colors} = useTheme();
  return(<Text style={[{color: colors.text}, props.style]}>{props.children}</Text>);
}

export function CardView(props){
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    cardView: {
      borderRadius: 16,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 2,
      padding: 16,
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: colors.card,
    },
    outlinedCardView: {
      borderRadius: 16,
      borderColor: 'lightgrey',
      borderWidth: 1,
      padding: 16,
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: colors.card,
    },
    actionsLabel: {
      color: colors.primary
    }
  });
  

  let cardViewStyle;
  if(props.outlined){
    cardViewStyle = styles.outlinedCardView;
  }else{
    cardViewStyle = styles.cardView;
  }
  if(props.onPress != undefined){
    return(
      <Touchable onPress={props.onPress}
        style={[cardViewStyle, props.style]}>
        {props.children}
        <Text style={styles.actionsLabel}>{props.actionLabel}</Text>
      </Touchable>
    );
  }else{
    return(
      <View style={[cardViewStyle, props.style]}>
        {props.children}
        <Text style={styles.actionsLabel}>{props.actionLabel}</Text>
      </View>
    );
  }
}