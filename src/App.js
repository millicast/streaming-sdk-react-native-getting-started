/* eslint-disable */
import { Button } from '@dolbyio/uikit-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text, View, SafeAreaView, Platform } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import Multiview from './src/components/Multiview';

import Publisher from './components/Publisher';
import Viewer from './components/Viewer';
import store from './store';
import { Routes } from './types/routes.types';
import myStyles from '../styles/styles.js';
import {Navigator} from './components/Navigator';

const HomeScreen = ({ navigation }) => {
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
        <Button title="publisher" type="primary" onPress={() => navigation.navigate('Publisher App')} />
      ) : null}

      <View style={{ paddingTop: 16 }} />
      <Button title="subscriber" type="primary" onPress={() => navigation.navigate(Routes.UserInput)} />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
<<<<<<< HEAD:App.js
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
          }}
        >
          <Stack.Screen name="Millicast SDK Demo" component={HomeScreen} />
          <Stack.Screen name="Subscriber App" component={Multiview} />
          <Stack.Screen name="Publisher App" component={Publisher} />
        </Stack.Navigator>
=======
        <Navigator />
>>>>>>> 9b19362 (navigator):src/App.js
      </NavigationContainer>
      </Provider>
  );
};

export default App;
