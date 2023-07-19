// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import { RTCView } from 'react-native-webrtc';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Director, View as MillicastView } from '@millicast/sdk/dist/millicast.debug.umd'
import myStyles from './styles.js'
// import { Ionicons } from 'react-native-vector-icons';

import { Logger as MillicastLogger } from '@millicast/sdk'

var streamName = '...'
var accountId = '...'

window.Logger = MillicastLogger

Logger.setLevel(MillicastLogger.DEBUG);

class MillicastWidget extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      streams: [],
      sourceIds: ['main'],
      activeLayers: [],
      multiView: false,
      playing: false,
      muted: false,
      millicastView: null,
      setMedia: true,
      userCount: 0,
      selectedSource: null
    }

    this.styles = myStyles
  }

  componentWillUnmount() {
    if (!this.state.setMedia) {
      this.stopStream();
      this.setState({
        setMedia: true
      })
    }
  }

  async subscribe(streamName, accountID) {
    const tokenGenerator = () => Director.getSubscriber({
      streamName: streamName,
      streamAccountId: accountID
    })
    // Create a new instance
    let view = new MillicastView(streamName, tokenGenerator, null);
    // Set track event handler to receive streams from Publisher.
    view.on('track', async (event) => {
      const mediaStream = event.streams[0] ? event.streams[0] : null
      if (!mediaStream) return null
      const streams = [...this.state.streams]
      if (event.track.kind == 'audio') {
        await Promise.all(streams.map((stream) => {
          if (stream.stream.toURL() == event.streams[0].toURL()) {
            stream.audioMid = event.transceiver.mid
          }
        }))
      } else {
        streams.push({ stream: mediaStream, videoMid: event.transceiver.mid })
      }
      this.setState({
        streams: [...streams]
      })
    })

    //Start connection to viewer
    try {
      view.on("broadcastEvent", async (event) => {
        //Get event name and data
        const { name, data } = event;
        switch (name) {
          case "active":
            this.setState({
              ...((this.state.sourceIds.indexOf(data.sourceId) === -1 && data.sourceId != null) && {
                sourceIds: [...this.state.sourceIds, data.sourceId],
              })
            })
            //A source has been started on the steam
            break;
          case "inactive":
            //A source has been stopped on the steam
            break;
          case "vad":
            //A new source was multiplexed over the vad tracks
            break;
          case "layers":
            this.setState({
              activeLayers: data.medias["0"].active
            })
            //Updated layer information for each simulcast/svc video track
            break;
        }

      });
      await view.connect({ events: ["active", "inactive", "vad", "layers", "viewercount"] })

      // view.on('broadcastEvent', (event) => {
      //   const { name, data } = event
      //   if (name === 'viewercount') {
      //     this.setState({ userCount: data.viewercount })
      //   }
      // })

      this.setState({
        millicastView: view
      });
    } catch (e) {
      console.error('Connection failed. Reason:', e)
    }
  }

  stopStream = async () => {
    await this.state.millicastView.stop();
    this.setState();
  }

  addRemoteTrack = async (sourceId) => {
    const mediaStream = new MediaStream()
    const transceiver = await this.state.millicastView.addRemoteTrack('video', [mediaStream])
    const mediaId = transceiver.mid;
    await this.state.millicastView.project(sourceId, [{
      media: 'video',
      mediaId,
      trackId: 'video'
    }])
    this.setState({
      streams: [...this.state.streams, { stream: mediaStream, videoMid: mediaId }],
    })
  }

  changeStateOfMediaTracks(streams, value) {
    streams.map(s => (
      s.stream.getTracks().forEach(videoTrack => {
        videoTrack.enabled = value;
      })
    ))
    this.setState({
      playing: value
    })
  }

  playPauseVideo = async () => {
    if (this.state.setMedia) {
      console.log('Stream Name:', streamName);

      this.subscribe(streamName, accountId);
      this.setState({
        setMedia: false
      })
    }
    let isPaused = !this.state.playing;
    if (isPaused) {
      this.changeStateOfMediaTracks(this.state.streams, isPaused);
    } else {
      this.changeStateOfMediaTracks(this.state.streams, isPaused)
    }
  }

  changeStateOfAudioTracks(streams, value) {
    streams.map(s => (
      s.stream.getTracks().forEach(track => {
        if (track.kind == "audio") {
          track.enabled = value;
        }
      })
    ))
    this.setState({
      muted: !value
    })
  }

  muteAudio = async () => {
    let isPaused = this.state.muted;
    if (!isPaused) {
      this.changeStateOfAudioTracks(this.state.streams, isPaused);
    } else {
      this.changeStateOfAudioTracks(this.state.streams, isPaused);
    }
    isPaused = !isPaused;
  }

  project = async (sourceId, videoMid, audioMid) => {
    if (sourceId == 'main') {
      sourceId = null
    }
    this.state.millicastView.project(sourceId, [{
      media: 'video',
      mediaId: videoMid,
      trackId: 'video'
    }])
    if (audioMid) {
      this.state.millicastView.project(sourceId, [{
        media: 'audio',
        mediaId: this.state.streams[0].audioMid,
        trackId: 'audio'
      }])
    }
  }

  select = async (id) => {
    this.state.millicastView.select({ encodingId: id })
  }

  multiView = async () => {
    const sourceIds = this.state.sourceIds
    if (!this.state.multiView) {
      await Promise.all(sourceIds.map(async (sourceId) => {
        if (sourceId != 'main') {
          this.addRemoteTrack(sourceId)
        }
      }))
      this.setState({ streams: [this.state.streams[0]] })
    } else {
      this.setState({
        streams: [...[this.state.streams[0]]]
      })
    }
    this.setState({
      multiView: !this.state.multiView
    })
  }

  render() {
    return (
      <>
        {
          this.state.multiView ?
            // multiview
            this.state.streams.map((stream, index) => {
              return (
                <View key={stream.videoMid}
                  style={{
                    flexDirection: 'row',
                    // padding: '5%',
                    // justifyContent: 'space-around',
                    flex: 1,
                    // alignSelf: 'stretch',
                    // flexWrap: 'wrap'
                  }}>
                  <View>
                    <TouchableOpacity
                      hasTVPreferredFocus
                      onPress={() => {
                        this.setState({ selectedSource: stream.stream.toURL() })
                        this.setState({ multiView: !this.state.multiView })
                      }}>
                      <Text style={{ color: 'black' }}>{stream.videoMid === '0' ? 'Main' : String(this.state.sourceIds[index])}</Text>
                    </TouchableOpacity>
                  </View>
                  <RTCView
                    key={stream.stream.toURL() + stream.videoMid}
                    streamURL={stream.stream.toURL()}
                    style={{ flex: 1, position: 'relative' }}
                    objectFit='contain' />
                </View>
              )
            })
            :
            // main/selected source
            this.state.streams[0]
              ?
              < RTCView key={this.state.selectedSource ?? 'main'}
                streamURL={this.state.selectedSource ?? this.state.streams[0].stream.toURL()}
                style={this.styles.video}
                objectFit='contain' />
              :
              <Text style={{ color: 'black' }}>Press the 'play' button, or the 'multiview' button.</Text>
        }
        {<View style={myStyles.bottomMultimediaContainer}>
          <View style={myStyles.bottomIconWrapper}>
            <TouchableOpacity
              hasTVPreferredFocus
              tvParallaxProperties={{ magnification: 1.2 }}
              onPress={this.playPauseVideo} >
              <Text style={{ color: 'black' }}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.multiView} >
              <Text style={{ color: 'black' }}>Multiview</Text>
            </TouchableOpacity>
          </View>
        </View>

/* 
        <View style={myStyles.topViewerCount}>
          <Ionicons name="ios-person" size={30} color="#7f00b2" />
          <Text style={{ fontWeight: 'bold' }}>{`${this.state.userCount}`}</Text>
        </View>

        <View style={myStyles.bottomMultimediaContainer}>
          <View style={myStyles.bottomIconWrapper}>
            <TouchableOpacity onPress={this.playPauseVideo} >
              <Text>{!this.state.playing ? <Ionicons name="play" size={30} color="#7f00b2" /> : <Ionicons name="pause" size={30} color="#7f00b2" />}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.muteAudio} >
              <Text >{!this.state.muted ? <Ionicons name="md-volume-high" size={30} color="#7f00b2" /> : <Ionicons name="md-volume-mute" size={30} color="#7f00b2" />}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.multiView} >
              <Text>{this.state.multiView ? <Ionicons name="chevron-back" size={30} color="#7f00b2" /> : <Ionicons name="md-images" size={30} color="#7f00b2" />}</Text>
            </TouchableOpacity>
          </View>
          <View>
            {this.state.activeLayers.map(layer => {
              return (<Button sytle={{ justifyContent: 'flex-start' }} key={layer.id} title={layer.bitrate.toString()} onPress={() => this.select(layer.id)} />)
            })
            }
          </View>
        </View> */}
      </>
    );
  }
};

export default function App() {
  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
        {/* <StatusBar style="auto" /> */}
        <MillicastWidget streamName={streamName} accountID={accountId} />
      </SafeAreaView>
    </>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    // backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill
  },
});
