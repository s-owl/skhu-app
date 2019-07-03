import React, { Component } from 'react';
import { withNavigation } from 'react-navigation'
import {
  View, Text
} from 'react-native';
import { Map, List } from "immutable";
import { MaterialIcons } from '@expo/vector-icons';

import {CardItem} from './components'

export function initCondition(dataType, initParam) {
  init = dataType.map(value=>{
    if (typeof value == 'string') {
      return '';
    } else if (typeof value == 'object') {
      return 0;
    }
  });

  if (initParam != undefined) {
    const param = Map(initParam);
    param.forEach((v,k)=>{
      const type = init.get(k);
      if (typeof type == 'string')
        init = init.set(k,v);
      else if (typeof type == 'number')
        init =
          init.set(
            k,
            Map(dataType.getIn([k,"values"]))
              .toList().findEntry((value)=> v == value)[0]);
    });
  }
  return init;
}

function translatePickerCondition(condition, dataType) {
  return dataType.map((type, key)=>{
    if (typeof type == 'string')
      return condition.get(key);
    else if (typeof type == 'object')
      return Map(type.values).toList().get(condition.get(key));
  });
}

export function createSearchCondition(dataType, initParam) {
  return translatePickerCondition(
    initCondition(dataType, initParam),
    dataType);
}

class searchBar extends Component {
  getCondition() {
    return this.state.condition;
  }

  constructor(props) {
    super(props);
    this.dataType = Map(props.dataType);

    init = initCondition(this.dataType, props.initParam);
    this.state = {
      condition: init
    }
  }

  setCondition(condition) {
    this.setState({
      condition: condition
    });

    newCondition = translatePickerCondition(condition, this.dataType);
    this.props.onChange(newCondition);
  }

  render() {
    return(
      <View style={{backgroundColor: 'whitesmoke'}}>
        <CardItem style={{flex:0, flexDirection: 'row'}}
                  elevate={true}
                  onPress={()=>{
                    this.props.navigation.navigate("searchCondition", {
                      dataType: this.dataType,
                      condition: this.state.condition,
                      onConfirm: this.setCondition.bind(this)
                    });
                  }}>
          <Text style={{flex:1}}>
            {this.getCondition()
                 .map((value, key) => {
                   if (typeof value == "string") {
                     return value;
                   } else if (typeof value == "number") {
                     return List(Map(this.dataType.getIn([key,"values"])).keys())
                                .get(value);
                   }
                   return ''
                 })
                 .toList()
                 .toJS().join(', ')}
          </Text>
          <MaterialIcons name="search" size={20} style={{flex: 0}}/>
        </CardItem>
      </View>);
  }
}

export default withNavigation(searchBar);
