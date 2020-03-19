import React from 'react';
import {useTheme} from '@react-navigation/native';

export const SKHUsLightTheme = {
  dark: false,
  colors: {
    primary: '#569f59',
    background: 'white',
    backgroundWithCards: 'whitesmoke',
    card: 'white',
    text: 'black',
    border: 'lightgrey',
  },
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
  },
};


export function withThemeAndRef(Component){
  return React.forwardRef((props, ref) => {
    const {colors} = useTheme();
    return <Component colors={colors} {...props} forwardedRef={ref} />;
  });
}
