import React, {Component} from 'react';
import {
  View, ScrollView, KeyboardAvoidingView, StyleSheet, TextInput, Picker, Platform
} from 'react-native';
import {List} from 'immutable';
import {ThemedText} from '../components/components';
import {SortByCodes} from '../components/searchBar';
import ListItem from '../components/listitem';
import {useTheme} from '@react-navigation/native';

function ThemedTextInput(props){
  const {colors} = useTheme();
  return(
    <TextInput style={[{color: colors.text, fontSize: 20}, props.style]} {...props}/>
  );
}

function ThemedPicker(props){
  const {colors} = useTheme();
  return(
    <Picker itemStyle={{color: colors.text}} {...props}>
      {props.children}
    </Picker>);
}

// 스타일 지정
const styles = StyleSheet.create({
  view: {justifyContent: 'space-around'},
  container: {flex: 1},
  picker: {
    height: Platform.OS == 'ios'? 120: 40,
    flex: 1,
    justifyContent: 'center'
  },
  item: {
    height: 120,
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
  // 초기화
  constructor(props) {
    super(props);
    // 필요한 변수 가져오기
    const {dataType, condition, onConfirm} = props.route.params;
    this.dataType = dataType;
    this.state = {
      condition: condition
    };

    // setter 생성
    this.setCondition = (itemKey, itemValue)=>{this.setState({
      condition: this.state.condition.set(itemKey, itemValue)
    });};

    // 프로시져 지정
    this.handleConfirm = ()=>{
      onConfirm(this.state.condition);
      this.props.navigation.goBack();
    };
    this.handleCancel = ()=>this.props.navigation.goBack();
  }

  render() {
    return(
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
        <ScrollView keyboardShouldPersistTaps='always'
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.view}
          style={styles.container}>
        
          {
            this.dataType.toArray()
              .map((item)=>(
                <ListItem style={styles.container}>
                  {(() => {
                    const itemKey = item[0];
                    const itemType = item[1];

                    if (typeof itemType == 'string') {
                      return(<ThemedTextInput placeholder={itemType}
                        onChangeText={(value)=>this.setCondition(itemKey, value)}
                        defaultValue={this.state.condition.get(itemKey)}/>);
                    } else if (typeof itemType == 'object') {
                      return(
                        <View style={{backgroundColor: Platform.OS == 'android'? 'white': 'rgba(0,0,0,0)'}}>
                          <ThemedPicker
                            onValueChange={(value, _)=>this.setCondition(itemKey, value)}
                            selectedValue={this.state.condition.get(itemKey)}
                            style={styles.picker}>
                            {List(SortByCodes(itemType.values).keys())
                              .toJS()
                              .map((value, index)=>{
                                return(
                                  <Picker.Item
                                    label={value} value={index} />);
                              })}
                          </ThemedPicker>
                        </View>);
                    }else{
                      return(<View></View>);
                    }})()}
                </ListItem>)
              )
          }
          
          <View style={{height: 50}} /> 
        </ScrollView>
        <View style={styles.buttonContainer}>
          <ListItem
            onPress={this.handleCancel}
            style={styles.buttons}>
            <ThemedText style={styles.text}>취소</ThemedText>
          </ListItem>
          <ListItem
            onPress={this.handleConfirm}
            style={styles.buttons}>
            <ThemedText style={styles.text}>확인</ThemedText>
          </ListItem>
        </View>
      </KeyboardAvoidingView>);
  }
}

