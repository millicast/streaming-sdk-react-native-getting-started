import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  AppState
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

function ViewerMain({navigation}) {
  const appState = useRef(AppState.currentState);

  const streamName = useSelector(state => state.viewerReducer.streamName);
  const accountId = useSelector(state => state.viewerReducer.accountId);
  const isMediaSet = useSelector(state => state.viewerReducer.isMediaSet);
  const playing = useSelector(state => state.viewerReducer.playing);
  const streams = useSelector(state => state.viewerReducer.streams);
  const sourceIds = useSelector(state => state.viewerReducer.sourceIds);
  const selectedSource = useSelector(state => state.viewerReducer.selectedSource);
  const millicastView = useSelector(state => state.viewerReducer.millicastView);
  const dispatch = useDispatch();
  
  const playingRef = useRef(null);
  const millicastViewRef = useRef(null);

  playingRef.current = playing;
  millicastViewRef.current = millicastView;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (playingRef.current) {
        stopStream();
      }
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    if (playingRef.current) {
      stopStream();
    }
  }

  const stopStream = async () => {
    await millicastViewRef.current.stop();
    dispatch({type: 'viewer/setPlaying', payload: false});
    dispatch({type: 'viewer/setIsMediaSet', payload: true});
    dispatch({type: 'viewer/setStreams', payload: []});
    dispatch({type: 'viewer/setSelectedSource', payload: {url: null, mid: null}});
  };

  const subscribe = async () => {
    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: streamName,
        streamAccountId: accountId,
      });
    // Create a new instance
    let view = new MillicastView(streamName, tokenGenerator, null);
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
            if (
              sourceIds?.indexOf(data.sourceId) === -1 &&
              data.sourceId != null
            ) {
              dispatch({
                type: 'viewer/addSourceId',
                payload: data.sourceId,
              });
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
            dispatch({
              type: 'viewer/setActiveLayers',
              payload: data.medias?.['0']?.active,
            });
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

  const changeStateOfMediaTracks = value => {
    streams?.map(s =>
      s.stream?.getTracks().forEach(videoTrack => {
        videoTrack.enabled = value;
      }),
    );
    dispatch({type: 'viewer/setPlaying', payload: value});
  };

  const playPauseVideo = async () => {
    if (isMediaSet) {
      await subscribe();
      dispatch({type: 'viewer/setIsMediaSet', payload: false});
    }
    changeStateOfMediaTracks(!playing);
  };

  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
        <>
          {
            // main/selected source
            streams?.[0] ? (
              <RTCView
                key={selectedSource.mid ?? 'main'}
                streamURL={
                  selectedSource.url ??
                    streams?.[0]?.stream?.toURL()
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
          <View style={myStyles.bottomMultimediaContainer}>
            <View style={myStyles.bottomIconWrapper}>
              <TouchableHighlight
                hasTVPreferredFocus
                tvParallaxProperties={{magnification: 1.5}}
                underlayColor="#AA33FF"
                onPress={playPauseVideo}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {playing ? 'Pause' : 'Play'}
                </Text>
              </TouchableHighlight>
              {
                playing && 
                <TouchableHighlight
                  hasTVPreferredFocus
                  tvParallaxProperties={{magnification: 1.5}}
                  underlayColor="#AA33FF"
                  onPress={() => {
                    dispatch({
                      type: 'viewer/setSelectedSource',
                      payload: {
                        url: null,
                        mid: null
                      },
                    });
                    navigation.navigate('Multiview');
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {playing ? 'Multiview' : null}
                  </Text>
                </TouchableHighlight>
              }
            </View>
          </View>
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
