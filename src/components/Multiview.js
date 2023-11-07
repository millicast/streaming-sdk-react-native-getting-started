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
import myStyles from '../../styles/styles.js';

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

  componentWillUnmount() {}

  render() {
    return (
      <>
        <Text style={{color: 'white'}}>I'm not broken</Text>
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
