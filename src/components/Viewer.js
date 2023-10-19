import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import React from 'react';
import {RTCView} from 'react-native-webrtc';
import {
  Director,
  View as MillicastView,
} from '@millicast/sdk/dist/millicast.debug.umd';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import myStyles from '../../styles/styles.js';
import Multiview from './Multiview';

import {Logger as MillicastLogger} from '@millicast/sdk';

import {useSelector} from 'react-redux';

window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

class MillicastWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: [],
      sourceIds: ['main'],
      activeLayers: [],
      playing: false,
      muted: false,
      millicastView: null,
      setMedia: true,
      userCount: 0,
      selectedSource: null,
    };

    this.styles = myStyles;
  }

  componentWillUnmount() {
    if (!this.state.setMedia) {
      this.stopStream();
      this.setState({
        setMedia: true,
      });
    }
  }

  async subscribe(streamName, accountId) {
    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: streamName,
        streamAccountId: accountId,
      });
    // Create a new instance
    let view = new MillicastView(streamName, tokenGenerator, null);
    // Set track event handler to receive streams from Publisher.
    view.on('track', async event => {
      const mediaStream = event.streams[0] ? event.streams[0] : null;
      if (!mediaStream) return null;
      const streams = [...this.state.streams];
      if (event.track.kind == 'audio') {
        await Promise.all(
          streams.map(stream => {
            if (stream.stream.toURL() == event.streams[0].toURL()) {
              stream.audioMid = event.transceiver.mid;
            }
          }),
        );
      } else {
        streams.push({stream: mediaStream, videoMid: event.transceiver.mid});
      }
      this.setState({
        streams: [...streams],
      });
    });

    //Start connection to viewer
    try {
      view.on('broadcastEvent', async event => {
        //Get event name and data
        const {name, data} = event;
        switch (name) {
          case 'active':
            this.setState({
              ...(this.state.sourceIds.indexOf(data.sourceId) === -1 &&
                data.sourceId != null && {
                  sourceIds: [...this.state.sourceIds, data.sourceId],
                }),
            });
            //A source has been started on the steam
            break;
          case 'inactive':
            //A source has been stopped on the steam
            break;
          case 'vad':
            //A new source was multiplexed over the vad tracks
            break;
          case 'layers':
            this.setState({
              activeLayers: data.medias['0']?.active,
            });
            //Updated layer information for each simulcast/svc video track
            break;
        }
      });
      await view.connect({
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
      });

      this.setState({
        millicastView: view,
      });
    } catch (e) {
      console.error('Connection failed. Reason:', e);
    }
  }

  stopStream = async () => {
    await this.state.millicastView.stop();
    this.setState();
  };

  addRemoteTrack = async sourceId => {
    const mediaStream = new MediaStream();
    const transceiver = await this.state.millicastView.addRemoteTrack('video', [
      mediaStream,
    ]);
    const mediaId = transceiver.mid;
    await this.state.millicastView.project(sourceId, [
      {
        media: 'video',
        mediaId,
        trackId: 'video',
      },
    ]);
    this.setState({
      streams: [
        ...this.state.streams,
        {stream: mediaStream, videoMid: mediaId},
      ],
    });
  };

  changeStateOfMediaTracks(streams, value) {
    streams.map(s =>
      s.stream.getTracks().forEach(videoTrack => {
        videoTrack.enabled = value;
      }),
    );
    this.setState({
      playing: value,
    });
  }

  playPauseVideo = async () => {
    if (this.state.setMedia) {
      console.log('Stream Name:', this.props.streamName);

      this.subscribe(this.props.streamName, this.props.accountId);
      this.setState({
        setMedia: false,
      });
    }
    let isPaused = !this.state.playing;
    this.changeStateOfMediaTracks(this.state.streams, isPaused);
  };

  changeStateOfAudioTracks(streams, value) {
    streams.map(s =>
      s.stream.getTracks().forEach(track => {
        if (track.kind == 'audio') {
          track.enabled = value;
        }
      }),
    );
    this.setState({
      muted: !value,
    });
  }

  muteAudio = async () => {
    let isPaused = this.state.muted;
    this.changeStateOfAudioTracks(this.state.streams, isPaused);
    isPaused = !isPaused;
  };

  project = async (sourceId, videoMid, audioMid) => {
    if (sourceId == 'main') {
      sourceId = null;
    }
    this.state.millicastView.project(sourceId, [
      {
        media: 'video',
        mediaId: videoMid,
        trackId: 'video',
      },
    ]);
    if (audioMid) {
      this.state.millicastView.project(sourceId, [
        {
          media: 'audio',
          mediaId: this.state.streams[0].audioMid,
          trackId: 'audio',
        },
      ]);
    }
  };

  select = async id => {
    this.state.millicastView.select({encodingId: id});
  };

  multiView = async () => {
    const sourceIds = this.state.sourceIds;
    if (!this.state.multiView) {
      await Promise.all(
        sourceIds.map(async sourceId => {
          if (sourceId != 'main') {
            this.addRemoteTrack(sourceId);
          }
        }),
      );
      this.setState({streams: [this.state.streams[0]]});
    } else {
      this.setState({
        streams: [...[this.state.streams[0]]],
      });
    }
    this.setState({
      multiView: !this.state.multiView,
    });
  };

  render() {
    return (
      <>
        {
          // main/selected source
          this.state.streams[0] ? (
            <RTCView
              key={this.state.selectedSource ?? 'main'}
              streamURL={
                this.state.selectedSource ??
                this.state.streams[0].stream.toURL()
              }
              style={this.styles.video}
              objectFit="contain"
            />
          ) : (
            <View style={{padding: '5%'}}>
              <Text style={{color: 'white'}}>
                Press the 'play' button to start watching.
              </Text>
            </View>
          )
        }
        {
          <View style={myStyles.bottomMultimediaContainer}>
            <View style={myStyles.bottomIconWrapper}>
              <TouchableHighlight
                hasTVPreferredFocus
                tvParallaxProperties={{magnification: 1.5}}
                underlayColor="#AA33FF"
                onPress={this.playPauseVideo}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {this.state.playing ? 'Pause' : 'Play'}
                </Text>
              </TouchableHighlight>
              {this.state.playing ? (
                <TouchableHighlight
                  hasTVPreferredFocus
                  tvParallaxProperties={{magnification: 1.5}}
                  underlayColor="#AA33FF"
                  onPress={this.multiView}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {this.state.multiView ? 'Go back' : 'Multiview'}
                  </Text>
                </TouchableHighlight>
              ) : null}
            </View>
          </View>
        }
      </>
    );
  }
}

function ViewerMain(props) {
  return (
    <>
      <SafeAreaView style={styles.body}>
        <MillicastWidget streamName={streamName} accountId={accountId} />
      </SafeAreaView>
    </>
  );
}

const ViewerStack = createNativeStackNavigator();

export default function App({navigation, route}) {
  const streamName = useSelector(state => state.viewerReducer.streamName);
  const accountId = useSelector(state => state.viewerReducer.accountId);

  return (
    <ViewerStack.Navigator screenOptions={{headerShown: false}}>
      <ViewerStack.Screen name="Viewer Main" component={ViewerMain} />
      <ViewerStack.Screen name="Multiview" component={Multiview} />
    </ViewerStack.Navigator>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
});
