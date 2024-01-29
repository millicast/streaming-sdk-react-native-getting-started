import { Director, View as MillicastView, Logger as MillicastLogger } from '@millicast/sdk';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  Platform,
  AppState,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

import ErrorView from '../../components/errorview/ErrorView';
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
        switch (name) {
          case 'active':
            if (sourceIds?.indexOf(data.sourceId) === -1 && data.sourceId != null) {
              dispatch({
                type: 'viewer/addSourceId',
                payload: data.sourceId,
              });
              if (data.sourceId !== 'main' && data.sourceId !== null) {
                addRemoteTrack(data.sourceId);
              }
            }
            // A source has been started on the steam
            break;
          case 'inactive':
            console.log('inactive');
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
        {error && (
          <ErrorView
            errorType="streamOffline"
            onClose={() => {
              navigation.navigate(Routes.UserInput);
            }}
          />
        )}
        {!error && (
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
                    key={item?.stream.toURL() || `${item?.stream.videoMid}` || ''}
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
                    onPress={() => undefined}
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
        )}
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
  if (Platform.isTV && Platform.OS === 'ios') {
    return { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 };
  }

  if (isLabel) {
    return { marginLeft: '2.5%', bottom: '25%' };
  }

  if (columnsNumber === 1) {
    return { marginTop: '-10%', marginBottom: '-25%', marginLeft: '2.5%', marginRight: '2.5%' };
  }
  return { marginTop: '-10%', marginBottom: '-10%', marginLeft: '2.5%', marginRight: '2.5%' };
}
