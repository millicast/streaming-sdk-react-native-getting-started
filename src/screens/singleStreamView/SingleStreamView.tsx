/* eslint-disable */
import { Logger as MillicastLogger } from '@millicast/sdk';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, SafeAreaView, FlatList, Dimensions, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RTCView } from 'react-native-webrtc';

import { BottomBar } from '../../components/BottomBar/BottomBar';
import { StreamStats } from '../../components/StreamStats/StreamStats';
import { StreamStatusIndicator } from '../../components/StreamStatusIndicator/StreamStatusIndicator';
import { ContainerView } from '../../components/ContainerView/ContainerView';
import { RemoteTrackSource } from '../../types/RemoteTrackSource.types';
import makeStyles from './SingleStreamView.style';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export const SingleStreamView = ({ navigation }) => {
  const styles = makeStyles();
  const remoteTrackSources = useSelector((state) => state.viewerReducer.remoteTrackSources);
  const selectedSource = useSelector((state) => state.viewerReducer.selectedSource);
  const millicastView = useSelector((state) => state.viewerReducer.millicastView);
  const dispatch = useDispatch();

  const remoteTrackSourcesRef = useRef(null);
  const selectedSourceRef = useRef<RemoteTrackSource>(null);
  const millicastViewRef = useRef(null);

  selectedSourceRef.current = selectedSource;
  remoteTrackSourcesRef.current = remoteTrackSources;
  millicastViewRef.current = millicastView;

  const [videoTileIndex, setVideoTileIndex] = useState<number>(-1);
  const [width, setWidth] = useState<number>(Dimensions.get('window').width);
  const [height, setHeight] = useState<number>(Dimensions.get('window').height);

  const [indicatorLayout, setIndicatorLayout] = useState<any>(styles.indicatorLayout);
  const [isStreamStatsModelVisible, setIsStreamStatsModelVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [visibleRemoteTrackSource, setVisibleRemoteTrackSource] = useState<RemoteTrackSource>(null);

  const flatlistRef = useRef(null);

  const changeDimensions = async () => {
    const {width, height} = Dimensions.get('window');
    setWidth(width);
    setHeight(height);

    if( Platform.isTV ) {
      if ( Platform.OS === "ios" ) {
        setIndicatorLayout({...indicatorLayout, left: '1.0%', top:'1.0%'});
      } else {
        setIndicatorLayout({...indicatorLayout, left: '1.0%', top:'5%'});
      }
    } else if(width > height) {
      // landscape mode
      if ( Platform.OS === "ios" ) {
        setIndicatorLayout({...indicatorLayout, left: '12%', top:'10%'});
      } else {
        // android device
        setIndicatorLayout({...indicatorLayout, left: '8%', top:'12%'});
      }
    } else {
      // portrait mode - ios/android
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
    const streamIndex = remoteTrackSourcesRef.current.findIndex( (remoteTrackSource) => remoteTrackSource.videoMediaId === selectedSourceRef.current?.videoMediaId && remoteTrackSource.mediaStream.toURL() === selectedSourceRef.current?.mediaStream.toURL());
    const remoteTrackSource = remoteTrackSources[streamIndex];
    setVisibleRemoteTrackSource(remoteTrackSource);
    setVideoTileIndex(streamIndex);
  }, [selectedSource, remoteTrackSources]);

  const openStreamStatsModel = () => {
    if(!isStreamStatsModelVisible) {
      setIsStreamStatsModelVisible(true);
      setIsFocused(false);
      millicastViewRef.current.webRTCPeer.initStats();
      millicastViewRef.current.webRTCPeer.on('stats', (stats: any) => {
        const selectedAudio = stats.audio.inbounds[0];
        const selectedVideo = stats.video.inbounds.filter(({ mid }) => mid === visibleRemoteTrackSource?.videoMediaId)[0] ?? [];
        dispatch({
          type: 'viewer/setStreamStats',
          payload: {
            audioInbounds: selectedAudio,
            videoInbounds: selectedVideo,
            currentRoundTripTime: stats.currentRoundTripTime,
          }
        });
      });
    }
  };

  const closeStreamStatsModel = () => {
    if (isStreamStatsModelVisible) {
      setIsStreamStatsModelVisible(false);
      setIsFocused(true);
      millicastViewRef.current.webRTCPeer.stopStats();
      dispatch({ type: 'viewer/setStreamStats', payload: null });
    }
  };

  const renderVideoItem = ({item}) => (
    <View style={[styles.videoContainer, { width: width, height: height }]}>
      <RTCView
        testID={!item.sourceId ? 'Main' : String(item.sourceId)}
        key={item.video}
        streamURL={item.mediaStream.toURL()}
        style={styles.video}
        objectFit="contain"
      />
      <StreamStatusIndicator title="LIVE" position={indicatorLayout} />
    </View>
  );

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    const viewableItem = viewableItems[0]

    if (viewableItem !== null && viewableItem !== undefined) {
      setVisibleRemoteTrackSource(viewableItem.item)
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100
  }

  return (
    <View style={{ flexDirection: 'column', flex: 1, backgroundColor: 'red', justifyContent: 'flex-end' }}>
      <ContainerView style={styles.container}>
        <FlatList
          ref={flatlistRef}
          initialScrollIndex={videoTileIndex}
          key={1}
          numColumns={1}
          horizontal={true}
          pagingEnabled={true}
          data={remoteTrackSourcesRef.current}
          keyExtractor={(_, index) => String(index)}
          style={{ width: width }}
          renderItem={renderVideoItem}
          getItemLayout={(data, index) => ({length: width, offset: width * index, index})}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <View style={styles.bottomMultimediaContainer}>
          <BottomBar displayStatsInformation={openStreamStatsModel} focus={isFocused} />
        </View>
      </ContainerView>
      {isStreamStatsModelVisible && <StreamStats onPress={closeStreamStatsModel} />}
    </View>
  );
};

