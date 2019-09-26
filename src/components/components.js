
import React, { Component } from 'react'; //default
import {
  StyleSheet, View, Modal, KeyboardAvoidingView,
  SafeAreaView, Text, ScrollView //사용되는 친구들
} from 'react-native';
import Touchable from './touchable';
import { LinearGradient } from 'expo-linear-gradient';
import BuildConfigs from '../config';


class CardView extends Component{
  render(){ 
    const cardViewStyle = (this.props.outlined) ? styles.outlinedCardView : styles.cardView;
    if(this.props.onPress != undefined){
      return(
        <Touchable onPress={this.props.onPress}
          style={[cardViewStyle, this.props.style]}>
          {this.props.children}
          <Text style={styles.actionsLabel}>{this.props.actionLabel}</Text>
        </Touchable>
      );
    }else{
      return(
        <View style={[cardViewStyle, this.props.style]}>
          {this.props.children}
          <Text style={styles.actionsLabel}>{this.props.actionLabel}</Text>
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
  cardView: {
    borderRadius: 16,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  outlinedCardView: {
    borderRadius: 16,
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  actionsLabel: {
    color: BuildConfigs.primaryColor
  }
});

export{
  CardView, BottomModal
};
