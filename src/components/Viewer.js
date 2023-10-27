import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import {
  Director,
  View as MillicastView,
  Logger as MillicastLogger,
} from '@millicast/sdk';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import myStyles from '../../styles/styles.js';
import Multiview from './Multiview';

import {useSelector, useDispatch} from 'react-redux';

window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

function ViewerMain(navigation) {
  const viewerStore = useSelector(state => state.viewerReducer);
  const dispatch = useDispatch()

  useEffect(() => {
    // componentWillMount
    // console.log('VIEWER STORE:', viewerStore);
    return () => {
      // componentWillUnmount
      // if (!viewerStore.setMedia) {
      //   viewerService.stopStream();
      //   dispatch({type: 'viewer/setStreams', payload: true});
      //   this.setState({
      //     setMedia: true,
      //   });
      // }
    }
  }, [viewerStore])

  const subscribe = async () => {
    console.log(viewerStore.streamName, 'viewerStore.streamName...subscribe')
    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: viewerStore.streamName,
        streamAccountId: viewerStore.accountId,
      });
    // Create a new instance
    let view = new MillicastView(viewerStore.streamName, tokenGenerator, null);
    // Set track event handler to receive streams from Publisher.
    view.on('track', async event => {
      dispatch({type: 'viewer/onTrackEvent', payload: event});
    });

    //Start connection to viewer
    try {
      view.on('broadcastEvent', async event => {
        //Get event name and data
        const {name, data} = event;
        switch (name) {
          case 'active':
            if (viewerStore.sourceIds.indexOf(data.sourceId) === -1 && data.sourceId != null) {
              dispatch({type: 'viewer/setSourceIds', payload: [...viewerStore.sourceIds, data.sourceId]})
            }
            //A source has been started on the steam
            break;
          case 'inactive':
            //A source has been stopped on the steam
            break;
          case 'vad':
            //A new source was multiplexed over the vad tracks
            break;
          case 'layers':
            dispatch({type: 'viewer/setActiveLayers', payload: data.medias['0']?.active})
            //Updated layer information for each simulcast/svc video track
            break;
        }
      });
      await view.connect({
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
      });
      dispatch({type: 'viewer/setMillicastView', payload: view});
    } catch (e) {
      console.error('Connection failed. Reason:', e);
    }
  };

  const changeStateOfMediaTracks = (streams, value) => {
    streams.map(s =>
      s.stream.getTracks().forEach(videoTrack => {
        videoTrack.enabled = value;
      }),
    );
    dispatch({type: 'viewer/setStreams', payload: [...streams]});
    dispatch({type: 'viewer/setPlaying', payload: value});
  };

  const playPauseVideo = async () => {
    console.log(viewerStore);
    if (viewerStore.setMedia) {
      console.log('viewerStore.setMedia', viewerStore.setMedia)
      console.log('Stream Name:', viewerStore.streamName);
  
      await subscribe();
      dispatch({type: 'viewer/setSetMedia', payload: false});
    }
    const isPaused = !viewerStore.playing;
    changeStateOfMediaTracks(viewerStore.streams, isPaused);
  };

  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
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
              style={myStyles.video}
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
                onPress={playPauseVideo}>
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
