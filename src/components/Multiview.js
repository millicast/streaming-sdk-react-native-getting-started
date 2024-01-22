/* eslint-disable */
import { Director, View as MillicastView } from '@millicast/sdk';
import { Logger as MillicastLogger } from '@millicast/sdk';
import { Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableHighlight, FlatList, Platform, AppState } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

import myStyles from '../../styles/styles.js';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export default function Multiview({ navigation, route }) {
  const appState = useRef(AppState.currentState);

  const streamName = useSelector((state) => state.viewerReducer.streamName);
  const accountId = useSelector((state) => state.viewerReducer.accountId);
  const isMediaSet = useSelector((state) => state.viewerReducer.isMediaSet);
  const streams = useSelector((state) => state.viewerReducer.streams);
  const streamsProjecting = useSelector((state) => state.viewerReducer.streamsProjecting);
  const sourceIds = useSelector((state) => state.viewerReducer.sourceIds);
  const playing = useSelector((state) => state.viewerReducer.playing);
  const millicastView = useSelector((state) => state.viewerReducer.millicastView);
  const selectedSource = useSelector((state) => state.viewerReducer.selectedSource);
  const dispatch = useDispatch();

  const playingRef = useRef(null);
  playingRef.current = playing;
  const streamsRef = useRef(null);
  const selectedSourceRef = useRef(null);
  const millicastViewRef = useRef(null);

  selectedSourceRef.current = selectedSource;
  streamsRef.current = streams;
  millicastViewRef.current = millicastView;

  const [columnsNumber, setColumnsNumber] = useState(1);

  useEffect(() => {
    console.log('***** addEventListener');
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (playingRef.current) {
        stopStream();
      }
    };
  }, [handleAppStateChange, stopStream]);

  const handleAppStateChange = (nextAppState) => {
    console.log('***** handleAppStateChange', nextAppState);
    appState.current = nextAppState;
    if (playingRef.current) {
      stopStream();
    }
  };

  const stopStream = async () => {
    await millicastViewRef.current.stop();
    dispatch({ type: 'viewer/setPlaying', payload: false });
    dispatch({ type: 'viewer/setIsMediaSet', payload: true });
    dispatch({ type: 'viewer/setStreams', payload: [] });
    dispatch({
      type: 'viewer/setSelectedSource',
      payload: { url: null, mid: null },
    });
    dispatch({ type: 'viewer/removeProjectingStreams' });
    dispatch({ type: 'viewer/setSourceIds', payload: [] });
  };

  const subscribe = async () => {
    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName,
        streamAccountId: accountId,
      });
    // Create a new instance
    const view = new MillicastView(streamName, tokenGenerator, null);
    // Set track event handler to receive streams from Publisher.
    view.on('track', async (event) => {
      dispatch({ type: 'viewer/onTrackEvent', payload: event });
    });

    // Start connection to viewer
    try {
      view.on('broadcastEvent', async (event) => {
        // Get event name and data
        const { name, data } = event;
        switch (name) {
          case 'active':
            console.log('*** active', sourceIds, data.sourceId);
            if (sourceIds?.indexOf(data.sourceId) === -1 && data.sourceId != null) {
              console.log('*** sourceIds active', sourceIds, data.sourceId);
              dispatch({
                type: 'viewer/addSourceId',
                payload: data.sourceId,
              });
              if (data.sourceId != 'main' && data.sourceId != null) {
                addRemoteTrack(data.sourceId);
              }
            }
            // A source has been started on the steam
            break;
          case 'inactive':
            // A source has been stopped on the steam
            break;
          case 'vad':
            // A new source was multiplexed over the vad tracks
            break;
          case 'layers':
            dispatch({
              type: 'viewer/setActiveLayers',
              payload: data.medias?.['0']?.active,
            });
            // Updated layer information for each simulcast/svc video track
            break;
        }
      });
      await view.connect({
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
      });
      dispatch({ type: 'viewer/setMillicastView', payload: view });

      millicastViewRef.current = view;
    } catch (e) {
      console.error('Connection failed. Reason:', e);
    }
  };

  useEffect(() => {
    checkOrientation();
    const subscription = Dimensions.addEventListener('change', () => {
      checkOrientation();
    });
    return () => subscription?.remove();
    // return () => {
    //   Dimensions.removeEventListener(subscription);
    // };
  }, []);
  const checkOrientation = async () => {
    setColumnsNumber(Dimensions.get('window').width > Dimensions.get('window').height ? 2 : 1);
  };

  const changeStateOfMediaTracks = (value) => {
    streams?.map((s) =>
      s.stream?.getTracks().forEach((videoTrack) => {
        videoTrack.enabled = value;
      }),
    );
    dispatch({ type: 'viewer/setPlaying', payload: value });
  };

  const playPauseVideo = async () => {
    if (isMediaSet) {
      await subscribe();
      dispatch({ type: 'viewer/setIsMediaSet', payload: false });
    }
    changeStateOfMediaTracks(!playing);
  };

  const addRemoteTrack = async (sourceId) => {
    if (millicastViewRef.current == null) {
      console.log('***** call and exit addRemoteTrack for', sourceId);
      return;
    }
    const isAlreadyProjected = streams.some((stream) => stream.sourceId === sourceId);
    const isAlreadyProjecting = streamsProjecting.some((stream) => stream.sourceId === sourceId);
    if (!isAlreadyProjected && !isAlreadyProjecting) {
      dispatch({
        type: 'viewer/addProjectingStream',
        payload: { sourceId },
      });
      // eslint-disable-next-line no-undef
      const mediaStream = new MediaStream();
      const transceiver = await millicastViewRef.current.addRemoteTrack('video', [mediaStream]);
      const mediaId = transceiver.mid;
      await millicastView.project(sourceId, [
        {
          media: 'video',
          mediaId,
          trackId: 'video',
        },
      ]);
      dispatch({
        type: 'viewer/addStream',
        payload: { stream: mediaStream, videoMid: mediaId, sourceId },
      });
      dispatch({
        type: 'viewer/removeProjectingStream',
        payload: { sourceId },
      });
      console.log('**** streams:', streams, mediaStream);
    }
  };

  useEffect(() => {
    const initializeMultiview = async () => {
      try {
        await Promise.all(
          sourceIds?.map(async (sourceId) => {
            if (sourceId != 'main') {
              addRemoteTrack(sourceId);
            }
          }),
        );
      } catch (e) {
        console.log('error', e);
      }
    };
    initializeMultiview();
  }, [addRemoteTrack, navigation, sourceIds]);
  const margin = margins(columnsNumber);
  const labelLayout = margins(columnsNumber, true);
  return (
    <SafeAreaView style={stylesContainer.container}>
      <View
        style={{
          alignContent: 'center',
          marginBottom: 50,
        }}
      >
        {playing ? (
          <FlatList
            key={columnsNumber}
            data={streams}
            style={{
              textAlign: 'center',
            }}
            numColumns={columnsNumber}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item, index }) => (
              <View style={margin}>
                <>
                  <RTCView
                    key={item?.stream.toURL() + item?.stream.videoMid}
                    streamURL={item?.stream.toURL()}
                    style={{
                      width: columnsNumber === 2 ? '70%' : '100%',
                      flex: 1,
                      aspectRatio: 1,
                    }}
                  />
                  <TouchableHighlight
                    style={{
                      padding: 1,
                      position: 'absolute',
                      marginLeft: labelLayout.marginLeft,
                      bottom: labelLayout.bottom,
                      zIndex: 0,
                    }}
                    underlayColor="#AA33FF"
                    onPress={() => {}}
                  >
                    <Text
                      style={{
                        color: 'white',
                        backgroundColor: 'grey',
                        borderRadius: 3,
                        paddingHorizontal: 3,
                        justifyContent: 'flex-start',
                      }}
                    >
                      {!item.sourceId ? 'Main' : String(item.sourceId)}
                    </Text>
                  </TouchableHighlight>
                </>
              </View>
            )}
          />
        ) : (
          <View style={{ padding: '5%' }}>
            <Text style={{ color: 'white' }}>Press the 'play' button to start watching.</Text>
          </View>
        )}
      </View>
      <View style={myStyles.bottomMultimediaContainer}>
        <View style={myStyles.bottomIconWrapper}>
          <TouchableHighlight
            hasTVPreferredFocus
            tvParallaxProperties={{ magnification: 1.5 }}
            underlayColor="#AA33FF"
            onPress={playPauseVideo}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{playing ? 'Pause' : 'Play'}</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
});

