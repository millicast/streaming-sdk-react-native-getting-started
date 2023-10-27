import store from '../store';
import {mediaDevices} from 'react-native-webrtc';
import {Director, Publish} from '@millicast/sdk/dist/millicast.debug.umd';

const publisherStore = store.getState().publisherReducer;

toggleCamera = () => {
  this.state.mediaStream.getVideoTracks().forEach(track => {
    track._switchCamera();
  });
  this.setState({mirror: !this.state.mirror});
};

start = async () => {
  if (!publisherStore.mediaStream) {
    let medias;
    try {
      medias = await mediaDevices.getUserMedia({
        video: publisherStore.videoEnabled,
        audio: publisherStore.audioEnabled,
      });
      // this.setState({mediaStream: medias});
      store.dispatch({type: 'publisher/mediaStream', medias: 'medias'});
      console.log('names ', publisherStore.streamName);

      this.publish(publisherStore.streamName, publisherStore.token);
    } catch (e) {
      console.error(e);
    }
  }

  if (this.millicastPublish) {
    // State of the broadcast
    this.connectionState();

    this.millicastPublish.on('broadcastEvent', event => {
      const {name, data} = event;
      if (name === 'viewercount') {
        // this.setState({userCount: data.viewercount});
        store.dispatch({
          type: 'publisher/userCount',
          userCount: data.viewercount,
        });
      }
    });
  }
};

setCodec = value => {
  this.setState({
    codec: value,
  });
};

setBitrate = async value => {
  this.setState({
    bitrate: value,
  });
  await this.millicastPublish.webRTCPeer.updateBitrate(value);
};

stop = () => {
  if (publisherStore.playing) {
    this.millicastPublish.stop();
    if (publisherStore.mediaStream) {
      publisherStore.mediaStream.release();
      // this.setState({
      //   mediaStream: null,
      // });
      store.dispatch({type: 'publisher/mediaStream', mediaStream: null});
    }
    // this.setState({timePlaying: 0});
    store.dispatch({type: 'publisher/timePlaying', timePlaying: 0});

  }

  if (this.millicastPublish) {
    this.connectionState();
  }
};

connectionState = () => {
  // State of the broadcast
  this.millicastPublish.on('connectionStateChange', event => {
    if (
      event === 'connected' ||
      event === 'disconnected' ||
      event === 'closed'
    ) {
      // this.setState({playing: !this.state.playing});
      store.dispatch({type: 'publisher/playing', playing: !publisherStore.playing});
      console.log('playing???');
    }
  });
};

export const publish = async (streamName, token) => {
  const tokenGenerator = () =>
    Director.getPublisher({
      token: token,
      streamName: streamName,
    });
  console.log('maybe connecting');
  
  // Create a new instance
  let millicastPublish = new Publish(streamName, tokenGenerator);

  millicastPublish.connect(broadcastOptions);
  console.log('maybe connecting');

  // this.setState({
  //   streamURL: this.state.mediaStream,
  // });
  store.dispatch({type: 'publisher/streamURL', streamURL: publisherStore.mediaStream});

  // Publishing Options
  const broadcastOptions = {
    mediaStream: publisherStore.mediaStream,
    codec: publisherStore.codec,
    events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
  };

  // Start broadcast
  try {
    await this.millicastPublish.connect(broadcastOptions);
  } catch (e) {
    console.log('Connection failed, handle error', e);
  }
};

export const handleClickPlay = () => {
  if (!publisherStore.playing) {
  console.log('handle click play');
    this.start();
  } else {
    console.log('hello');
    this.stop();
  }
};

handleClickMute = () => {
  publisherStore.mediaStream.getAudioTracks().forEach(track => {
    track.enabled = !track.enabled;
  });
  // this.setState({audioEnabled: !this.state.audioEnabled});
  store.dispatch({type: 'publisher/audioEnabled', audioEnabled: !publisherStore.audioEnabled});
};

handleClickDisableVideo = () => {
  publisherStore.mediaStream.getVideoTracks().forEach(track => {
    track.enabled = !track.enabled;
  });
  // this.setState({videoEnabled: !this.state.videoEnabled});
  store.dispatch({type: 'publisher/videoEnabled', videoEnabled: !publisherStore.videoEnabled});
};

showTimePlaying = () => {
  let time = publisherStore.timePlaying;

  let seconds = '' + (time % 60);
  let minutes = '' + (Math.floor(time / 60) % 60);
  let hours = '' + Math.floor(time / 3600);

  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }

  return hours + ':' + minutes + ':' + seconds;
};
