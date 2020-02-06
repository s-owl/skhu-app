
import React, {Component} from 'react'; 
import {
  StyleSheet, View, Modal, KeyboardAvoidingView,
  SafeAreaView, TextInput, ScrollView, Picker, Text
} from 'react-native';
import Touchable from './touchable';
import BuildConfigs from '../config';
import {useColorScheme, Appearance} from 'react-native-appearance';

function ThemePicker(props){
  let colorScheme = useColorScheme();
  const textColor = (colorScheme==='dark')? 'white' : 'black';
  return(
    <Picker itemStyle={{color: textColor}} {...props}>
      {props.children}
    </Picker>);
}

class ThemeTextInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      textColor: Appearance.getColorScheme() === 'dark' ? 'white' : 'black'
    };
    this.component = React.createRef();
  }
  componentDidMount(){
    this.subscription = Appearance.addChangeListener(({colorScheme}) => {
      this.setState({textColor: colorScheme==='dark'? 'white' : 'black'});
    });
  }
  focus(){
    this.component.current.focus();
  }
  render(){
    return(
      <TextInput style={[{color: this.state.textColor}, this.props.style]}
        ref={this.component} {...this.props}/>
    );
  }
}

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
      <ScrollView style={[{backgroundColor: backgroundColor}, props.style]}>
        {props.children}
      </ScrollView>
    );
  case 'safeAreaView':  
    return(
      <SafeAreaView style={[{backgroundColor: backgroundColor}, props.style]}>
        {props.children}
      </SafeAreaView>
    );
  default:
    return(
      <View style={[{backgroundColor: backgroundColor}, props.style]}>
        {props.children}
      </View>
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
  CardView, ThemeText, ThemeBackground, ThemeTextInput, ThemePicker
};
