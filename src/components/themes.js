import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

const baseStyles = StyleSheet.create({
  loginInput: {
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  }
});

export const SKHUsLightTheme = {
  dark: false,
  colors: {
    primary: '#569f59',
    background: 'white',
    backgroundWithCards: 'whitesmoke',
    card: 'white',
    text: 'black',
    border: 'lightgrey',
    timeCard: 'lightgrey'
  },
  styles: StyleSheet.create({
    loginInput: StyleSheet.flatten([{
      backgroundColor: 'rgba(220, 220, 220, 0.8)',
      color: 'black'
    }, baseStyles.loginInput])
  })
};

export const SKHUsDarkTheme = {
  dark: true,
  colors: {
    primary: '#569f59',
    background: 'black',
    backgroundWithCards: 'black',
    card: '#2a2a2a',
    text: 'white',
    border: '#2a2a2a',
    timeCard: '#2a2a2a'
  },
  styles: StyleSheet.create({
    loginInput: StyleSheet.flatten([{
      backgroundColor: '#2a2a2a',
      color: 'white'
    }, baseStyles.loginInput])
  })
};

export function withThemeAndRef(Component){
  return React.forwardRef((props, ref) => {
    const {colors} = useTheme();
    return <Component colors={colors} {...props} forwardedRef={ref} />;
  });
}
