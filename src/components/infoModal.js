import React from 'react';
import {Modal, View, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import ListItem from './listitem';
import {ThemedText} from './components';
import {useTheme} from '@react-navigation/native';

export function InfoModal(props) {
  const {colors} = useTheme();

  return(
    <Modal
      animationType="slide"
      visible={props.visible}>
      <View style={{paddingTop: 50, padding: 16, flex: 1, backgroundColor: colors.background}}>
        <View style={{padding: 8, alignItems: 'center', flex: 0}}>
          <MaterialCommunityIcons color={colors.text} name={props.icon} size={40} style={{padding: 8}}/>
          <ThemedText style={{fontWeight: 'bold', padding: 8, fontSize: 20}}>{props.title}</ThemedText>
        </View>
        <ScrollView style={{padding: 8, flex: 1}}>
          {props.children}
        </ScrollView>
        <View style={{flex: 0, flexDirection: 'row',
          height: 50, width: '100%', marginBottom: 16}}>
          {props.buttons.map((item, index)=>{
            return(
              <ListItem key={index} style={{flex: 1, alignItems: 'center'}} onPress={item.onPress}>
                <ThemedText>{item.label}</ThemedText>
              </ListItem>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

