import React, { Component } from 'react';
import {Modal, Text, View, ScrollView} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {CardItem} from './components';


export function InfoModal(props) {
  return(
    <View>
      <Modal
        animationType="slide"
        visible={props.visible}>
        <View style={{paddingTop: 40, padding: 16}}>
          <View style={{padding: 32, alignItems: 'center'}}>
            <MaterialCommunityIcons name={props.icon} size={40} style={{padding: 8}}/>
            <Text style={{fontWeight: 'bold', padding: 8, fontSize: 20}}>{props.title}</Text>
          </View>
          <ScrollView style={{padding: 8, height: '70%'}}>
            {props.children}
          </ScrollView>
          <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
            height:50, width:'100%'}}>
            {props.buttons.map((item, index)=>{
              return(
                <CardItem key={index} style={{flex:1, alignItems:'center'}} onPress={item.onPress}>
                  <Text>{item.label}</Text>
                </CardItem>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>);
}

