import store from '../store';

export const subscribe = async (streamName, accountId) => {
  const tokenGenerator = () =>
    Director.getSubscriber({
      streamName: streamName,
      streamAccountId: accountId,
    });
  // Create a new instance
  let view = new MillicastView(streamName, tokenGenerator, null);
  // Set track event handler to receive streams from Publisher.
  view.on('track', async event => {
    const mediaStream = event.streams[0] ? event.streams[0] : null;
    if (!mediaStream) return null;
    const streams = [...this.state.streams];
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
    this.setState({
      streams: [...streams],
    });
  });

  //Start connection to viewer
  try {
    view.on('broadcastEvent', async event => {
      //Get event name and data
      const {name, data} = event;
      switch (name) {
        case 'active':
          this.setState({
            ...(this.state.sourceIds.indexOf(data.sourceId) === -1 &&
              data.sourceId != null && {
                sourceIds: [...this.state.sourceIds, data.sourceId],
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
  await this.state.millicastView.stop();
  this.setState();
};

export const addRemoteTrack = async sourceId => {
  const mediaStream = new MediaStream();
  const transceiver = await this.state.millicastView.addRemoteTrack('video', [
    mediaStream,
  ]);
  const mediaId = transceiver.mid;
  await this.state.millicastView.project(sourceId, [
    {
      media: 'video',
      mediaId,
      trackId: 'video',
    },
  ]);
  this.setState({
    streams: [...this.state.streams, {stream: mediaStream, videoMid: mediaId}],
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
  console.log('me llaman');
  if (this.state.setMedia) {
    console.log('Stream Name:', this.props.streamName);

    this.subscribe(this.props.streamName, this.props.accountId);
    this.setState({
      setMedia: false,
    });
  }
  let isPaused = !this.state.playing;
  this.changeStateOfMediaTracks(this.state.streams, isPaused);
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
  this.state.millicastView.project(sourceId, [
    {
      media: 'video',
      mediaId: videoMid,
      trackId: 'video',
    },
  ]);
  if (audioMid) {
    this.state.millicastView.project(sourceId, [
      {
        media: 'audio',
        mediaId: this.state.streams[0].audioMid,
        trackId: 'audio',
      },
    ]);
  }
};

export const select = async id => {
  this.state.millicastView.select({encodingId: id});
};

export const multiView = async () => {
  const sourceIds = this.state.sourceIds;
  if (!this.state.multiView) {
    await Promise.all(
      sourceIds.map(async sourceId => {
        if (sourceId != 'main') {
          this.addRemoteTrack(sourceId);
        }
      }),
    );
    this.setState({streams: [this.state.streams[0]]});
  } else {
    this.setState({
      streams: [...[this.state.streams[0]]],
    });
  }
  this.setState({
    multiView: !this.state.multiView,
  });
};

export const a = 1;
