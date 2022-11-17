// In App.js in a new project

import * as React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RTCView } from 'react-native-webrtc';
import { Director, View as MillicastView } from '@millicast/sdk/dist/millicast.debug.umd'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
          title="Publisher App"
          onPress={() => navigation.navigate('Publisher App')}
        />
      <Button
          title="Subscriber App"
          onPress={() => navigation.navigate('Subscriber App')}
        />
    </View>
  );
}

function PublisherScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Publisher</Text>
    </View>
  );
}

function SubscriberScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Subscriber</Text>
    </View>
  );
}

function LogoTitle({ title }) {
  return (
    <>
      <Image
        style={{ width: 50, height: 50 }}
        source={require('./assets/favicon.png')}
      />
      <Text>title</Text>
    </>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Millicast SDK Demo" component={HomeScreen} options={{ headerTitle: (props) => <LogoTitle {...props} /> }} />
      <Stack.Screen name="Publisher App" component={PublisherScreen} />
      <Stack.Screen name="Subscriber App" component={SubscriberScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;