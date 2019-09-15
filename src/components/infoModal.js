import React, { Component } from 'react';
import {Modal, Text, View, ScrollView} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListItem from './listitem';


export function InfoModal(props) {
  return(
    <View>
      <Modal
        animationType="slide"
        visible={props.visible}>
        <View style={{paddingTop: 50, padding: 16, flex: 1}}>
          <View style={{padding: 8, alignItems: 'center', flex: 0}}>
            <MaterialCommunityIcons name={props.icon} size={40} style={{padding: 8}}/>
            <Text style={{fontWeight: 'bold', padding: 8, fontSize: 20}}>{props.title}</Text>
          </View>
          <ScrollView style={{padding: 8, flex: 1}}>
            {props.children}
          </ScrollView>
          <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
            height:50, width:'100%', marginBottom: 16}}>
            {props.buttons.map((item, index)=>{
              return(
                <ListItem key={index} style={{flex:1, alignItems:'center'}} onPress={item.onPress}>
                  <Text>{item.label}</Text>
                </ListItem>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>);
}

