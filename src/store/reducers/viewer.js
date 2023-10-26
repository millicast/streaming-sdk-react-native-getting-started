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
    default:
      return state;
  }
};

export default viewerReducer;
