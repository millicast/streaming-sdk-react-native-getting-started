/* eslint-disable */
import { Logger as MillicastLogger } from '@millicast/sdk';
import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, FlatList, Dimensions, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RTCView } from 'react-native-webrtc';

import { BottomBar } from '../../components/BottomBar/BottomBar';
import { StreamStats } from '../../components/StreamStats/StreamStats';
import { StreamStatusIndicator } from '../../components/StreamStatusIndicator/StreamStatusIndicator';

import makeStyles from './SingleStreamView.style';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

const SingleStreamView = ({ navigation }) => {
  const styles = makeStyles();
  const streams = useSelector((state) => state.viewerReducer.streams);
  const selectedSource = useSelector((state) => state.viewerReducer.selectedSource);
  const millicastView = useSelector((state) => state.viewerReducer.millicastView);
  const dispatch = useDispatch();

  const streamsRef = useRef(null);
  const selectedSourceRef = useRef(null);
  const millicastViewRef = useRef(null);

  selectedSourceRef.current = selectedSource;
  streamsRef.current = streams;
  millicastViewRef.current = millicastView;

  const [videoTileIndex, setVideoTileIndex] = useState<number>(-1);
  const [width, setWidth] = useState<number>(Dimensions.get('window').width);
  const [height, setHeight] = useState<number>(Dimensions.get('window').height);

  const [indicatorLayout, setIndicatorLayout] = useState<any>(styles.indicatorLayout);

  const flatlistRef = useRef(null);

  const changeDimensions = async () => {
    const {width, height} = Dimensions.get('window');
    setWidth(width);
    setHeight(height);
    if(width > height) {
      // landscape mode
      setIndicatorLayout({...indicatorLayout, left: 45, marginTop:45});
    } else {
      setIndicatorLayout(styles.indicatorLayout);
    }
  };

  useEffect(() => {
    changeDimensions();
    const subscription = Dimensions.addEventListener('change', () => {
      changeDimensions();
    });
    return () => subscription?.remove();
  }, []);

  useEffect(()=> {
    const {url, mid} = selectedSourceRef.current;
    const streamIndex = streamsRef.current.findIndex( (element) => element.videoMid === mid && element.stream.toURL() === url);
    setVideoTileIndex(streamIndex);
  }, [selectedSource, streams]);

  const [isStreamStatsModelVisible, setIsStreamStatsModelVisible] = useState<boolean>(false);

  const openStreamStatsModel = () => {
    if(!isStreamStatsModelVisible) {
      setIsStreamStatsModelVisible(true);
      millicastViewRef.current.webRTCPeer.initStats();
      millicastViewRef.current.webRTCPeer.on('stats', (stats: any) => {
        dispatch({
          type: 'viewer/setStreamStats',
          payload: {
            audioInbounds: stats.audio.inbounds[0]??[],
            videoInbounds: stats.video.inbounds[0]??[],
            currentRoundTripTime: stats.currentRoundTripTime,
          }
        });
      });
    }
  };

  const closeStreamStatsModel = () => {
    if(isStreamStatsModelVisible) {
      setIsStreamStatsModelVisible(false);
      millicastView.webRTCPeer.stopStats();
      dispatch({ type: 'viewer/setStreamStats', payload: null });
    }
  };

  const renderVideoItem = ({item}) => (
      <View style={[styles.videoContainer, {width:width, height: height}]}>
        <RTCView
          key={item.videoMid}
          streamURL={item.stream.toURL()}
          style={styles.video}
          objectFit="contain"
        />
        <StreamStatusIndicator title="LIVE" position={indicatorLayout} />
      </View>
  );

  return (
    <>
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatlistRef}
        initialScrollIndex={videoTileIndex}
        key={1}
        numColumns={1}
        horizontal={true}
        pagingEnabled={true}
        data={streamsRef.current}
        keyExtractor={(_, index) => String(index)}
        style={{width: width}}
        renderItem={renderVideoItem}
      />
      <View style={styles.bottomMultimediaContainer}>
        <BottomBar displayStatsInformation={openStreamStatsModel} />
      </View>
    </SafeAreaView>
    { isStreamStatsModelVisible && <StreamStats onPress={closeStreamStatsModel} /> }
    </>
  );
};

export default SingleStreamView;

