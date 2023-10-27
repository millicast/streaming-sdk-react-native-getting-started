const initialState = {
  streamName: 'StreamTest',
  publishingToken: 'a7f38f42d4d60635646a27988fdd1e57089398cd8c92f382f833435d487a346d',
  millicastPublish: null,
  mediaStream: null,
  stream: null,
  codec: 'vp8',
  mirror: true,
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
    default:
      return state;
  }
};

export default publisherReducer;
