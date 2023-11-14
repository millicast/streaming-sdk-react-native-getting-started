import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import {RTCView} from 'react-native-webrtc';
import myStyles from '../../styles/styles.js';

import {Logger as MillicastLogger} from '@millicast/sdk';

import {useSelector, useDispatch} from 'react-redux';

window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

const amountCols = Platform.isTV ? 2 : 1;

export default function Multiview({navigation, route}) {
  const streams = useSelector(state => state.viewerReducer.streams);
  const sourceIds = useSelector(state => state.viewerReducer.sourceIds);
  const playing = useSelector(state => state.viewerReducer.playing);
  const millicastView = useSelector(state => state.viewerReducer.millicastView);
  const selectedSource = useSelector(state => state.viewerReducer.selectedSource);
  const dispatch = useDispatch();
  
  const streamsRef = useRef(null);
  const selectedSourceRef = useRef(null);
  const millicastViewRef = useRef(null);

  selectedSourceRef.current = selectedSource;
  streamsRef.current = streams;
  millicastViewRef.current = millicastView;

  const addRemoteTrack = async sourceId => {
    const isAlreadyProjected = streams.some(stream => stream.sourceId === sourceId);
    if (!isAlreadyProjected) {
      const mediaStream = new MediaStream();
      const transceiver = await millicastView.addRemoteTrack('video', [
        mediaStream,
      ]);
      const mediaId = transceiver.mid;
      await millicastView.project(sourceId, [
        {
          media: 'video',
          mediaId,
          trackId: 'video',
        },
      ]);
      dispatch({
        type: 'viewer/addStream',
        payload: {stream: mediaStream, videoMid: mediaId, sourceId: sourceId},
      });
    }
  };

  const navigateSingleView = async (url = null, mid = null) => {
    dispatch({ type: 'viewer/setSelectedSource', payload: { url, mid } });

    try {
      const listVideoMids = streamsRef.current.map(track => track.videoMid).filter(x => (x != '0') && (x != mid));
      const streamAux = streamsRef.current.filter(stream => !listVideoMids.includes(stream.videoMid))

      await millicastViewRef.current.unproject(listVideoMids);

      dispatch({type: 'viewer/setStreams', payload: streamAux});
    } catch (error) {
      console.error(error);
    }

    navigation.navigate('Viewer Main');
  }

  useEffect(() => {
    // componentWillMount
    const initializeMultiview = async () => {
      try {
        await Promise.all(
          sourceIds?.map(async sourceId => {
            if (sourceId != 'main') {
              addRemoteTrack(sourceId);
            }
          }),
        );
      } catch (e) {
        console.log('error', e);
      }
    };
    initializeMultiview();
  }, []);

  return (
    <SafeAreaView style={stylesContainer.container}>
      <View
        style={{
          alignContent: 'center',
          marginBottom: 50,
        }}>
        <FlatList
          data={streams}
          style={{
            textAlign: 'center',
          }}
          numColumns={amountCols}
          keyExtractor={(_, index) => String(index)}
          renderItem={({item, index}) => (
            <View
              style={
                Platform.isTV && Platform.OS === 'ios'
                  ? {}
                  : amountCols === 2
                  ? [
                      {marginTop: -90, marginBottom: -100},
                      index % 2 == 0
                        ? {marginLeft: 10, marginRight: 5}
                        : {marginLeft: 5, marginRight: 10},
                    ]
                  : [
                      {
                        marginTop: -75,
                        marginBottom: -85,
                        marginLeft: '2.5%',
                        marginRight: '2.5%',
                      },
                    ]
              }>
              {
                <>
                  <RTCView
                    key={item?.stream.toURL() + item?.stream.videoMid}
                    streamURL={item?.stream.toURL()}
                    style={{
                      width: amountCols === 2 ? '70%' : '100%',
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 30,
                    }}
                  />
                  <TouchableHighlight
                    hasTVPreferredFocus
                    style={{padding: 10, bottom: 150, borderRadius: 6}}
                    underlayColor="#AA33FF"
                    onPress={() => navigateSingleView(item.stream.toURL(), item.videoMid)}>
                    <Text style={{color: 'white'}}>
                      {!item.sourceId ? 'Main' : String(item.sourceId)}
                    </Text>
                  </TouchableHighlight>
                </>
              }
            </View>
          )}
        />
      </View>
      <View style={myStyles.bottomMultimediaContainer}>
        <View style={myStyles.bottomIconWrapper}>
          <TouchableHighlight
            hasTVPreferredFocus
            tvParallaxProperties={{magnification: 1.5}}
            underlayColor="#AA33FF"
            onPress={() => navigateSingleView()}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {playing ? 'Go back' : null}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
});
