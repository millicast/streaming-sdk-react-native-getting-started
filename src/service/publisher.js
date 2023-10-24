toggleCamera = () => {
    this.state.mediaStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
    this.setState({mirror: !this.state.mirror});
  };

  start = async () => {
    if (!this.state.mediaStream) {
      let medias;
      try {
        medias = await mediaDevices.getUserMedia({
          video: this.state.videoEnabled,
          audio: this.state.audioEnabled,
        });
        this.setState({mediaStream: medias});
        this.publish(this.props.streamName, this.props.token);
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
          this.setState({userCount: data.viewercount});
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
    if (this.state.playing) {
      this.millicastPublish.stop();
      if (this.state.mediaStream) {
        this.state.mediaStream.release();
        this.setState({
          mediaStream: null,
        });
      }
      this.setState({timePlaying: 0});
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
        this.setState({playing: !this.state.playing});
      }
    });
  };

export const publish = async (streamName, token) => {
    const tokenGenerator = () =>
        Director.getPublisher({
            token: token,
            streamName: streamName,
        });
        // Create a new instance
        let millicastPublish = new Publish(streamName, tokenGenerator);

        millicastPublish.connect(broadcastOptions)

        this.setState({
        streamURL: this.state.mediaStream,
        });

        // Publishing Options
        const broadcastOptions = {
        mediaStream: this.state.mediaStream,
        codec: this.state.codec,
        events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
        };

        // Start broadcast
        try {
        await this.millicastPublish.connect(broadcastOptions);
        } catch (e) {
        console.log('Connection failed, handle error', e);
        }
}

  handleClickPlay = () => {
    if (!this.state.playing) {
      this.start();
    } else {
      this.stop();
    }
  };

  handleClickMute = () => {
    this.state.mediaStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    this.setState({audioEnabled: !this.state.audioEnabled});
  };

  handleClickDisableVideo = () => {
    this.state.mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    this.setState({videoEnabled: !this.state.videoEnabled});
  };

  showTimePlaying = () => {
    let time = this.state.timePlaying;

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


  // async publish(streamName, token) {
  //   const tokenGenerator = () =>
  //     Director.getPublisher({
  //       token,
  //       streamName,
  //     });

  //   // Create a new instance
  //   this.millicastPublish = new Publish(streamName, tokenGenerator);

  //   this.setState({
  //     streamURL: this.state.mediaStream,
  //   });

  //   // Publishing Options
  //   const broadcastOptions = {
  //     mediaStream: this.state.mediaStream,
  //     codec: this.state.codec,
  //     events: ['active', 'inactive', 'vad', 'layers', 'viewercount'],
  //   };

  //   // Start broadcast
  //   try {
  //     await this.millicastPublish.connect(broadcastOptions);
  //   } catch (e) {
  //     console.log('Connection failed, handle error', e);
  //   }
  // }