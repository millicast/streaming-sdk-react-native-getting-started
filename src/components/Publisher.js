import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RTCView} from 'react-native-webrtc';

import myStyles from '../../styles/styles.js';
import {Logger as MillicastLogger} from '@millicast/sdk';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import * as publisherService from '../service/publisher.js';

import {mediaDevices} from 'react-native-webrtc';
import {Director, Publish} from '@millicast/sdk/dist/millicast.debug.umd';

import {useDispatch, useSelector} from 'react-redux';

const streamName = 'StreamTest';
const publishingToken = 'a7f38f42d4d60635646a27988fdd1e57089398cd8c92f382f833435d487a346d';

window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

function MillicastWidget(props) {
  const [intervalId, setIntervalId] = useState(null);
  const mediaStream = useSelector(state => state.publisherReducer.mediaStream);
  const playing = useSelector(state => state.publisherReducer.playing);
  const videoEnabled = useSelector(state => state.publisherReducer.videoEnabled);
  const audioEnabled = useSelector(state => state.publisherReducer.audioEnabled);
  const codec = useSelector(state => state.publisherReducer.codec);
  const mirror = useSelector(state => state.publisherReducer.mirror);
  const userCount = useSelector(state => state.publisherReducer.userCount);
  const timePlaying = useSelector(state => state.publisherReducer.timePlaying);
  const dispatch = useDispatch();

  useEffect(() => {
    const startInterval = () => {
      const newIntervalId = setInterval(() => {
        if (playing) {
          dispatch({type: 'timePlaying'});
        }
      }, 1000);
      setIntervalId(newIntervalId);
    };

    startInterval();

    return () => {
      clearInterval(intervalId);
      clearInterval(this.interval);
    };
  }, [playing]);

  const toggleCamera = () => {
    mediaStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
    this.setState({mirror: !mirror});
  };

  const setMediaStream = (mediaStream) => ({
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
        // this.setState({mediaStream: medias});
        console.log('medias ', medias);
        dispatch(setMediaStream(medias));

        publish(
          streamName,
          publishingToken,
        );
      } catch (e) {
        console.error(e);
      }
    }

    if (this.millicastPublish) {
      // State of the broadcast
      this.connectionState();

      this.millicastPublish.on('broadcastEvent', event => {
        const {name, data} = event;
        if (name === 'viewercount') {
          // this.setState({userCount: data.viewercount});
          // this.props.dispatch({
          //   type: 'publisher/userCount',
          //   userCount: data.viewercount,
          // });
        }
      });
    }
  };

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

  const stop = () => {
    if (playing) {
      millicastPublish.stop();
      if (mediaStream) {
        mediaStream.release();
        dispatch({type: 'publisher/mediaStream', mediaStream: null});
      }
      // store.dispatch({type: 'publisher/timePlaying', timePlaying: 0});
    }

    if (millicastPublish) {
      connectionState();
    }
  };

  const connectionState = () => {
    // State of the broadcast
    millicastPublish.on('connectionStateChange', event => {
      if (
        event === 'connected' ||
        event === 'disconnected' ||
        event === 'closed'
      ) {
        // this.setState({playing: !this.state.playing});
        // props.dispatch({
        //   type: 'publisher/playing',
        //   playing: !publisherStore.playing,
        // });
        console.log('playing???');
      }
    });
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

    // Create a new instance
    let millicastPublish = new Publish(streamName, tokenGenerator);

    millicastPublish.connect(broadcastOptions);

    dispatch({
      type: 'publisher/streamURL',
      streamURL: mediaStream,
    });
    console.log('mediaStream, ', mediaStream);
    // Publishing Options

    // Start broadcast
    try {
      await millicastPublish.connect(broadcastOptions);
    } catch (e) {
      console.log('Connection failed, handle error', e);
    }
  };

  const handleClickPlay = () => {
    if (!playing) {
      console.log('handle click play');
      start();
    } else {
      console.log('hello');
      stop();
    }
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
          style={styles.video} // Define the 'styles.video' style
          objectFit="contain"
          mirror={mirror}
        />
      ) : null}
      <View style={myStyles.topViewerCount}>
        <Text
          style={
            myStyles.textShadow
          }>{`${userCount}`}</Text>
      </View>
      <View style={myStyles.bottomMultimediaContainer}>
        <View style={myStyles.bottomIconWrapper}>
          <TouchableOpacity onPress={handleClickPlay}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {!playing ? 'Play' : 'Pause'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClickMute}>
            <Text>
              {playing &&
                (audioEnabled ? (
                  <Text> Mic On </Text>
                ) : (
                  <Text> Mic Off </Text>
                ))}
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
}

export const PublisherMain = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.body}>
      <MillicastWidget navigation={navigation} />
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
