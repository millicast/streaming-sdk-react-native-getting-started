/* eslint-disable */
import { Director, View as MillicastView, Logger as MillicastLogger } from '@millicast/sdk';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableHighlight, AppState } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

import { StreamStatusIndicator } from './StreamStatusIndicator/StreamStatusIndicator';
import { StreamOffline } from './StreamOffline/StreamOffline';
import myStyles from '../../styles/styles.js';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export const SingleView = ({ navigation }) => {
  const appState = useRef(AppState.currentState);

  const streamName = useSelector((state) => state.viewerReducer.streamName);
  const accountId = useSelector((state) => state.viewerReducer.accountId);
  const isMediaSet = useSelector((state) => state.viewerReducer.isMediaSet);
  const playing = useSelector((state) => state.viewerReducer.playing);
  const streams = useSelector((state) => state.viewerReducer.streams);
  const sourceIds = useSelector((state) => state.viewerReducer.sourceIds);
  const selectedSource = useSelector((state) => state.viewerReducer.selectedSource);
  const millicastView = useSelector((state) => state.viewerReducer.millicastView);
  const fetchStreamStats = useSelector((state) => state.viewerReducer.fetchStreamStats);
  const dispatch = useDispatch();

  const playingRef = useRef(null);
  const millicastViewRef = useRef(null);

  playingRef.current = playing;
  millicastViewRef.current = millicastView;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    playPauseVideo();
    
    return () => {
      subscription.remove();
      if (playingRef.current) {
        stopStream();
      }
    };
  }, [handleAppStateChange, stopStream]);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    if (playingRef.current) {
      stopStream();
    }
  };

  const stopStream = async () => {
    console.log('stopping stream');
    await millicastViewRef.current.stop();
    dispatch({ type: 'viewer/setPlaying', payload: false });
    dispatch({ type: 'viewer/setIsMediaSet', payload: true });
    dispatch({ type: 'viewer/setStreams', payload: [] });
    dispatch({
      type: 'viewer/setSelectedSource',
      payload: { url: null, mid: null },
    });
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
            if (sourceIds?.indexOf(data.sourceId) === -1 && data.sourceId != null) {
              dispatch({
                type: 'viewer/addSourceId',
                payload: data.sourceId,
              });
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
    } catch (e) {
      console.error('Connection failed. Reason:', e);
    }
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

  return (
      <>
        {
          // main/selected source
          streams?.[0] ? ( 
            <>
            <RTCView
              key={selectedSource.mid ?? 'main'}
              streamURL={selectedSource.url ?? streams?.[0]?.stream?.toURL()}
              style={myStyles.video}
              objectFit="none"
            />
            <StreamStatusIndicator title="LIVE" position={myStyles.indicatorPosition} />
            </>
          ):(
            <StreamOffline />
          )
        }
      </>
  );
};
