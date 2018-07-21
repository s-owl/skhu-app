
import React, { Component } from 'react';
import { 
  StyleSheet, View, ActivityIndicator, Modal, TouchableOpacity
} from 'react-native';
class CardView extends Component{
  render(){
    if(this.props.onPress != undefined){
      return(
        <TouchableOpacity onPress={this.props.onPress}
          style={styles.container}>
          <View style={this.props.style}>
            {this.props.children}
          </View>
        </TouchableOpacity>
      );
    }else{
      return(
        <View style={styles.container}>
          <View style={this.props.style}>
            {this.props.children}
          </View>
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

class LoadingModal extends Component{
  render(){
    return(
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.isVisible}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
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
  CardView, CardItem
};