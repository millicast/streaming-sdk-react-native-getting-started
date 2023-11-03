import store from '../store';

import {
    Director,
    View as MillicastView,
  } from '@millicast/sdk/dist/millicast.debug.umd';
  
const viewerStore = store.getState().viewerReducer;

export const subscribe = async () => {
    console.log(viewerStore.streamName, 'viewerStore.streamName...subscribe')
  const tokenGenerator = () =>
    Director.getSubscriber({
      streamName: viewerStore.streamName,
      streamAccountId: viewerStore.accountId,
    });
  // Create a new instance
  let view = new MillicastView(streamName, tokenGenerator, null);
  // Set track event handler to receive streams from Publisher.
  view.on('track', async event => {
    const mediaStream = event.streams[0] ? event.streams[0] : null;
    if (!mediaStream) return null;
    const streams = [...viewerStore.streams];
    if (event.track.kind == 'audio') {
      await Promise.all(
        streams.map(stream => {
          if (stream.stream.toURL() == event.streams[0].toURL()) {
            stream.audioMid = event.transceiver.mid;
          }
        }),
      );
    } else {
      streams.push({stream: mediaStream, videoMid: event.transceiver.mid});
    }
    store.dispatch({type: 'viewer/setStreams', payload: [...streams]});
  });

  //Start connection to viewer
  try {
    view.on('broadcastEvent', async event => {
      //Get event name and data
      const {name, data} = event;
      switch (name) {
        case 'active':
          this.setState({
            ...(viewerStore.sourceIds.indexOf(data.sourceId) === -1 &&
              data.sourceId != null && {
                sourceIds: [...viewerStore.sourceIds, data.sourceId],
              }),
          });
          //A source has been started on the steam
          break;
        case 'inactive':
          //A source has been stopped on the steam
          break;
        case 'vad':
          //A new source was multiplexed over the vad tracks
          break;
        case 'layers':
          this.setState({
            activeLayers: data.medias['0']?.active,
          });
          //Updated layer information for each simulcast/svc video track
          break;
      }
    });
    await view.connect({
      events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
    });

    this.setState({
      millicastView: view,
    });
  } catch (e) {
    console.error('Connection failed. Reason:', e);
  }
};

export const stopStream = async () => {
  await viewerStore.millicastView.stop();
  this.setState();
};

export const addRemoteTrack = async sourceId => {
  const mediaStream = new MediaStream();
  const transceiver = await viewerStore.millicastView.addRemoteTrack('video', [
    mediaStream,
  ]);
  const mediaId = transceiver.mid;
  await viewerStore.millicastView.project(sourceId, [
    {
      media: 'video',
      mediaId,
      trackId: 'video',
    },
  ]);
  this.setState({
    streams: [...viewerStore.streams, {stream: mediaStream, videoMid: mediaId}],
  });
};

export const changeStateOfMediaTracks = (streams, value) => {
  streams.map(s =>
    s.stream.getTracks().forEach(videoTrack => {
      videoTrack.enabled = value;
    }),
  );
  this.setState({
    playing: value,
  });
};

export const playPauseVideo = async () => {
  if (viewerStore.isMediaSet) {
    console.log('viewerStore.isMediaSet', viewerStore.isMediaSet)
    console.log('Stream Name:', viewerStore.streamName);

    subscribe(viewerStore.streamName, viewerStore.accountId);
    this.setState({
      isMediaSet: false,
    });
  }
  const isPaused = !viewerStore.playing;
  this.changeStateOfMediaTracks(viewerStore.streams, isPaused);
};

export const changeStateOfAudioTracks = (streams, value) => {
  streams.map(s =>
    s.stream.getTracks().forEach(track => {
      if (track.kind == 'audio') {
        track.enabled = value;
      }
    }),
  );
  this.setState({
    muted: !value,
  });
};

export const project = async (sourceId, videoMid, audioMid) => {
  if (sourceId == 'main') {
    sourceId = null;
  }
  viewerStore.millicastView.project(sourceId, [
    {
      media: 'video',
      mediaId: videoMid,
      trackId: 'video',
    },
  ]);
  if (audioMid) {
    viewerStore.millicastView.project(sourceId, [
      {
        media: 'audio',
        mediaId: viewerStore.streams[0].audioMid,
        trackId: 'audio',
      },
    ]);
  }
};

export const select = async id => {
  viewerStore.millicastView.select({encodingId: id});
};

export const multiView = async () => {
  const sourceIds = viewerStore.sourceIds;
  if (!viewerStore.multiView) {
    await Promise.all(
      sourceIds.map(async sourceId => {
        if (sourceId != 'main') {
          this.addRemoteTrack(sourceId);
        }
      }),
    );
    this.setState({streams: [viewerStore.streams[0]]});
  } else {
    this.setState({
      streams: [...[viewerStore.streams[0]]],
    });
  }
  this.setState({
    multiView: !viewerStore.multiView,
  });
};

store.subscribe(playPauseVideo, subscribe)