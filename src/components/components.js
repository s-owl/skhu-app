
import React, { Component } from 'react'; //default
import {
  StyleSheet, View, Modal, KeyboardAvoidingView,
  SafeAreaView, Text, ScrollView //사용되는 친구들
} from 'react-native';
import Touchable from './touchable';
import { LinearGradient } from 'expo'; //라이브러리


class CardView extends Component{ //table View
  render(){     //객체 업데이트 maybe callback, touch처리 메소드
    if(this.props.onPress != undefined){
      return(
        <Touchable onPress={this.props.onPress}
          style={[styles.container, this.props.style]}>
          {this.props.children}
        </Touchable>
      );
    }else{
      return(
        <View style={[styles.container, this.props.style]}>
          {this.props.children}
        </View>
      );
    }
  }
}

class CardItem extends Component{
  render(){
    const itemStyle = this.props.isHeader ? styles.cardItemHeader : styles.cardItem;
    if(this.props.onPress != undefined){
      return(
        <Touchable onPress={this.props.onPress}
          style={[itemStyle, this.props.style, (this.props.elevate)? {elevation: 1}:{}]}>
          {this.props.children}
        </Touchable>
      );
    }else{
      return(
        <View style={[itemStyle, this.props.style, (this.props.elevate)? {elevation: 1}:{}]}>
          {this.props.children}
        </View>
      );
    }
  }
}

class BottomModal extends Component{
  render(){
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <SafeAreaView style={{flexDirection: 'column', flex:1, justifyContent:'flex-end'}}
            forceInset={{ vertical: 'always', horizontal: 'never' }}>

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{
                height: '100%',
                justifyContent:'flex-end'
              }}>
              <KeyboardAvoidingView behavior="padding" enabled>
                <CardItem isHeader={true}>
                  <Text style={{fontWeight: 'bold'}}>{this.props.title}</Text>
                </CardItem>
                <View style={[{backgroundColor: 'white'}, this.props.style]}>
                  {this.props.children}
                </View>
                <View style={{flex:0, flexDirection: 'row', backgroundColor: 'white',
                  height:50, width:'100%'}}>
                  {this.props.buttons.map((item, index)=>{
                    return(
                      <CardItem key={index} style={{flex:1, alignItems:'center'}} onPress={item.onPress}>
                        <Text>{item.label}</Text>
                      </CardItem>
                    );
                  })}
                </View>
                <CardItem/>
              </KeyboardAvoidingView>
            </LinearGradient>


          </SafeAreaView>
        </ScrollView>
      </Modal>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  cardItem: {
    // elevation: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  cardItemHeader: {
    // elevation: 1,
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    padding: 8,
    backgroundColor: 'white',
  }
});

export{
  CardView, CardItem, BottomModal
};
