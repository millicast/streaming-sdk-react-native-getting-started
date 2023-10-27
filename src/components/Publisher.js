import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import {RTCView} from 'react-native-webrtc';

// Import the required classes
import myStyles from '../../styles/styles.js';
import {Logger as MillicastLogger} from '@millicast/sdk';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import * as publisherService from '../service/publisher.js';

import {mediaDevices} from 'react-native-webrtc';
import {Director, Publish} from '@millicast/sdk/dist/millicast.debug.umd';

import {useDispatch, useSelector} from 'react-redux';

// Validate looger
window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

class MillicastWidget extends React.Component {
  constructor(props) {
    super(props);
    this.styles = myStyles;
  }

  componentWillUnmount() {
    this.stop();

    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.props.publisherStore.playing) {
        this.props.dispatch({type: 'timePlaying'});
      }
    }, 1000);
  }

  toggleCamera = () => {
    this.state.mediaStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
    this.setState({mirror: !this.state.mirror});
  };

  start = async () => {
    if (!this.props.publisherStore.mediaStream) {
      let medias;
      try {
        medias = await mediaDevices.getUserMedia({
          video: this.props.publisherStore.videoEnabled,
          audio: this.props.publisherStore.audioEnabled,
        });
        // this.setState({mediaStream: medias});
        this.props.dispatch({type: 'publisher/mediaStream', medias: 'medias'});

        this.publish(
          this.props.publisherStore.streamName,
          this.props.publisherStore.token,
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
          this.props.dispatch({
            type: 'publisher/userCount',
            userCount: data.viewercount,
          });
        }
      });
    }
  };

  setCodec = value => {
    this.setState({
      codec: value,
    });
  };

  setBitrate = async value => {
    this.setState({
      bitrate: value,
    });
    await this.millicastPublish.webRTCPeer.updateBitrate(value);
  };

  stop = () => {
    if (this.props.publisherStore.playing) {
      this.millicastPublish.stop();
      if (this.props.publisherStore.mediaStream) {
        this.props.publisherStore.mediaStream.release();
        // this.setState({
        //   mediaStream: null,
        // });
        this.props.dispatch({type: 'publisher/mediaStream', mediaStream: null});
      }
      // this.setState({timePlaying: 0});
      store.dispatch({type: 'publisher/timePlaying', timePlaying: 0});
    }

    if (this.millicastPublish) {
      this.connectionState();
    }
  };

  connectionState = () => {
    // State of the broadcast
    this.millicastPublish.on('connectionStateChange', event => {
      if (
        event === 'connected' ||
        event === 'disconnected' ||
        event === 'closed'
      ) {
        // this.setState({playing: !this.state.playing});
        this.props.dispatch({
          type: 'publisher/playing',
          playing: !publisherStore.playing,
        });
        console.log('playing???');
      }
    });
  };

  publish = async (streamName, token) => {
    const tokenGenerator = () =>
      Director.getPublisher({
        token: token,
        streamName: streamName,
      });
    console.log('maybe connecting');

    // Create a new instance
    let millicastPublish = new Publish(streamName, tokenGenerator);

    millicastPublish.connect(broadcastOptions);
    console.log('maybe connecting');

    // this.setState({
    //   streamURL: this.state.mediaStream,
    // });
    this.props.dispatch({
      type: 'publisher/streamURL',
      streamURL: publisherStore.mediaStream,
    });

    // Publishing Options
    const broadcastOptions = {
      mediaStream: this.props.publisherStore.mediaStream,
      codec: this.props.publisherStore.codec,
      events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
    };

    // Start broadcast
    try {
      await this.millicastPublish.connect(broadcastOptions);
    } catch (e) {
      console.log('Connection failed, handle error', e);
    }
  };

  handleClickPlay = () => {
    if (!this.props.publisherStore.playing) {
      console.log('handle click play');
      this.start();
    } else {
      console.log('hello');
      this.stop();
    }
  };

  handleClickMute = () => {
    this.props.publisherStore.mediaStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    // this.setState({audioEnabled: !this.state.audioEnabled});
    store.dispatch({
      type: 'publisher/audioEnabled',
      audioEnabled: !this.props.publisherStore.audioEnabled,
    });
  };

  handleClickDisableVideo = () => {
    publisherStore.mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    // this.setState({videoEnabled: !this.state.videoEnabled});
    store.dispatch({
      type: 'publisher/videoEnabled',
      videoEnabled: !this.props.publisherStore.videoEnabled,
    });
  };

  showTimePlaying = () => {
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

  render() {
    const navigation = this.props.navigation;
    const publisherStore = this.props.publisherStore;

    return (
      <SafeAreaView style={styles.body}>
        {publisherStore.mediaStream ? (
          <RTCView
            streamURL={publisherStore.mediaStream.toURL()}
            style={this.styles.video}
            objectFit="contain"
            mirror={publisherStore.mirror}
          />
        ) : null}

        <View style={myStyles.topViewerCount}>
          <Text
            style={myStyles.textShadow}>{`${publisherStore.userCount}`}</Text>
        </View>

        {/* <Text style={[myStyles.bottomBarTimePlaying, myStyles.textShadow]}>
          {playing ? `${publisherService.showTimePlaying()}` : ''}
        </Text> */}

        <View style={myStyles.bottomMultimediaContainer}>
          <View style={myStyles.bottomIconWrapper}>
            <TouchableOpacity onPress={this.handleClickPlay}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {!publisherStore.playing ? 'Play' : 'Pause'}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={publisherService.handleClickMute}>
              <Text>
                {playing &&
                  (this.state.audioEnabled ? (
                    <Text> Mic On </Text>
                  ) : (
                    <Text> Mic Off </Text>
                  ))}
              </Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={publisherService.handleClickDisableVideo}>
              <Text>
                {playing &&
                  (!videoEnabled ? (
                    <Text> Camera On </Text>
                  ) : (
                    <Text> Camera Off </Text>
                  ))}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

function PublisherMain(navigation) {
  const publisherStore = useSelector(state => state.publisherReducer);
  const dispatch = useDispatch();
  return (
    <>
      <SafeAreaView style={styles.body}>
        <MillicastWidget
          {...{navigation: navigation, publisherStore: publisherStore}}
          //   navigation={navigation}
          //   publisherStore={publisherStore}
          //   dispatch={dispatch}
          //
        />
      </SafeAreaView>
    </>
  );
}

const PublisherStack = createNativeStackNavigator();

export default function App(props) {
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
