import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import React from 'react';
import {RTCView} from 'react-native-webrtc';
import {
  Director,
  View as MillicastView,
} from '@millicast/sdk/dist/millicast.debug.umd';
import {Logger as MillicastLogger} from '@millicast/sdk';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import myStyles from '../../styles/styles.js';
import * as viewerService from '../service/viewer.js';
import Multiview from './Multiview';

import {useSelector, useDispatch} from 'react-redux';

window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

class MillicastWidget extends React.Component {
  constructor(props) {
    super(props);
    this.styles = myStyles;
  }

  componentWillUnmount() {
    // if (!viewerStore.setMedia) {
      viewerService.stopStream();
      // dispatch({type: 'viewer/setStreams', payload: true});
      // this.setState({
      //   setMedia: true,
      // });
    // }
  }

  

  render() {
    const navigation = this.props.navigation;
    const viewerStore = this.props.viewerStore;
    console.log(viewerStore, 'coso 1');

    return (
      <>
        {
          // main/selected source
          viewerStore.streams[0] ? (
            <RTCView
              key={viewerStore.selectedSource ?? 'main'}
              streamURL={
                viewerStore.selectedSource ??
                viewerStore.streams[0].stream.toURL()
              }
              style={this.styles.video}
              objectFit="contain"
            />
          ) : (
            <View style={{padding: '5%'}}>
              <Text style={{color: 'white'}}>
                Press the 'play' button to start watching.
              </Text>
            </View>
          )
        }
        {
          <View style={myStyles.bottomMultimediaContainer}>
            <View style={myStyles.bottomIconWrapper}>
              <TouchableHighlight
                hasTVPreferredFocus
                tvParallaxProperties={{magnification: 1.5}}
                underlayColor="#AA33FF"
                onPress={viewerService.playPauseVideo}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {viewerStore.playing ? 'Pause' : 'Play'}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                hasTVPreferredFocus
                tvParallaxProperties={{magnification: 1.5}}
                underlayColor="#AA33FF"
                onPress={() => navigation.navigate('Multiview')}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Multiview
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        }
      </>
    );
  }
}

function ViewerMain(navigation) {
  const viewerStore = useSelector(state => state.viewerReducer);

  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
        <MillicastWidget
          {...{navigation: navigation, viewerStore: viewerStore}}
          store="viewerStore"
        />
      </SafeAreaView>
    </>
  );
}

const ViewerStack = createNativeStackNavigator();

export default function App(props) {
  return (
    <ViewerStack.Navigator screenOptions={{headerShown: false}}>
      <ViewerStack.Screen name="Viewer Main" component={ViewerMain} />
      <ViewerStack.Screen name="Multiview" component={Multiview} />
    </ViewerStack.Navigator>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
});
