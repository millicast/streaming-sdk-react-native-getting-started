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
  const dispatch = useDispatch();

  useEffect(() => {
    const startInterval = () => {
      const newIntervalId = setInterval(() => {
        if (props.publisherStore.playing) {
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
  }, [props.publisherStore.playing, props.publisherStore]);

  const toggleCamera = () => {
    this.state.mediaStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
    this.setState({mirror: !this.state.mirror});
  };

  const setMediaStream = (mediaStream) => ({
    type: 'publisher/mediaStream',
    mediaStream,
  });

  const start = async () => {
    if (!props.mediaStream) {
      let medias;
      try {
        medias = await mediaDevices.getUserMedia({
          video: props.publisherStore.videoEnabled,
          audio: props.publisherStore.audioEnabled,
        });
        // this.setState({mediaStream: medias});
        console.log('medias ', medias);
        dispatch(setMediaStream(medias));
        console.log('store: ', props.publisherStore);

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
    if (props.publisherStore.playing) {
      millicastPublish.stop();
      if (props.publisherStore.mediaStream) {
        props.publisherStore.mediaStream.release();
        props.dispatch({type: 'publisher/mediaStream', mediaStream: null});
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
        mediaStream: props.publisherStore.mediaStream,
        codec: props.publisherStore.codec,
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
      };

    // Create a new instance
    let millicastPublish = new Publish(streamName, tokenGenerator);

    millicastPublish.connect(broadcastOptions);

    props.dispatch({
      type: 'publisher/streamURL',
      streamURL: props.publisherStore.mediaStream,
    });
    console.log('mediaStream, ', props.publisherStore.mediaStream);
    // Publishing Options

    // Start broadcast
    try {
      await millicastPublish.connect(broadcastOptions);
    } catch (e) {
      console.log('Connection failed, handle error', e);
    }
  };

  const handleClickPlay = () => {
    if (!props.publisherStore.playing) {
      console.log('handle click play');
      start();
    } else {
      console.log('hello');
      stop();
    }
  };

  const handleClickMute = () => {
    props.publisherStore.mediaStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    store.dispatch({
      type: 'publisher/audioEnabled',
      audioEnabled: !this.props.publisherStore.audioEnabled,
    });
  };

  const handleClickDisableVideo = () => {
    publisherStore.mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    store.dispatch({
      type: 'publisher/videoEnabled',
      videoEnabled: !this.props.publisherStore.videoEnabled,
    });
  };

  const showTimePlaying = () => {
    let time = this.props.publisherStore.timePlaying;

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
      {props.publisherStore.mediaStream ? (
        <RTCView
          streamURL={props.publisherStore.mediaStream.toURL()}
          style={styles.video} // Define the 'styles.video' style
          objectFit="contain"
          mirror={props.publisherStore.mirror}
        />
      ) : null}
      <View style={myStyles.topViewerCount}>
        <Text
          style={
            myStyles.textShadow
          }>{`${props.publisherStore.userCount}`}</Text>
      </View>
      <View style={myStyles.bottomMultimediaContainer}>
        <View style={myStyles.bottomIconWrapper}>
          <TouchableOpacity onPress={handleClickPlay}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {!props.publisherStore.playing ? 'Play' : 'Pause'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClickMute}>
            <Text>
              {props.publisherStore.playing &&
                (props.publisherStore.audioEnabled ? (
                  <Text> Mic On </Text>
                ) : (
                  <Text> Mic Off </Text>
                ))}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClickDisableVideo}>
            <Text>
              {props.publisherStore.playing &&
                (!props.publisherStore.videoEnabled ? (
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
  // const publisherStore = useSelector(state => state.publisherReducer);
  const mediaStream = useSelector(state => state.publisherReducer.mediaStream);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.body}>
      <MillicastWidget navigation={navigation} publisherStore={publisherStore} mediaStream={mediaStream} dispatch={dispatch} />
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
