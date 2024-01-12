/* eslint-disable react-hooks/exhaustive-deps */
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AppState,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RTCView} from 'react-native-webrtc';

import myStyles from '../../styles/styles.js';
import {Logger as MillicastLogger, Director, Publish} from '@millicast/sdk';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {mediaDevices} from 'react-native-webrtc';

import {useDispatch, useSelector} from 'react-redux';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export const PublisherMain = ({navigation}) => {
  const [intervalId, setIntervalId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const mediaStream = useSelector(state => state.publisherReducer.mediaStream);
  const playing = useSelector(state => state.publisherReducer.playing);
  const videoEnabled = useSelector(
    state => state.publisherReducer.videoEnabled,
  );
  const audioEnabled = useSelector(
    state => state.publisherReducer.audioEnabled,
  );
  const codec = useSelector(state => state.publisherReducer.codec);
  const mirror = useSelector(state => state.publisherReducer.mirror);
  const userCount = useSelector(state => state.publisherReducer.userCount);
  const timePlaying = useSelector(state => state.publisherReducer.timePlaying);
  const streamName = useSelector(state => state.publisherReducer.streamName);
  const publishingToken = useSelector(
    state => state.publisherReducer.publishingToken,
  );
  const millicastPublish = useSelector(
    state => state.publisherReducer.millicastPublish,
  );
  const dispatch = useDispatch();

  const playingRef = useRef(null);
  const millicastPublishRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const intervalIdRef = useRef(null);

  playingRef.current = playing;
  millicastPublishRef.current = millicastPublish;
  mediaStreamRef.current = mediaStream;
  intervalIdRef.current = intervalId;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      stop();
    });

    return () => {
      subscription.remove();
      stop();
    };
  }, []);

  useEffect(() => {
    if (playing) {
      setIsConnecting(false);
      const newIntervalId = setInterval(() => {
        if (playingRef.current) {
          dispatch({type: 'publisher/timePlaying'});
        }
      }, 1000);
      setIntervalId(newIntervalId);
    }
  }, [dispatch, playing]);

  useEffect(() => {
    if (mediaStream && !playing) {
      publish(streamName, publishingToken);
    }
  }, [mediaStream, playing, publish, publishingToken, streamName]);

  useEffect(() => {
    if (millicastPublish) {
      // State of the broadcast
      connectionState();
      millicastPublish.on('broadcastEvent', event => {
        const {name, data} = event;
        if (name === 'viewercount') {
          dispatch({
            type: 'publisher/userCount',
            userCount: data.viewercount,
          });
        }
      });
    }
  }, [connectionState, dispatch, millicastPublish]);

  const setCodec = value => {
    this.setState({
      codec: value,
    });
  };

  const setBitrate = async value => {
    this.setState({
      bitrate: value,
    });
    await this.millicastPublish.webRTCPeer.updateBitrate(value);
  };

  const handleClickPlay = () => {
    if (isConnecting) {
      return;
    } else if (!playing) {
      setIsConnecting(!isConnecting);
      start();
    } else {
      stop();
    }
  };

  const setMediaStream = mediaStream => ({
    type: 'publisher/mediaStream',
    mediaStream,
  });

  const start = async () => {
    if (!mediaStream) {
      let medias;
      try {
        medias = await mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        });
        dispatch(setMediaStream(medias));
      } catch (e) {
        setIsConnecting(!isConnecting);
        console.error(e);
      }
    }
  };

  const publish = async (streamName, token) => {
    const tokenGenerator = () =>
      Director.getPublisher({
        token: token,
        streamName: streamName,
      });

    const broadcastOptions = {
      mediaStream: mediaStream,
      codec: codec,
      events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
    };

    let millicastPublish = new Publish(streamName, tokenGenerator);

    dispatch({
      type: 'publisher/streamURL',
      streamURL: mediaStream,
    });

    try {
      await millicastPublish.connect(broadcastOptions);
      dispatch({type: 'publisher/publish', millicastPublish});
    } catch (e) {
      setIsConnecting(!isConnecting);
      console.log('Connection failed, handle error', e);
    }
  };

  const stop = () => {
    if (playingRef.current) {
      millicastPublishRef.current.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.release();
        dispatch({type: 'publisher/mediaStream', mediaStream: null});
      }
      dispatch({type: 'publisher/reset'});
      clearInterval(intervalIdRef.current);
    }
  };

  const connectionState = () => {
    // State of the broadcast
    millicastPublish.on('connectionStateChange', event => {
      if (event === 'connected') {
        dispatch({
          type: 'publisher/playing',
          playing: true,
        });
      } else if (event === 'disconnected' || event === 'closed') {
        dispatch({
          type: 'publisher/playing',
          playing: false,
        });
      }
    });
  };

  const handleClickMute = () => {
    mediaStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    dispatch({
      type: 'publisher/audioEnabled',
      audioEnabled: !audioEnabled,
    });
  };

  const handleClickDisableVideo = () => {
    mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    dispatch({
      type: 'publisher/videoEnabled',
      videoEnabled: !videoEnabled,
    });
  };

  const toggleCamera = () => {
    mediaStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
    dispatch({type: 'publisher/mirror', mirror: !mirror});
  };

  const showTimePlaying = () => {
    let time = timePlaying;

    let seconds = '' + (time % 60);
    let minutes = '' + (Math.floor(time / 60) % 60);
    let hours = '' + Math.floor(time / 3600);

    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }

    return hours + ':' + minutes + ':' + seconds;
  };

  return (
    <SafeAreaView style={styles.body}>
      {mediaStream ? (
        <RTCView
          streamURL={mediaStream.toURL()}
          style={myStyles.video}
          objectFit="contain"
          mirror={mirror}
        />
      ) : null}
      <View style={myStyles.topViewerCount}>
        <Text style={myStyles.textShadow}>{`${userCount}`}</Text>
      </View>
      <Text style={[myStyles.bottomBarTimePlaying, myStyles.textShadow]}>
        {playing ? `${showTimePlaying()}` : ''}
      </Text>
      <View style={myStyles.bottomMultimediaContainer}>
        <View style={myStyles.bottomIconWrapper}>
          <TouchableOpacity onPress={handleClickPlay}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {isConnecting ? 'Publishing' : !playing ? 'Play' : 'Stop'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClickMute}>
            <Text>
              {playing &&
                (audioEnabled ? <Text> Mic On </Text> : <Text> Mic Off </Text>)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClickDisableVideo}>
            <Text>
              {playing &&
                (!videoEnabled ? (
                  <Text> Camera On </Text>
                ) : (
                  <Text> Camera Off </Text>
                ))}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const PublisherStack = createNativeStackNavigator();

export default function App() {
  return (
    <PublisherStack.Navigator screenOptions={{headerShown: false}}>
      <PublisherStack.Screen name="Publisher Main" component={PublisherMain} />
    </PublisherStack.Navigator>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 0,
    margin: 0,
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
