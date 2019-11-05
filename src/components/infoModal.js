import React from 'react';
import {Modal, Text, View, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import ListItem from './listitem';
import {ThemeText} from './components';
import {useColorScheme} from 'react-native-appearance';

export function InfoModal(props) {
  let textColor = useColorScheme() === 'dark' ? 'white' : 'black';
  let bgColor = useColorScheme() === 'dark' ? 'black' : 'white';

  return(
    <View>
      <Modal
        animationType="slide"
        visible={props.visible}>
        <View style={{paddingTop: 50, padding: 16, flex: 1, backgroundColor: bgColor}}>
          <View style={{padding: 8, alignItems: 'center', flex: 0}}>
            <MaterialCommunityIcons color={textColor} name={props.icon} size={40} style={{padding: 8}}/>
            <ThemeText style={{fontWeight: 'bold', padding: 8, fontSize: 20}}>{props.title}</ThemeText>
          </View>
          <ScrollView style={{padding: 8, flex: 1}}>
            {props.children}
          </ScrollView>
          <View style={{flex: 0, flexDirection: 'row',
            height: 50, width: '100%', marginBottom: 16}}>
            {props.buttons.map((item, index)=>{
              return(
                <ListItem key={index} style={{flex: 1, alignItems: 'center'}} onPress={item.onPress}>
                  <ThemeText>{item.label}</ThemeText>
                </ListItem>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>);
}

