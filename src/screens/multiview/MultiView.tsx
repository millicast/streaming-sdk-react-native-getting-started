import {
  Director,
  View as MillicastView,
  Logger as MillicastLogger,
  MediaTrackInfo,
  ViewProjectSourceMapping,
  MediaStreamSource,
} from '@millicast/sdk';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  AppState,
  Pressable,
  DeviceEventEmitter,
  BackHandler,
  Platform,
  NativeModules,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

import { RemoteTrackSource } from '../../types/RemoteTrackSource.types';
import { Routes } from '../../types/routes.types';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export const MultiView = ({ navigation }) => {
  const appState = useRef(AppState.currentState);

  const streamName = useSelector((state) => state.viewerReducer.streamName);
  const accountId = useSelector((state) => state.viewerReducer.accountId);
  const isMediaSet = useSelector((state) => state.viewerReducer.isMediaSet);
  const remoteTrackSources = useSelector((state) => state.viewerReducer.remoteTrackSources);
  const sourceIds = useSelector((state) => state.viewerReducer.sourceIds);
  const playing = useSelector((state) => state.viewerReducer.playing);
  const error = useSelector((state) => state.viewerReducer.error);
  const audioRemoteTrackSource = useSelector((state) => state.viewerReducer.audioRemoteTrackSource);
  const dispatch = useDispatch();
  const { routes, index } = navigation.getState();
  const currentRoute = routes[index].name;
  const playingRef = useRef(null);
  playingRef.current = playing;
  const remoteTrackSourcesRef = useRef(null);
  const sourceIdsRef = useRef([]);
  const netInfo = useNetInfo();
  const audioRemoteTrackSourceRef = useRef(null);
  const [isReconnectionScheduled, setIsReconnectionScheduled] = useState<boolean>(false);

  remoteTrackSourcesRef.current = remoteTrackSources;
  sourceIdsRef.current = sourceIds;
  audioRemoteTrackSourceRef.current = audioRemoteTrackSource;

  const millicastViewRef = useRef<MillicastView>();

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
        remoteTrackSourcesRef.current = [];
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
    dispatch({ type: 'viewer/resetRemoteTrackSources' });
    dispatch({
      type: 'viewer/setSelectedSource',
      payload: null,
    });
    dispatch({ type: 'viewer/setSourceIds', payload: [] });
  };

  const handleTrack = async (event: RTCTrackEvent) => {
    const {
      streams: [mediaStream],
      transceiver: { mid },
    } = event;
    const { current: viewer } = millicastViewRef;
    if (!viewer) {
      return;
    }

    if (mediaStream && mid !== null) {
      await unprojectMediaIds(viewer, [mid]);
    }
  };

  const subscribe = async () => {
    if (millicastViewRef.current?.isActive()) {
      return;
    }
    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName,
        streamAccountId: accountId,
      });

    // Create a new instance
    const view = new MillicastView(streamName, tokenGenerator, undefined, true);
    view.on('track', handleTrack);
    view.on('broadcastEvent', async (event) => {
      // Get event name and data
      const { name, data } = event;
      const { sourceId, tracks } = event.data as MediaStreamSource;
      const { current: viewer } = millicastViewRef;
      if (!viewer) {
        return;
      }

      switch (name) {
        case 'active':
          if (sourceIdsRef.current?.indexOf(sourceId) === -1) {
            dispatch({
              type: 'viewer/addSourceId',
              payload: sourceId,
            });
            const newRemoteTrackSource = await addRemoteTrack(viewer, sourceId, tracks);

            const hasProjectedAudioTrack = audioRemoteTrackSourceRef.current !== null;
            const videoMapping = newRemoteTrackSource.projectMapping.filter((mapping) => mapping.media === 'video');
            const audioMapping = newRemoteTrackSource.projectMapping.filter((mapping) => mapping.media === 'audio');
            const hasAudioMapping = audioMapping.length > 0;
            const mappingForProjection =
              !hasProjectedAudioTrack && hasAudioMapping ? [...videoMapping, ...audioMapping] : videoMapping;

            if (!hasProjectedAudioTrack && hasAudioMapping) {
              dispatch({
                type: 'viewer/addAudioRemoteTrackSource',
                payload: newRemoteTrackSource,
              });
            }
            await viewer.project(sourceId, mappingForProjection);
            dispatch({
              type: 'viewer/addRemoteTrackSource',
              payload: newRemoteTrackSource,
            });
          }
          // A source has been started on the stream
          dispatch({ type: 'viewer/setError', payload: null });
          break;
        case 'inactive':
          // A source has been stopped on the steam
          if (sourceIdsRef.current?.indexOf(sourceId) !== -1) {
            dispatch({
              type: 'viewer/removeSourceId',
              payload: sourceId,
            });

            const remoteTrackSourceToRemove = remoteTrackSourcesRef.current.find(
              (remoteTrackSource) => remoteTrackSource.sourceId === sourceId,
            );
            await unprojectFromStream(viewer, remoteTrackSourceToRemove);

            if (remoteTrackSourceToRemove === audioRemoteTrackSourceRef.current) {
              dispatch({
                type: 'viewer/removeAudioRemoteTrackSource',
              });
            }

            dispatch({
              type: 'viewer/removeRemoteTrackSource',
              payload: remoteTrackSourceToRemove,
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

    millicastViewRef.current = view;
    dispatch({ type: 'viewer/setMillicastView', payload: view });

    // Start connection to viewer
    try {
      await view.connect({
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
      });
      dispatch({ type: 'viewer/setError', payload: null });
    } catch (e) {
      dispatch({ type: 'viewer/setError', payload: e });
      setIsReconnectionScheduled(true);
    }
  };

  const unprojectAll = async () => {
    dispatch({ type: 'viewer/setSelectedSource', payload: null });

    try {
      const listVideoMids = remoteTrackSourcesRef.current.map((remoteTrackSource) => remoteTrackSource.videoMediaId);
      const listAudioMids = remoteTrackSourcesRef.current.map((remoteTrackSource) => remoteTrackSource.audioMediaId);

      await millicastViewRef.current.unproject(listVideoMids.push(...listAudioMids));
    } catch (error) {
      console.log('unproject error', error);
    }
  };

  const unprojectFromStream = async (viewer: MillicastView, source: RemoteTrackSource) => {
    const mediaIds = [];
    if (source.audioMediaId) mediaIds.push(source.audioMediaId);
    if (source.videoMediaId) mediaIds.push(source.videoMediaId);
    unprojectMediaIds(viewer, mediaIds);
  };

  const unprojectMediaIds = async (viewer: MillicastView, mediaIds: string[]) => {
    if (mediaIds.length) {
      await viewer.unproject(mediaIds);
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
    remoteTrackSourcesRef.current?.map((remoteTrackSource) =>
      remoteTrackSource.mediaStream?.getTracks().forEach((videoTrack) => {
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

  const addRemoteTrack = async (
    viewer: MillicastView,
    sourceId?: string,
    trackInfo?: MediaTrackInfo[],
  ): Promise<RemoteTrackSource> => {
    const mapping: ViewProjectSourceMapping[] = [];
    const mediaStream = new MediaStream();

    const trackAudio = trackInfo?.find(({ media }) => media === 'audio');
    const trackVideo = trackInfo?.find(({ media }) => media === 'video');

    let audioMediaId: string | undefined;
    let videoMediaId: string | undefined;

    if (trackAudio) {
      const audioTransceiver = await viewer.addRemoteTrack('audio', [mediaStream]);
      audioMediaId = audioTransceiver?.mid ?? undefined;

      if (audioMediaId) {
        mapping.push({ media: 'audio', mediaId: audioMediaId, trackId: 'audio' });
      }
    }

    if (trackVideo) {
      const videoTransceiver = await viewer.addRemoteTrack('video', [mediaStream]);
      videoMediaId = videoTransceiver?.mid ?? undefined;

      if (videoMediaId) {
        mapping.push({ media: 'video', mediaId: videoMediaId, trackId: 'video' });
      }
    }

    return {
      audioMediaId,
      mediaStream,
      projectMapping: mapping,
      quality: 'Auto',
      sourceId,
      videoMediaId,
    };
  };

  useEffect(() => {
    if (currentRoute !== Routes.ErrorView && error !== null) {
      navigation.navigate(Routes.ErrorView, { errorType: netInfo.isConnected ? 'streamOffline' : 'networkOffline' });
    } else if (currentRoute === Routes.ErrorView && error === null) {
      navigation.goBack();
    }
  }, [error]);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      dispatch({ type: 'viewer/resetRemoteTrackSources' });
      dispatch({
        type: 'viewer/setSelectedSource',
        payload: null,
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
          testID="multiViewStreamList"
          key={columnsNumber}
          data={remoteTrackSourcesRef.current}
          style={{
            textAlign: 'center',
          }}
          numColumns={columnsNumber}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item, index }) => (
            <View style={margin}>
              <Pressable
                testID={`${!item.sourceId ? 'Main' : String(item.sourceId)}SourceButton`}
                style={{ marginBottom: 15 }}
                hasTVPreferredFocus={Platform.isTV && index === 0}
                onPress={() => {
                  dispatch({
                    type: 'viewer/setSelectedSource',
                    payload: item,
                  });
                  navigation.navigate(Routes.SingleStreamView);
                }}
              >
                <RTCView
                  testID={!item.sourceId ? 'Main' : String(item.sourceId)}
                  key={item?.mediaStream.toURL() || `${item?.videoMediaId}` || ''}
                  streamURL={item?.mediaStream.toURL()}
                  style={{
                    width: columnsNumber === 2 ? '70%' : '100%',
                    flex: 1,
                    aspectRatio: 1,
                  }}
                />
                <Text
                  testID={!item.sourceId ? 'Main' : String(item.sourceId)}
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
