const initialState = {
  streamName: '',
  publishingToken: '',
  millicastPublish: null,
  mediaStream: null,
  stream: null,
  codec: 'vp8',
  mirror: false,
  playing: false,
  audioEnabled: true,
  videoEnabled: true,
  timePlaying: 0, // in seconds
  userCount: 0,
  bitrate: 0,
  streamURL: null
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
    case 'publisher/publish':
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
    case 'publisher/playing':
      return {
        ...state,
        playing: action.playing,
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
      };
    case 'publisher/streamURL':
      return {
        ...state,
        streamURL: action.streamURL,
      };
    case 'publisher/reset':
      return {
        ...initialState,
        streamName: state.streamName,
        publishingToken: state.publishingToken,
        codec: state.codec
      };
    default:
      return state;
  }
};

export default publisherReducer;
