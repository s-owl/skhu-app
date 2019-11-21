
import React, {Component} from 'react'; 
import {
  StyleSheet, View, Modal, KeyboardAvoidingView,
  SafeAreaView, Text, ScrollView
} from 'react-native';
import Touchable from './touchable';
import {LinearGradient} from 'expo-linear-gradient';
import BuildConfigs from '../config';
import {useColorScheme} from 'react-native-appearance';

function ThemeText(props){
  let colorScheme = useColorScheme();
  const textColor = (colorScheme==='dark')? 'white' : 'black';
  return(<Text style={[{color: textColor}, props.style]}>{props.children}</Text>);
}

function ThemeBackground(props){
  let colorScheme = useColorScheme();
  let backgroundColor = (colorScheme==='dark')? 'black' :
    (props.hasCardViews? 'whitesmoke' : 'white');
  switch(props.viewType){
  case 'scrollView':  
    return(
      <View style={[{backgroundColor: backgroundColor}, props.style]}>
        {props.children}
      </View>
    );
  case 'safeAreaView':  
    return(
      <SafeAreaView style={[{backgroundColor: backgroundColor}, props.style]}>
        {props.children}
      </SafeAreaView>
    );
  default:
    return(
      <ScrollView style={[{backgroundColor: backgroundColor}, props.style]}>
        {props.children}
      </ScrollView>
    );
  }
}

function CardView(props){
  let colorScheme = useColorScheme();
  let cardViewStyle;
  if(props.outlined){
    if(colorScheme === 'dark'){
      cardViewStyle = styles.darkOutlinedCardView;
    }else{
      cardViewStyle = styles.outlinedCardView;
    }
  }else{
    if(colorScheme === 'dark'){
      cardViewStyle = styles.darkCardView;
    }else{
      cardViewStyle = styles.cardView;
    }
  }
  if(props.onPress != undefined){
    return(
      <Touchable onPress={props.onPress}
        style={[cardViewStyle, props.style]}>
        {props.children}
        <Text style={styles.actionsLabel}>{props.actionLabel}</Text>
      </Touchable>
    );
  }else{
    return(
      <View style={[cardViewStyle, props.style]}>
        {props.children}
        <Text style={styles.actionsLabel}>{props.actionLabel}</Text>
      </View>
    );
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
          <SafeAreaView style={{flexDirection: 'column', flex: 1, justifyContent: 'flex-end'}}
            forceInset={{vertical: 'always', horizontal: 'never'}}>

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{
                height: '100%',
                justifyContent: 'flex-end'
              }}>
              <KeyboardAvoidingView behavior="padding" enabled>
                <CardItem isHeader={true}>
                  <Text style={{fontWeight: 'bold'}}>{this.props.title}</Text>
                </CardItem>
                <View style={[{backgroundColor: 'white'}, this.props.style]}>
                  {this.props.children}
                </View>
                <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
                  height: 50, width: '100%'}}>
                  {this.props.buttons.map((item, index)=>{
                    return(
                      <CardItem key={index} style={{flex: 1, alignItems: 'center'}} onPress={item.onPress}>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  darkCardView: {
    borderRadius: 16,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#2a2a2a',
    color: 'white'
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
  darkOutlinedCardView: {
    borderRadius: 16,
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#2a2a2a',
    color: 'white'
  },
  actionsLabel: {
    color: BuildConfigs.primaryColor
  }
});

export{
  CardView, BottomModal, ThemeText, ThemeBackground
};
