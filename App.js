import * as React from 'react';
import {Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';

import store from './src/store';

import Viewer from './src/components/Viewer';
import Publisher from './src/components/Publisher';

import {useDispatch} from 'react-redux';

import myStyles from './styles/styles.js';
import {Platform} from 'react-native';

function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  dispatch({
    type: 'viewer/setStreamName',
    payload: process.env.REACT_APP_MILLICAST_STREAM_NAME_VIEWER,
  });
  dispatch({
    type: 'viewer/setAccountId',
    payload: process.env.REACT_APP_MILLICAST_ACCOUNT_ID,
  });
  dispatch({
    type: 'publisher/setStreamName',
    payload: process.env.REACT_APP_MILLICAST_STREAM_NAME_PUBLISHER,
  });
  dispatch({
    type: 'publisher/setPublishingToken',
    payload: process.env.REACT_APP_MILLICAST_PUBLISHING_TOKEN,
  });

  return (
    <SafeAreaView style={myStyles.screenContainer}>
      <Text style={myStyles.title}>SAMPLE APP</Text>
      {!Platform.isTV ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('Publisher App')}
          style={myStyles.buttonDesign}>
          <Text style={myStyles.buttonText}>PUBLISHER</Text>
        </TouchableOpacity>
      ) : null}

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
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
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
            // hide the header bar for tvOS due to incompatibility of the library
            headerShown: !(Platform.OS === 'ios' && Platform.isTV),
          }}>
          <Stack.Screen name="Millicast SDK Demo" component={HomeScreen} />
          <Stack.Screen name="Subscriber App" component={Viewer} />
          <Stack.Screen name="Publisher App" component={Publisher} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
