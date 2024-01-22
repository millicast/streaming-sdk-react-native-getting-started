/* eslint-disable */
import { Logger as MillicastLogger } from '@millicast/sdk';
import { Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableHighlight, FlatList, Platform, AppState } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

import myStyles from '../../styles/styles.js';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export default function Multiview({ navigation, route }) {
  const streams = useSelector((state) => state.viewerReducer.streams);
  const streamsProjecting = useSelector((state) => state.viewerReducer.streamsProjecting);
  const sourceIds = useSelector((state) => state.viewerReducer.sourceIds);
  const playing = useSelector((state) => state.viewerReducer.playing);
  const millicastView = useSelector((state) => state.viewerReducer.millicastView);
  const selectedSource = useSelector((state) => state.viewerReducer.selectedSource);
  const dispatch = useDispatch();

  const streamsRef = useRef(null);
  const selectedSourceRef = useRef(null);
  const millicastViewRef = useRef(null);

  selectedSourceRef.current = selectedSource;
  streamsRef.current = streams;
  millicastViewRef.current = millicastView;

  const [columnsNumber, setColumnsNumber] = useState(1);

  useEffect(() => {
    checkOrientation();
    const subscription = Dimensions.addEventListener('change', () => {
      checkOrientation();
    });
    return () => {
      Dimensions.removeEventListener(subscription);
    };
  }, []);
  const checkOrientation = async () => {
    setColumnsNumber(Dimensions.get('window').width > Dimensions.get('window').height ? 2 : 1);
  };

  const addRemoteTrack = async (sourceId) => {
    const isAlreadyProjected = streams.some((stream) => stream.sourceId === sourceId);
    const isAlreadyProjecting = streamsProjecting.some((stream) => stream.sourceId === sourceId);
    if (!isAlreadyProjected && !isAlreadyProjecting) {
      dispatch({
        type: 'viewer/addProjectingStream',
        payload: { sourceId },
      });
      // eslint-disable-next-line no-undef
      const mediaStream = new MediaStream();
      const transceiver = await millicastViewRef.current.addRemoteTrack('video', [mediaStream]);
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
        payload: { stream: mediaStream, videoMid: mediaId, sourceId },
      });
      dispatch({
        type: 'viewer/removeProjectingStream',
        payload: { sourceId },
      });
      console.log('**** streams:', streams, mediaStream);
    }
  };

  const navigateSingleView = async (url = null, mid = null) => {
    dispatch({ type: 'viewer/setSelectedSource', payload: { url, mid } });

    try {
      const listVideoMids = streamsRef.current.map((track) => track.videoMid).filter((x) => x != '0' && x != mid);
      const streamAux = streamsRef.current.filter((stream) => !listVideoMids.includes(stream.videoMid));

      await millicastViewRef.current.unproject(listVideoMids);

      dispatch({ type: 'viewer/setStreams', payload: streamAux });
    } catch (error) {
      console.error(error);
    }

    navigation.navigate('Viewer Main');
  };

  useEffect(() => {
    const initializeMultiview = async () => {
      try {
        await Promise.all(
          sourceIds?.map(async (sourceId) => {
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
  }, [addRemoteTrack, navigation, sourceIds]);

  return (
    <SafeAreaView style={stylesContainer.container}>
      <View
        style={{
          alignContent: 'center',
          marginBottom: 50,
        }}
      >
        {playing ? (
          <FlatList
            key={columnsNumber}
            data={streams}
            style={{
              textAlign: 'center',
            }}
            numColumns={columnsNumber}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item, index }) => (
              <View style={margins(columnsNumber, index)}>
                <>
                  <RTCView
                    key={item?.stream.toURL() + item?.stream.videoMid}
                    streamURL={item?.stream.toURL()}
                    style={{
                      width: columnsNumber === 2 ? '70%' : '100%',
                      flex: 1,
                      aspectRatio: 1,
                    }}
                  />
                  <TouchableHighlight
                    style={{ padding: 1, position: 'absolute', marginLeft: -10, bottom: -120, zIndex: 0 }}
                    underlayColor="#AA33FF"
                    onPress={() => navigateSingleView(item.stream.toURL(), item.videoMid)}
                  >
                    <Text
                      style={{
                        color: 'white',
                        backgroundColor: 'grey',
                        borderRadius: 3,
                        paddingHorizontal: 3,
                        justifyContent: 'flex-start',
                      }}
                    >
                      {!item.sourceId ? 'Main' : String(item.sourceId)}
                    </Text>
                  </TouchableHighlight>
                </>
              </View>
            )}
          />
        ) : (
          <View style={{ padding: '5%' }}>
            <Text style={{ color: 'white' }}>Stream is offline</Text>
          </View>
        )}
      </View>
      <View style={myStyles.bottomMultimediaContainer}>
        <View style={myStyles.bottomIconWrapper}>
          <TouchableHighlight
            hasTVPreferredFocus
            tvParallaxProperties={{ magnification: 1.5 }}
            underlayColor="#AA33FF"
            onPress={() => navigateSingleView()}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{playing ? 'Go back' : null}</Text>
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

function margins(columnsNumber, index) {
  var marginTop = 0;
  var marginBottom = 0;
  var marginLeft = 0;
  var marginRight = 0;

  if (Platform.isTV && Platform.OS === 'ios') {
    return { marginTop: marginTop, marginBottom: marginBottom, marginLeft: marginLeft, marginRight: marginRight };
  }
  if (Dimensions.width < 600) {
    marginTop = -45;
    marginBottom = -50;
    marginLeft = '2.5%';
    marginRight = '2.5%';
  } else {
    marginTop = -90;
    marginBottom = -100;
    marginLeft = '2.5%';
    marginRight = '2.5%';
  }
  console.log(
    'marginTop: marginTop, marginBottom: marginBottom, marginLeft: marginLeft, marginRight: marginRight',
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  );
  return { marginTop: marginTop, marginBottom: marginBottom, marginLeft: marginLeft, marginRight: marginRight };
}
