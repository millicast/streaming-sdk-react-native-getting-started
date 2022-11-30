// In App.js in a new project

import * as React from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RTCView } from 'react-native-webrtc';
import { Director, View as MillicastView } from '@millicast/sdk/dist/millicast.debug.umd'

import Viewer from './Viewer'
import Publisher from './Publisher'

import myStyles from './styles.js'

function HomeScreen({ navigation }) {
  return (
    <View style ={myStyles.screenContainer}>
      <Text style ={myStyles.title}>SAMPLE APP</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Publisher App')} style={myStyles.buttonDesign}>
        <Text style = {myStyles.buttonText} >PUBLISH</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Subscriber App')} style={myStyles.buttonDesign}>
        <Text style = {myStyles.buttonText} >SUBSCRIBE</Text>
      </TouchableOpacity>
    </View>
  );
}

function LogoTitle({ title }) {
  return (
    <>
      <Image
        style={{ width: 50, height: 50, marginRight:10 }}
        source={require('./assets/millicastImage.png')}
      />
      <Text style={myStyles.title}>React Native Sample App</Text>
    </>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Millicast SDK Demo" component={HomeScreen} options={{ headerTitle: (props) => <LogoTitle {...props} /> }} />
      <Stack.Screen name="Publisher App" component={Publisher} />
      <Stack.Screen name="Subscriber App" component={Viewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;