import * as React from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import {HeaderButtons, HeaderButton} from 'react-navigation-header-buttons';
import {useTheme} from '@react-navigation/native';

// define IconComponent, color, sizes and OverflowIcon in one place
const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} 
    color={useTheme().color.text} />
);

export const MaterialHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcons name="more-vert" size={23} 
        color={useTheme().color.text} />}
      {...props}
    />
  );
};
export {Item} from 'react-navigation-header-buttons';