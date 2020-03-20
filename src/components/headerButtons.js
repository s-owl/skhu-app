import * as React from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import {HeaderButtons, HeaderButton} from 'react-navigation-header-buttons';
import {useTheme} from '@react-navigation/native';

// define IconComponent, color, sizes and OverflowIcon in one place
function MaterialHeaderButton(props){
  const {colors} = useTheme();
  return(
    <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} 
      color={colors.text} />
  );}

export function MaterialHeaderButtons(props) {
  const {colors} = useTheme();
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcons name="more-vert" size={23} 
        color={colors.text} />}
      {...props}
    />
  );
};
export {Item} from 'react-navigation-header-buttons';