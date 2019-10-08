import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {
  View, Text
} from 'react-native';
import {Map, List} from 'immutable';
import {MaterialIcons} from '@expo/vector-icons';

import ListItem from './listitem';

// 픽커와 형식 간의 정렬을 통일하기 위한 함수
export function SortByCodes(pickerValues) {
  return Map(pickerValues).sortBy((v, k)=> v);
}

// 검색 조건 초기화
function initCondition(dataType, initParam) {
  // 조건 초기화
  let init = dataType.map(value=>{
    if (typeof value == 'string') {
      return '';
    } else if (typeof value == 'object') {
      return 0;
    }
  });

  // 초기 조건 입력
  if (initParam != undefined) {
    const param = Map(initParam);
    param.forEach((v, k)=>{
      const type = init.get(k);
      if (typeof type == 'string')
        init = init.set(k, v);
      else if (typeof type == 'number')
        init =
          init.set(
            k,
            SortByCodes(dataType.getIn([k, 'values']))
              .toList().findEntry((value)=> v == value)[0]);
    });
  }
  return init;
}

// 외부의 상태 조건과 일치시키기 위해 상태값을 생성한다.
export function createSearchCondition(dataType, initParam) {
  return translatePickerCondition(
    initCondition(dataType, initParam),
    dataType);
}

// searchCondition 이랑 searchBar에서는 픽커와 텍스트를 구별하기 위해 타입을 보는데 픽커는 숫자를 사용한다. 그런데 실질적으로 출력값은 모두 텍스트여야해서 변환을 한다.
function translatePickerCondition(condition, dataType) {
  return dataType.map((type, key)=>{
    if (typeof type == 'string')
      return condition.get(key);
    else if (typeof type == 'object') {
      // 표시되는 픽커아이템의 숫자와 동일한 숫자값을 갖게 하기 위해 SortByCodes를 쓴다.
      let res = SortByCodes(type.values).toList().get(condition.get(key));
      return res;
    }
  });
}

class SearchBar extends Component {
  // 조건 getter
  getCondition() {
    return this.state.condition;
  }

  // 초기화
  constructor(props) {
    super(props);
    this.dataType = Map(props.dataType);

    let init = initCondition(this.dataType, props.initParam);
    this.state = {
      condition: init
    };
  }

  // 변경시 일어나는 행동을 정의
  handleCondition(condition) {
    this.setState({
      condition: condition
    });

    let newCondition = translatePickerCondition(condition, this.dataType);
    this.props.onChange(newCondition);
  }

  render() {
    return(
      <View style={{backgroundColor: 'white'}}>
        <ListItem style={{flex: 0, flexDirection: 'row'}}
          elevate={true}
          onPress={()=>{
            this.props.navigation.navigate('searchCondition', {
              dataType: this.dataType,
              condition: this.state.condition,
              onConfirm: this.handleCondition.bind(this)
            });
          }}>
          <Text style={{flex: 1}}>
            {this.getCondition()
              .map((value, key) => {
                if (typeof value == 'string') {
                  return value;
                } else if (typeof value == 'number') {
                  return List(SortByCodes(this.dataType.getIn([key, 'values'])).keys())
                    .get(value);
                }
                return '';
              })
              .toList()
              .toJS().join(', ')}
          </Text>
          <MaterialIcons name="search" size={20} style={{flex: 0}}/>
        </ListItem>
      </View>);
  }
}

export default withNavigation(SearchBar);
