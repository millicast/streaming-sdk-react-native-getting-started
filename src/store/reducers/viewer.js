const initialState = {
  streamName: null,
  accountId: null,
  playing: false,
  streams: [],
  sourceIds: ['main'],
  activeLayers: [],
  millicastView: null,
  setMedia: true,
  selectedSource: null,
  muted: false,
  multiView: false
};

const viewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'viewer/setStreamName':
      return {
        ...state,
        streamName: action.payload,
      };
    case 'viewer/setAccountId':
      return {
        ...state,
        accountId: action.payload,
      };
    case 'viewer/setStreams':
      return {
        ...state,
        streams: action.payload,
      };
    case 'viewer/setSourceIds':
      return {
        ...state,
        sourceIds: action.payload
      };
    case 'viewer/setActiveLayers':
      return {
        ...state,
        activeLayers: action.payload
      };
    case 'viewer/setPlaying':
      return {
        ...state,
        playing: action.payload
      };
    case 'viewer/setMuted':
      return {
        ...state,
        muted: action.payload
      }
    case 'viewer/setMultiview':
      return {
        ...state,
        multiView: action.payload
      };
    case 'viewer/stopStream':
      return initialState;
    default:
      return state;
  }
};

export default viewerReducer;
