import { Director, View as MillicastView, Logger as MillicastLogger } from '@millicast/sdk';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  AppState,
  Pressable,
  DeviceEventEmitter,
  BackHandler,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

import { Routes } from '../../types/routes.types';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export const MultiView = ({ navigation }) => {
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
  const error = useSelector((state) => state.viewerReducer.error);
  const dispatch = useDispatch();
  const { routes, index } = navigation.getState();
  const currentRoute = routes[index].name;
  const playingRef = useRef(null);
  playingRef.current = playing;
  const streamsRef = useRef(null);
  const selectedSourceRef = useRef(null);
  const millicastViewRef = useRef(null);
  const sourceIdsRef = useRef([]);
  const netInfo = useNetInfo();
  const [isReconnectionScheduled, setIsReconnectionScheduled] = useState<boolean>(false);

  selectedSourceRef.current = selectedSource;
  streamsRef.current = streams;
  millicastViewRef.current = millicastView;
  sourceIdsRef.current = sourceIds;

  const [columnsNumber, setColumnsNumber] = useState(1);
  const margin = margins(columnsNumber, false);
  const labelLayout = margins(columnsNumber, true);

  const navigateToUserInputScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.UserInput }],
    });
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', navigateToUserInputScreen);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', navigateToUserInputScreen);
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('event.errorView.close', () => {
      dispatch({ type: 'viewer/setError', payload: null });
      navigateToUserInputScreen();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    playPauseVideo();

    return () => {
      subscription.remove();
      if (playingRef.current) {
        changeStateOfMediaTracks(false);
        if (millicastViewRef.current) {
          unprojectAll();
          stopStream();
        }
        dispatch({ type: 'viewer/resetAll' });
        streamsRef.current = [];
      }
    };
  }, [handleAppStateChange, stopStream]);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
  };

  const stopStream = async () => {
    if (millicastViewRef.current != null) {
      await millicastViewRef.current.stop();
    }
    resetState();
  };

  const resetState = () => {
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
    const view = new MillicastView(streamName, tokenGenerator, undefined, true);
    // Set track event handler to receive streams from Publisher.
    view.on('track', async (event) => {
      dispatch({ type: 'viewer/onTrackEvent', payload: event });
    });

    // Start connection to viewer
    try {
      view.on('broadcastEvent', async (event) => {
        // Get event name and data
        const { name, data } = event;
        let sourceId;

        switch (name) {
          case 'active':
            sourceId = data.sourceId === null || data.sourceId.length === 0 ? 'main' : data.sourceId;

            if (sourceIds?.indexOf(sourceId) === -1) {
              dispatch({
                type: 'viewer/addSourceId',
                payload: sourceId,
              });
              if (sourceId !== 'main' && sourceId !== null) {
                addRemoteTrack(sourceId);
              }
            }
            // A source has been started on the stream
            dispatch({ type: 'viewer/setError', payload: null });
            break;
          case 'inactive':
            // A source has been stopped on the steam
            sourceId = data.sourceId === null || data.sourceId.length === 0 ? 'main' : data.sourceId;
            if (sourceIdsRef.current?.indexOf(sourceId) !== -1) {
              dispatch({
                type: 'viewer/removeSourceId',
                payload: sourceId,
              });

              const streamToRemove = streamsRef.current.find((stream) => stream.sourceId === data.sourceId);
              dispatch({
                type: 'viewer/removeStream',
                payload: streamToRemove,
              });
            }
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
          default:
            console.log('Unknown event', name);
        }
      });
      await view.connect({
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
      });
      dispatch({ type: 'viewer/setMillicastView', payload: view });
      dispatch({ type: 'viewer/setError', payload: null });

      millicastViewRef.current = view;
    } catch (e) {
      console.log('Connection failed. Reason:', e);
      dispatch({ type: 'viewer/setError', payload: e });
      setIsReconnectionScheduled(true);
    }
  };

  const unprojectAll = async (url = null, mid = null) => {
    dispatch({ type: 'viewer/setSelectedSource', payload: { url, mid } });

    try {
      const listVideoMids = streamsRef.current.map((track) => track.videoMid).filter((x) => x !== '0' && x !== mid);
      await millicastViewRef.current.unproject(listVideoMids);
    } catch (error) {
      console.log('unproject error', error);
    }
  };

  useEffect(() => {
    checkOrientation();
    const subscription = Dimensions.addEventListener('change', () => {
      checkOrientation();
    });
    return () => subscription?.remove();
  }, []);
  const checkOrientation = async () => {
    setColumnsNumber(Dimensions.get('window').width > Dimensions.get('window').height ? 2 : 1);
  };

  /* eslint no-param-reassign: ["error", { "props": false }] */
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

  const reconnect = async () => {
    await subscribe();
  };

  const addRemoteTrack = async (sourceId) => {
    if (millicastViewRef.current == null) {
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
      await millicastViewRef.current.project(sourceId, [
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
    }
  };

  useEffect(() => {
    const initializeMultiview = async () => {
      try {
        await Promise.all(
          sourceIds?.map(async (sourceId) => {
            if (sourceId !== 'main') {
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

  useEffect(() => {
    if (error !== null) {
      navigation.navigate(Routes.ErrorView, { errorType: netInfo.isConnected ? 'streamOffline' : 'networkOffline' });
    } else if (currentRoute === Routes.ErrorView && error === null) {
      navigation.goBack();
    }
  }, [error]);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      dispatch({ type: 'viewer/setStreams', payload: [] });
      dispatch({
        type: 'viewer/setSelectedSource',
        payload: { url: null, mid: null },
      });
      dispatch({ type: 'viewer/setSourceIds', payload: [] });

      // Set error when there is no network connection
      dispatch({ type: 'viewer/setError', payload: 'No internet connection' });
    }
  }, [netInfo]);

  useEffect(() => {
    if (playingRef.current && sourceIdsRef.current.length === 0) {
      // Set error when there are no active sources
      dispatch({ type: 'viewer/setError', payload: 'Stream is not published' });
    }
  }, [sourceIds]);

  const RECONNECT_INTERVAL = 5000;
  useEffect(() => {
    const interval = setInterval(() => {
      if (isReconnectionScheduled) {
        setIsReconnectionScheduled(false);
        reconnect();
      }
    }, RECONNECT_INTERVAL);

    return () => clearInterval(interval);
  }, [isReconnectionScheduled]);

  return (
    <SafeAreaView style={stylesContainer.container}>
      <View
        style={{
          alignContent: 'center',
          marginBottom: 50,
        }}
      >
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
              <Pressable
                style={{ marginBottom: 15 }}
                onPress={() => {
                  dispatch({
                    type: 'viewer/setSelectedSource',
                    payload: {
                      url: item?.stream.toURL(),
                      mid: item?.videoMid,
                    },
                  });
                  navigation.navigate(Routes.SingleStreamView);
                }}
              >
                <RTCView
                  key={item?.stream.toURL() || `${item?.stream.videoMid}` || ''}
                  streamURL={item?.stream.toURL()}
                  style={{
                    width: columnsNumber === 2 ? '70%' : '100%',
                    flex: 1,
                    aspectRatio: 1,
                  }}
                />
                <Text
                  style={{
                    padding: 1,
                    position: 'absolute',
                    marginLeft: labelLayout.marginLeft,
                    bottom: labelLayout.bottom,
                    zindex: 0,
                    color: 'white',
                    backgroundColor: 'grey',
                    borderRadius: 3,
                    paddingHorizontal: 3,
                    justifyContent: 'flex-start',
                  }}
                >
                  {!item.sourceId ? 'Main' : String(item.sourceId)}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
});

function margins(columnsNumber, isLabel) {
  if (isLabel) {
    return { marginLeft: '2.5%', bottom: '25%' };
  }

  if (columnsNumber === 1) {
    return { marginTop: '-10%', marginBottom: '-25%', marginLeft: '2.5%', marginRight: '2.5%' };
  }
  return { marginTop: '-10%', marginBottom: '-10%', marginLeft: '2.5%', marginRight: '2.5%' };
}
