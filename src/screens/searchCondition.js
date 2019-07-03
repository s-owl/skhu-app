import React, { Component } from 'react';
import {
  View, TextInput, Text, ScrollView, KeyboardAvoidingView, Picker, StyleSheet
} from 'react-native';
import { Map, List } from "immutable";
import { MaterialIcons } from '@expo/vector-icons';

import { CardItem } from '../components/components';
import { primaryColor } from '../config.js';

const styles = StyleSheet.create({
  view: {flex: 1,backgroundColor: 'whitesmoke',justifyContent: "space-around"},
  input: {
    fontSize:20
  },
  container: {flex: 1},
  picker: {
    height: 120,
    flex: 1,
    justifyContent: "center"
  },
  item: {
    height: 120
  },
  buttonContainer: {
    flex: 0,
    flexDirection: "row"
  },
  buttons: {
    flex: 1,
    alignItems: "center"
  }
});

export default class searchCondition extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
      
    return {
      title: '검색 조건',
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.dataType = navigation.getParam("dataType", {});
    this.state = {
      condition: navigation.getParam("condition", {})
    };

    this.setCondition = (itemKey, itemValue)=>{this.setState({
      condition: this.state.condition.set(itemKey, itemValue)
    });};
    this.handleConfirm = ()=>{
      navigation.getParam('onConfirm')(this.state.condition);
      this.props.navigation.goBack();
    };
    this.handleCancel = ()=>this.props.navigation.goBack();
  }

  render() {
    return(
    <ScrollView
      contentContainerStyle={styles.view}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
        {
          this.dataType.toArray()
          .map((item)=>(
            <CardItem style={styles.container}>
              {(() => {
                const itemKey = item[0];
                const itemType = item[1];

                if (typeof itemType == 'string') {
                  return(<TextInput placeholder={itemType}
                                    onChangeText=
                                      {(value)=>this.setCondition(itemKey, value)}
                                    defaultValue={this.state.condition.get(itemKey)}
                                    style={styles.input }/>);
                } else if (typeof itemType == 'object') {
                  return(<Picker
                           onValueChange={(value, _)=>this.setCondition(itemKey, value)}
                           selectedValue={this.state.condition.get(itemKey)}
                           style={styles.picker}
                           itemStyle={styles.item}>
                            {List(Map(itemType.values).keys())
                              .toJS()
                              .map((value, index)=>{
                                return(
                                  <Picker.Item
                                    label={value} value={index} />);
                              })}
                         </Picker>)
                }})()}
            </CardItem>)
          )
        }
        <View style={styles.buttonContainer}>
          <CardItem
              onPress={this.handleCancel}
              style={styles.buttons}>
            <Text style={styles.text}>취소</Text>
          </CardItem>
          <CardItem
              onPress={this.handleConfirm}
              style={styles.buttons}>
            <Text style={styles.text}>확인</Text>
          </CardItem>
        </View>
        <View style={{ height: 50 }} /> 
      </KeyboardAvoidingView>
    </ScrollView>);
  }
}

