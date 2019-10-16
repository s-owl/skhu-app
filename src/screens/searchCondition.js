import React, {Component} from 'react';
import {
  View, TextInput, Text, ScrollView, KeyboardAvoidingView, Picker, StyleSheet
} from 'react-native';
import {List} from 'immutable';

import {SortByCodes} from '../components/searchBar';
import ListItem from '../components/listitem';

// 스타일 지정
const styles = StyleSheet.create({
  view: {flex: 1, backgroundColor: 'white', justifyContent: 'space-around'},
  input: {
    fontSize: 20
  },
  container: {flex: 1},
  picker: {
    height: 120,
    flex: 1,
    justifyContent: 'center'
  },
  item: {
    height: 120
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row'
  },
  buttons: {
    flex: 1,
    alignItems: 'center'
  }
});

// 검색 조건 스크린 클래스
export default class searchCondition extends Component {
  // 제목 표시
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;
      
    return {
      title: '검색 조건',
    };
  };

  // 초기화
  constructor(props) {
    super(props);
    // 스크린 간의 통신을 위한 네비게이션
    const {navigation} = props;
    // 필요한 변수 가져오기
    this.dataType = navigation.getParam('dataType', {});
    this.state = {
      condition: navigation.getParam('condition', {})
    };

    // setter 생성
    this.setCondition = (itemKey, itemValue)=>{this.setState({
      condition: this.state.condition.set(itemKey, itemValue)
    });};

    // 프로시져 지정
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
                <ListItem style={styles.container}>
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
                        {List(SortByCodes(itemType.values).keys())
                          .toJS()
                          .map((value, index)=>{
                            return(
                              <Picker.Item
                                label={value} value={index} />);
                          })}
                      </Picker>);
                    }})()}
                </ListItem>)
              )
          }
          <View style={styles.buttonContainer}>
            <ListItem
              onPress={this.handleCancel}
              style={styles.buttons}>
              <Text style={styles.text}>취소</Text>
            </ListItem>
            <ListItem
              onPress={this.handleConfirm}
              style={styles.buttons}>
              <Text style={styles.text}>확인</Text>
            </ListItem>
          </View>
          <View style={{height: 50}} /> 
        </KeyboardAvoidingView>
      </ScrollView>);
  }
}

