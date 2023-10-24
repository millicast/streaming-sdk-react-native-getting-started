import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {mediaDevices, RTCView} from 'react-native-webrtc';

// Import the required classes
import {Director, Publish} from '@millicast/sdk/dist/millicast.debug.umd';
import myStyles from '../../styles/styles.js';
import {Logger as MillicastLogger} from '@millicast/sdk';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as publisherService from '../service/publisher.js';

import {useSelector} from 'react-redux';

// Validate looger
window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

class MillicastWidget extends React.Component {
  constructor(props) {
    super(props);

    // this.millicastPublish = null;
    // this.state = {
    //   mediaStream: null,
    //   stream: null,
    //   codec: 'vp8', // va para reducer
    //   mirror: true,
    //   playing: false,
    //   audioEnabled: true,
    //   videoEnabled: true,
    //   timePlaying: 0, // in seconds
    //   userCount: 0,
    //   bitrate: 0,
    // };

    
    this.styles = myStyles;
  }
  
  componentWillUnmount() {
    this.stop();

    this.dispatch({type: 'publisher/mediaStream', mediaStream: null});
    this.dispatch({type: 'publisher/stream', stream: null});
    this.dispatch({type: 'publisher/codec'});
    this.dispatch({type: 'publisher/mirror', mirror: false});
    this.dispatch({type: 'publisher/playingMedia', playing: false});
    this.dispatch({type: 'publisher/audioEnabled', audioEnabled: true});
    this.dispatch({type: 'publisher/videoEnabled', videoEnabled: true});

    // this.setState({mediaStream: null});
    // this.setState({stream: null});
    // this.setState({codec: 'vp8'});
    // this.setState({mirror: false});
    // this.setState({playing: false});
    // this.setState({audioEnabled: true});
    // this.setState({videoEnabled: true});

    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (playing) {
        this.dispatch({type: 'timePlaying'})
      }
    }, 1000);
  }
  // componentDidMount() {
  //   this.interval = setInterval(() => {
  //     if (this.state.playing) {
  //       this.setState({timePlaying: this.state.timePlaying + 1});
  //     }
  //   }, 1000);
  // }

  // toggleCamera = () => {
  //   this.state.mediaStream.getVideoTracks().forEach(track => {
  //     track._switchCamera();
  //   });
  //   this.setState({mirror: !this.state.mirror});
  // };

  // start = async () => {
  //   if (!this.state.mediaStream) {
  //     let medias;
  //     try {
  //       medias = await mediaDevices.getUserMedia({
  //         video: this.state.videoEnabled,
  //         audio: this.state.audioEnabled,
  //       });
  //       this.setState({mediaStream: medias});
  //       this.publish(this.props.streamName, this.props.token);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  //   if (this.millicastPublish) {
  //     // State of the broadcast
  //     this.connectionState();

  //     this.millicastPublish.on('broadcastEvent', event => {
  //       const {name, data} = event;
  //       if (name === 'viewercount') {
  //         this.setState({userCount: data.viewercount});
  //       }
  //     });
  //   }
  // };

  // setCodec = value => {
  //   this.setState({
  //     codec: value,
  //   });
  // };

  // setBitrate = async value => {
  //   this.setState({
  //     bitrate: value,
  //   });
  //   await this.millicastPublish.webRTCPeer.updateBitrate(value);
  // };

  // stop = () => {
  //   if (this.state.playing) {
  //     this.millicastPublish.stop();
  //     if (this.state.mediaStream) {
  //       this.state.mediaStream.release();
  //       this.setState({
  //         mediaStream: null,
  //       });
  //     }
  //     this.setState({timePlaying: 0});
  //   }

  //   if (this.millicastPublish) {
  //     this.connectionState();
  //   }
  // };

  // connectionState = () => {
  //   // State of the broadcast
  //   this.millicastPublish.on('connectionStateChange', event => {
  //     if (
  //       event === 'connected' ||
  //       event === 'disconnected' ||
  //       event === 'closed'
  //     ) {
  //       this.setState({playing: !this.state.playing});
  //     }
  //   });
  // };

  // // async publish(streamName, token) {
  // //   const tokenGenerator = () =>
  // //     Director.getPublisher({
  // //       token,
  // //       streamName,
  // //     });

  // //   // Create a new instance
  // //   this.millicastPublish = new Publish(streamName, tokenGenerator);

  // //   this.setState({
  // //     streamURL: this.state.mediaStream,
  // //   });

  // //   // Publishing Options
  // //   const broadcastOptions = {
  // //     mediaStream: this.state.mediaStream,
  // //     codec: this.state.codec,
  // //     events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
  // //   };

  // //   // Start broadcast
  // //   try {
  // //     await this.millicastPublish.connect(broadcastOptions);
  // //   } catch (e) {
  // //     console.log('Connection failed, handle error', e);
  // //   }
  // // }

  // handleClickPlay = () => {
  //   if (!this.state.playing) {
  //     this.start();
  //   } else {
  //     this.stop();
  //   }
  // };

  // handleClickMute = () => {
  //   this.state.mediaStream.getAudioTracks().forEach(track => {
  //     track.enabled = !track.enabled;
  //   });
  //   this.setState({audioEnabled: !this.state.audioEnabled});
  // };

  // handleClickDisableVideo = () => {
  //   this.state.mediaStream.getVideoTracks().forEach(track => {
  //     track.enabled = !track.enabled;
  //   });
  //   this.setState({videoEnabled: !this.state.videoEnabled});
  // };

  // showTimePlaying = () => {
  //   let time = this.state.timePlaying;

  //   let seconds = '' + (time % 60);
  //   let minutes = '' + (Math.floor(time / 60) % 60);
  //   let hours = '' + Math.floor(time / 3600);

  //   if (seconds < 10) {
  //     seconds = '0' + seconds;
  //   }
  //   if (minutes < 10) {
  //     minutes = '0' + minutes;
  //   }
  //   if (hours < 10) {
  //     hours = '0' + hours;
  //   }

  //   return hours + ':' + minutes + ':' + seconds;
  // };

  render() {
    return (
      <SafeAreaView style={styles.body}>
        {this.state.mediaStream ? (
          <RTCView
            streamURL={this.state.mediaStream.toURL()}
            style={this.styles.video}
            objectFit="contain"
            mirror={this.state.mirror}
          />
        ) : null}

        <View style={myStyles.topViewerCount}>
          <Text style={myStyles.textShadow}>{`${this.state.userCount}`}</Text>
        </View>

        <Text style={[myStyles.bottomBarTimePlaying, myStyles.textShadow]}>
          {this.state.playing ? `${publisherService.showTimePlaying()}` : ''}
        </Text>

        <View style={myStyles.bottomMultimediaContainer}>
          <View style={myStyles.bottomIconWrapper}>
            <TouchableOpacity onPress={publisherService.handleClickPlay}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {!this.state.playing ? 'Play' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={publisherService.handleClickMute}>
              <Text>
                {!!this.state.playing &&
                  (this.state.audioEnabled ? (
                    <Text> Mic On </Text>
                  ) : (
                    <Text> Mic Off </Text>
                  ))}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={publisherService.handleClickDisableVideo}>
              <Text>
                {!!this.state.playing &&
                  (!this.state.videoEnabled ? (
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
}

function PublisherMain(navigation) {
  return (
    <>
      <SafeAreaView style={styles.body}>
        <MillicastWidget {...navigation} />
      </SafeAreaView>
    </>
  );
}

const PublisherStack = createNativeStackNavigator();

export default function App(props) {

  const count = useSelector(state => state.count);
  const millicastPublish = useSelector(state => state.millicastPublish);
  const mediaStream = useSelector(state => state.mediaStream);
  const stream = useSelector(state => state.stream);
  const codec = useSelector(state => state.codec);
  const mirror = useSelector(state => state.mirror);
  const playing = useSelector(state => state.playingMedia);
  const audioEnabled = useSelector(state => state.audioEnabled);
  const videoEnabled = useSelector(state => state.videoEnabled);
  const timePlaying = useSelector(state => state.timePlaying);
  const userCount = useSelector(state => state.userCount);
  const bitrate = useSelector(state => state.bitrate);

  const dispatch = useDispatch();

  return (
    <PublisherStack.Navigator screenOptions={{headerShown: false}}>
      <PublisherStack.Screen
        name="Publisher Main"
        component={PublisherMain}
      />
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
