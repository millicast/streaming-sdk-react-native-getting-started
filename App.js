/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Viewer from './Viewer'
import Publisher from './Publisher'

import myStyles from './styles.js'
import { Platform } from "react-native"

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={myStyles.screenContainer}>
      <Text style={myStyles.title}>SAMPLE APP</Text>
      {!Platform.isTV ?
        <TouchableOpacity
          onPress={() => navigation.navigate('Publisher App')}
          style={myStyles.buttonDesign}>
          <Text style={myStyles.buttonText}>PUBLISHER</Text>
        </TouchableOpacity>
        : null
      }

      <TouchableOpacity
        hasTVPreferredFocus
        onPress={() => navigation.navigate('Subscriber App')}
        style={myStyles.buttonDesign}>
        <Text style={myStyles.buttonText}>SUBSCRIBER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer style={myStyles.screenContainer}>
      <Stack.Navigator style={myStyles.screenContainer}>
        <Stack.Screen name="Millicast SDK Demo" component={HomeScreen} />
        <Stack.Screen name="Subscriber App" component={Viewer} />
        <Stack.Screen name="Publisher App" component={Publisher} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
