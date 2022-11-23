import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { RTCView } from 'react-native-webrtc';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Director, View as MillicastView } from '@millicast/sdk/dist/millicast.debug.umd'

import myStyles from './styles.js'
// import RTCRtpHeaderExtension from 'react-native-webrtc/lib/typescript/RTCRtpHeaderExtension.js';
const streamName = process.env.MILLICAST_STREAM_NAME;
const accountId = process.env.MILLICAST_ACCOUNT_ID;

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
      millicastView: null
    }

    this.styles = myStyles
  }

  componentDidMount() {
    this.subscribe(streamName, accountId);
  }

  componentWillUnmount() {
    this.stopStream();
  }

  async subscribe(streamName, accountID) {
    const tokenGenerator = () => Director.getSubscriber({
      streamName: streamName,
      streamAccountId: accountID
    })
    let view = new MillicastView(streamName, tokenGenerator, null);
    //Create a new instance
    //Set track event handler to receive streams from Publisher.
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
      console.log(JSON.stringify(this.state.streams));
    })

    //Start connection to viewer
    try {
      view.on("broadcastEvent", async (event) => {
        //Get event name and data
        const { name, data } = event;
        switch (name) {
          case "active":
            console.log(JSON.stringify(data));
            this.setState({
              ...((this.state.sourceIds.indexOf(data.sourceId) === -1 && data.sourceId != null) && {
                sourceIds: [...this.state.sourceIds, data.sourceId],
              })
            })
            //A source has been started on the steam
            break;
          case "inactive":
            console.log(JSON.stringify(data));
            //A source has been stopped on the steam
            break;
          case "vad":
            console.log(JSON.stringify(data));
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
      await view.connect({ events: ["active", "inactive", "vad", "layers"] })
      this.setState({
        millicastView : view
      });
    } catch (e) {
      console.error('Connection failed. Reason:', e)
    }
  }

  stopStream = async () => {
    await this.state.millicastView.stop();
    this.setState();
  }

  // reconnect = async () => {
  //   await this.millicastView.stop()
  //   await this.subscribe(this.props.streamName, this.props.accountID)
  //   this.setState()
  // }

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
    console.log(JSON.stringify(this.state.streams));
  }

  changeStateOfMediaTracks(streams, value) {
    streams.map(s => (
      s.stream.getVideoTracks().forEach(videoTrack => { 
        videoTrack.enabled = value;
      })
    ))
    this.setState({
      playing: !value
    })
  }

  playPauseVideo = async () => {
    let isPaused = this.state.playing;
    if (!isPaused) {
      this.changeStateOfMediaTracks(this.state.streams, isPaused);
    } else {
      this.changeStateOfMediaTracks(this.state.streams, isPaused)
    }
    isPaused = !isPaused;
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
    console.log(JSON.stringify(sourceIds));
    if (!this.state.multiView) {
      await Promise.all(sourceIds.map(async (sourceId) => {
        if (sourceId != 'main') {
          this.addRemoteTrack(sourceId)
        }
      }))
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
          this.state.multiView == true ?
            this.state.streams.map((stream) => {
              return (
                <View key={stream.videoMid} style={{ flexDirection: 'row', padding: 50, alignContent: 'center' }}>
                  <View>
                    {this.state.sourceIds.map((sourceId, index) => {
                      return (
                        <Button key={sourceId + index} title={sourceId} onPress={() => this.project(sourceId, stream.videoMid)} />
                      )
                    })
                    }
                  </View>
                  <RTCView key={stream.stream.toURL() + stream.videoMid} streamURL={stream.stream.toURL()} style={this.styles.video} objectFit='contain' />
                </View>
              )
            })
            :
            this.state.streams[0] ? < RTCView key={'main'} streamURL={this.state.streams[0].stream.toURL()} style={this.styles.video} objectFit='contain' /> : null
        }
        
        <View style={myStyles.footer}>
          <Button style={myStyles.button} title={ !this.state.playing ? "Play" : "Pause" } onPress={this.playPauseVideo} />
          <Button style={myStyles.footer} title={ !this.state.muted ? "Mute" : "Unmute" } onPress={this.muteAudio} />
          <Button style={myStyles.footer} title='Multi view' onPress={this.multiView} />
          <View>
            {this.state.activeLayers.map(layer => {
              return (<Button sytle={{ justifyContent: 'flex-start' }} key={layer.id} title={layer.bitrate.toString()} onPress={() => this.select(layer.id)} />)
            })
            }
          </View>
        </View>
      </>
    );
  }
};

export default function App() {
  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
        <StatusBar style="auto" />
        <MillicastWidget streamName={streamName} accountID={accountId} />
      </SafeAreaView>
    </>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill
  },
});
