const initialState = {
    streamName: null,
    publishingToken: null,
    millicastPublish: null,
    mediaStream: null,
    stream: null,
    codec: 'vp8',
    mirror:true,
    playingMedia: false, //playing
    audioEnabled: false,
    videoEnabled: false,
    timePlaying: 0, // in seconds
    userCount: 0,
    bitrate: 0,
  };

const publisherReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'publisher/setPublishingToken':
      return {
        ...state,
        publishingToken: action.payload,
      };
    case 'publisher/setStreamName':
      return {
        ...state,
        streamName: action.payload,
      };
    case 'publish':
      return {
        ...state,
        millicastPublish: action.millicastPublish,
      };
    case 'publisher/mediaStream':
      return {
        ...state,
        mediaStream: action.mediaStream,
      };
    case 'publisher/stream':
      return {
        ...state,
        stream: action.stream,
      };
    case 'publisher/codec':
      return {
        ...state,
        codec: action.codec,
      };
    case 'publisher/mirror':
      return {
        ...state,
        mirror: action.mirror,
      };
    case 'publisher/playingMedia':
      return {
        ...state,
        playing: action.playingMedia,
      };
    case 'publisher/audioEnabled':
      return {
        ...state,
        audioEnabled: action.audioEnabled,
      };
    case 'publisher/videoEnabled':
      return {
        ...state,
        videoEnabled: action.videoEnabled,
      };
    case 'publisher/timePlaying':
      return {
        ...state,
        timePlaying: state.timePlaying + 1,
      };
    case 'publisher/resetTimePlaying':
      return {
        ...state,
        timePlaying: 0,
      };
    case 'publisher/userCount':
      return {
        ...state,
        userCount: action.userCount,
      };
    case 'publisher/bitrate':
      return {
        ...state,
        bitrate: action.bitrate,
      }
      default:
        return state;
  }
};

export default publisherReducer;
