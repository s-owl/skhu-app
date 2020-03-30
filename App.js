import React from 'react';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BuildConfigs from './src/config';
import {SKHUsDarkTheme, SKHUsLightTheme} from './src/components/themes';

import Login from './src/Login';
import MainShell from './src/MainShell';
import About from './src/screens/about';
import * as Sentry from 'sentry-expo';

import {Asset} from 'expo-asset';
Asset;

const Stack = createStackNavigator();
function AuthStack(){
  return(
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="About" component={About}/>
    </Stack.Navigator>
  );
}

Sentry.init({
  dsn: BuildConfigs.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: true
});

export default function App(){
  const scheme = useColorScheme();
  return (
    <AppearanceProvider>
      <NavigationContainer theme={scheme === 'dark' ? SKHUsDarkTheme : SKHUsLightTheme}>
        <Stack.Navigator initialRouteName="AuthStack" headerMode="none">
          <Stack.Screen name="AuthStack" component={AuthStack}/>
          <Stack.Screen name="MainStack" component={MainShell}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
  
}

