
import React, { Component } from 'react';
import { 
  StyleSheet, View, TouchableOpacity, Modal, SafeAreaView, Text
} from 'react-native';
class CardView extends Component{
  render(){
    if(this.props.onPress != undefined){
      return(
        <TouchableOpacity onPress={this.props.onPress}
          style={[styles.container, this.props.style]}>
          {this.props.children}
        </TouchableOpacity>
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
        <TouchableOpacity onPress={this.props.onPress}
          style={[itemStyle, this.props.style]}>
          {this.props.children}
        </TouchableOpacity>
      );
    }else{
      return(
        <View style={[itemStyle, this.props.style]}>
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
        <SafeAreaView style={{flexDirection: 'column', flex:1, justifyContent:'flex-end'}} 
          forceInset={{ vertical: 'always', horizontal: 'never' }}>
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
                <CardItem style={{flex:1, alignItems:'center'}} onPress={item.onPress}>
                  <Text>{item.label}</Text>
                </CardItem>
              );
            })}
          </View>
          <CardItem/>
        </SafeAreaView>
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
    elevation: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  cardItemHeader: {
    elevation: 1,
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