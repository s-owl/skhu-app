import React, { Component } from 'react';
import { 
    StyleSheet, Text ,View,  ScrollView,
     SafeAreaView, SectionList
  } from 'react-native';
import { CardView } from './components';
import { MaterialIcons } from '@expo/vector-icons';


export default class Menu extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        
        return {
            title: '전체 메뉴'
        };
    };

    render() {
        return(
            <SafeAreaView>
                <ScrollView>
                <SectionList
                    renderItem={({item, index, section}) => 
                    <CardView key={index}>
                    <Text>{item}</Text>
                    </CardView>}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={{fontWeight: 'bold'}}>{title}</Text>
                    )}
                    sections={[
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                    ]}
                    keyExtractor={(item, index) => item + index}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

   
  }