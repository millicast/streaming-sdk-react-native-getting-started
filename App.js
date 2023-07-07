// In App.js in a new project

import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as utils from './service/utils.js'

import Viewer from './Viewer'
import Publisher from './Publisher'

import styles from './styles.js'

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Sample App</Text>
      {!utils.isTV() ?
        <TouchableOpacity onPress={() => navigation.navigate('Publisher App')} style={styles.buttonDesign}>
          <Text style={styles.buttonText}>PUBLISHER</Text>
        </TouchableOpacity>
        : null
      }
      <TouchableOpacity onPress={() => navigation.navigate('Subscriber App')} style={styles.buttonDesign}>
        <Text style={styles.buttonText}>SUBSCRIBER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#14141A',
        },
        headerTitleAlign: 'center',
        contentStyle: {
          borderTopColor: '#34343B',
          borderTopWidth: 1,
        },
      }}>
        <Stack.Screen name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <Image source={require('./assets/img/Dolby_icon_DD.png')} style={{ width: 24, height: 24 }} />
            ),
          }}
        />
        {!utils.isTV() ?
          <Stack.Screen name="Publisher App" component={Publisher} />
          : null}
        <Stack.Screen name="Subscriber App" component={Viewer} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}

export default App;