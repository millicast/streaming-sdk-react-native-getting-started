import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, SafeAreaView } from 'react-native';
import React from 'react';
import { RTCView } from 'react-native-webrtc';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Director, View as MillicastView } from '@millicast/sdk/dist/millicast.debug.umd'

class MillicastWidget extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      streamURL: [],
      sourceIds: ['main'],
      audioMid: [],
      videoMid: [],
      activeLayers: [],
      remoteMediaStream: null,
      stream: null
    }

    this.millicastView = null
    this.styles = StyleSheet.create({
      video: {
        flex: 10,
        position: 'relative',
      },
      footer: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center'
      }
    })

    this.subscribe(props.streamName, props.accountID)
  }

  async subscribe(streamName, accountID) {
    const tokenGenerator = () => Director.getSubscriber({
      streamName: streamName,
      streamAccountId: accountID
    })

    //Create a new instance
    this.millicastView = new MillicastView(streamName, tokenGenerator, null)

    //Set track event handler to receive streams from Publisher.
    this.millicastView.on('track', (event) => {
      console.log(JSON.stringify(event));
      const videoUrl = event.streams[0] ? event.streams[0].toURL() : null
      console.log('video url' + videoUrl);
      console.log(JSON.stringify(this.state));
      if (!videoUrl) return null
      this.setState({
        ...(event.track.kind == 'video' && { streamURL: [...this.state.streamURL, videoUrl] }),
        ...(event.track.kind == 'video' && { stream: event.streams[0] }),
        ...(event.track.kind == 'video' && { videoMid: [...this.state.videoMid, event.transceiver.mid] }),
        ...(event.track.kind == 'audio' && { audioMid: [...this.state.audioMid, event.transceiver.mid] }),
      })
    })

    //Start connection to viewer
    try {
      this.millicastView.on("broadcastEvent", async (event) => {
        //Get event name and data
        const { name, data } = event;
        console.log(JSON.stringify(data));
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
      await this.millicastView.connect({ events: ["active", "inactive", "vad", "layers"] })
    } catch (e) {
      console.error('Connection failed. Reason:', e)
    }
  }

  reconnect = async () => {
    await this.millicastView.stop()
    await this.subscribe(this.props.streamName, this.props.accountID)
    this.setState()
  }

  addRemoteTrack = async () => {
    const mediaStream = new MediaStream()
    console.log('CHUCHAA' + JSON.stringify(mediaStream.getTracks()));
    const transceiver = await this.millicastView.addRemoteTrack('video', [mediaStream])
    const mediaId = transceiver.mid;
    console.log('LLEGO EL MID ' + mediaId);
    await this.millicastView.project(this.state.sourceIds[this.state.streamURL.length], [{
      media: 'video',
      mediaId,
      trackId: 'video'
    }])
    console.log(JSON.stringify(mediaStream.getTracks()));
    this.setState({
      streamURL: [...this.state.streamURL, mediaStream.toURL()]
    })
  }

  project = async (sourceId, mid) => {
    if (sourceId == 'main') {
      sourceId = null
    }
    this.millicastView.project(sourceId, [{
      media: 'video',
      mediaId: mid,
      trackId: 'video'
    }])
    this.millicastView.project(sourceId, [{
      media: 'audio',
      mediaId: this.state.audioMid[0],
      trackId: 'audio'
    }])
  }

  select = async (id) => {
    this.millicastView.select({ encodingId: id })
  }


  render() {
    return (
      <>
        {this.state.streamURL.map((url, mid) => {
          if (mid >= 1) mid++
          return (
            <View key={mid} style={{ flexDirection: 'row', padding: 50, alignContent: 'center' }}>
              <View>
                {this.state.sourceIds.map((sourceId, index) => {
                  return (<Button key={sourceId + index} title={sourceId} onPress={() => this.project(sourceId, mid)} />)
                })
                }
              </View>
              <RTCView key={url + mid} streamURL={url} style={this.styles.video} objectFit='contain' />
            </View>
          )
        })
        }
        <View style={this.styles.footer}>
          <Button style={styles.footer} title='Reconnect' onPress={this.reconnect} />
          <Button style={styles.footer} title='AddRemoteTrack' onPress={this.addRemoteTrack} />
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
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <MillicastWidget streamName='' accountID='' />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill
  },
});
