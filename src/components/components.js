
import React, {useState} from 'react'; 
import {
  StyleSheet, View, Text
} from 'react-native';
import Touchable from './touchable';
import {useTheme} from '@react-navigation/native';
import ListItem from './listitem';
import {MaterialCommunityIcons} from '@expo/vector-icons'; 

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

export function Collapsible(props){
  const [visible, setVisible] = useState(false);
  const {colors} = useTheme();
  const iconName = visible? 'chevron-up': 'chevron-down';
  const content = visible? (
    <View>
      {props.children}
    </View>
  ):(<View></View>);
  return(
    <View>
      <ListItem onPress={()=>setVisible(!visible)} style={{flexDirection: 'row'}}>
        <ThemedText style={{flex: 1, padding: 4}}>
          {props.title}
        </ThemedText>
        <MaterialCommunityIcons name={iconName}
          size={20} color={colors.text} style={{flex: 0}}/>
      </ListItem>
      {content}
    </View>
  );
}