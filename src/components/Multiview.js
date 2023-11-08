import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import {RTCView} from 'react-native-webrtc';

import {Logger as MillicastLogger} from '@millicast/sdk';

import {useSelector, useDispatch} from 'react-redux';

window.Logger = MillicastLogger;
Logger.setLevel(MillicastLogger.DEBUG);

const amountCols = Platform.isTV ? 2 : 1;

function Multiview(props) {
  const streams = useSelector(state => state.viewerReducer.streams);
  const sourceIds = useSelector(state => state.viewerReducer.sourceIds);
  const millicastView = useSelector(state => state.viewerReducer.millicastView);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  addRemoteTrack = async sourceId => {
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
      payload: {stream: mediaStream, videoMid: mediaId},
    });
  };

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

    return () => {
      // componentWillUnmount
    };
  }, []);

  return (
    <>
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
                    onPress={() => {
                      dispatch({
                        type: 'viewer/setSelectedSource',
                        payload: item.stream.toURL(),
                      });
                      navigation.goBack();
                    }}>
                    <Text style={{color: 'white'}}>
                      {item.stream.videoMid === '0'
                        ? 'Main'
                        : String(sourceIds[index])}
                    </Text>
                  </TouchableHighlight>
                </>
              }
            </View>
          )}
        />
      </View>
    </>
  );
}

export default function App(props) {
  return (
    <>
      <SafeAreaView style={stylesContainer.container}>
        <Multiview />
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