function margins(columnsNumber, isLabel) {
  console.log('***** width: ', Dimensions.get('window').width);

  if (Platform.isTV && Platform.OS === 'ios') {
    return { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 };
  }

  if (columnsNumber == 1) {
    if (Dimensions.get('window').width < 500) {
      if (!isLabel) {
        return { marginTop: '-10%', marginBottom: '-25%', marginLeft: '2.5%', marginRight: '2.5%' };
      } else {
        return { marginLeft: '2.5%', bottom: '25%' };
      }
    } else {
      if (!isLabel) {
        return { marginTop: -90, marginBottom: -100, marginLeft: '2.5%', marginRight: '2.5%' };
      } else {
        return { marginLeft: '2.5%', bottom: 100 };
      }
    }
  } else {
    if (Dimensions.get('window').height < 500) {
      if (!isLabel) {
        return { marginTop: '-10%', marginBottom: '-10%', marginLeft: '2.5%', marginRight: '2.5%' };
      } else {
        return { marginLeft: '2.5%', bottom: '25%' };
      }
    } else {
      if (!isLabel) {
        return { marginTop: -90, marginBottom: -100, marginLeft: '2.5%', marginRight: '2.5%' };
      } else {
        return { marginLeft: '2.5%', bottom: 100 };
      }
    }
  }
}
