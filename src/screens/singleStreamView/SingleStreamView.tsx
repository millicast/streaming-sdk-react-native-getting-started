/* eslint-disable */
import { Logger as MillicastLogger } from '@millicast/sdk';
import React, { useRef, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { BottomBar } from '../../components/BottomBar/BottomBar';
import { SingleView } from '../../components/SingleView';
import { StreamStats } from '../../components/StreamStats/StreamStats';

import makeStyles from './SingleStreamView.style';

window.Logger = MillicastLogger;
window.Logger.setLevel(MillicastLogger.DEBUG);

export const SingleStreamView = ({ navigation }) => {
  const styles = makeStyles();
  const millicastView = useSelector((state) => state.viewerReducer.millicastView);
  const dispatch = useDispatch();

  const millicastViewRef = useRef(null);
  millicastViewRef.current = millicastView;

  const [isStreamStatsModelVisible, setIsStreamStatsModelVisible] = useState<boolean>(false);

  const openStreamStatsModel = () => {
    if(!isStreamStatsModelVisible) {
      setIsStreamStatsModelVisible(true);
      millicastView.webRTCPeer.initStats();
      millicastView.webRTCPeer.on('stats', (stats: any) => {
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

  return (
    <>
    <SafeAreaView style={styles.container}>
      <SingleView />

      <View style={styles.bottomMultimediaContainer}>
        <BottomBar displayStatsInformation={openStreamStatsModel} />
      </View>
    </SafeAreaView>
    { isStreamStatsModelVisible && <StreamStats onPress={closeStreamStatsModel} /> }
    </>
  );
};