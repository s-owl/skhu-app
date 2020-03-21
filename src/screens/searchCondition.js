import React, {useState, useEffect} from 'react';
import {
  View, ScrollView, KeyboardAvoidingView, StyleSheet, Picker, TextInput
} from 'react-native';
import {List} from 'immutable';
import {ThemedText} from '../components/components';
import {SortByCodes} from '../components/searchBar';
import ListItem from '../components/listitem';
import {useTheme} from '@react-navigation/native';
import {Map} from 'immutable';

// 스타일 지정


// 검색 조건 스크린 클래스
export default function searchCondition(props){
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    view: {flex: 1, justifyContent: 'space-around'},
    input: {
      fontSize: 20,
      color: colors.text
    },
    container: {flex: 1},
    picker: {
      height: 120,
      flex: 1,
      justifyContent: 'center',
      color: colors.text
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
  const {dataType, condition, onConfirm} = props.route.params;
  const [conditionState, setConditionState] = useState(condition);
  // useEffect(()=>setConditionState(condition), []);

  const setCondition = (itemKey, itemValue) => {
    setConditionState(conditionState.set(itemKey, itemValue));
  };

  const handleConfirm = () => {
    onConfirm(conditionState);
    props.navigation.goBack();
  };
  const handleCancel = () => props.navigation.goBack();

  return(
    <ScrollView
      contentContainerStyle={styles.view}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
        {dataType.toArray()
          .map((item)=>{
            const itemKey = item[0];
            const itemType = item[1];

            if (typeof itemType == 'string') {
              return(
                <ListItem style={styles.container} key={itemKey}>
                  <TextInput placeholder={itemType}
                    onChangeText={(value)=>setCondition(itemKey, value)}
                    defaultValue={conditionState.get(itemKey)}
                    style={styles.input }/>
                </ListItem>);
            } else if (typeof itemType == 'object') {
              return(
                <ListItem style={styles.container} key={itemKey}>
                  <Picker onValueChange={(value, _)=>setCondition(itemKey, value)}
                    selectedValue={conditionState.get(itemKey)}
                    style={styles.picker}>
                    {List(SortByCodes(itemType.values).keys())
                      .toJS()
                      .map((value, index)=>{
                        return(
                          <Picker.Item
                            label={value} value={index} key={`${index}_${value}`} />);
                      })}
                  </Picker>
                </ListItem>);
            }
          })}
        <View style={styles.buttonContainer}>
          <ListItem
            onPress={handleCancel}
            style={styles.buttons}>
            <ThemedText style={styles.text}>취소</ThemedText>
          </ListItem>
          <ListItem
            onPress={handleConfirm}
            style={styles.buttons}>
            <ThemedText style={styles.text}>확인</ThemedText>
          </ListItem>
        </View>
        <View style={{height: 50}} /> 
      </KeyboardAvoidingView>
    </ScrollView>);
}

