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
import styles from '../../styles/styles.js';

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

export default function App({navigation, route}) {
  const streamName = useSelector(state => state.viewerReducer.streamName);
  const accountId = useSelector(state => state.viewerReducer.accountId);

  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
        <MillicastWidget streamName={streamName} accountId={accountId} />
      </SafeAreaView>
    </>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
});
