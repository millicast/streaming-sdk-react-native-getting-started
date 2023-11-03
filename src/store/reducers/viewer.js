const initialState = {
  streamName: null,
  accountId: null,
  playing: false,
  streams: [],
  sourceIds: ['main'],
  activeLayers: [],
  millicastView: null,
  isMediaSet: true,
  selectedSource: null,
  muted: false,
  multiView: false,
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
    case 'viewer/onTrackEvent':
      const event = action.payload;
      const mediaStream = event.streams[0] ? event.streams[0] : null;
      if (!mediaStream) return state;
      const streams = [...state.streams];
      const audioPromise = async () => {
        await Promise.all(
          streams.map(stream => {
            if (stream.stream.toURL() == event.streams[0].toURL()) {
              stream.audioMid = event.transceiver.mid;
            }
          }),
        );
      };
      if (event.track.kind == 'audio') {
        audioPromise();
      } else {
        streams.push({stream: mediaStream, videoMid: event.transceiver.mid});
      }
      return {
        ...state,
        streams: streams,
      };
    case 'viewer/setSourceIds':
      return {
        ...state,
        sourceIds: action.payload,
      };
    case 'viewer/setActiveLayers':
      return {
        ...state,
        activeLayers: action.payload,
      };
    case 'viewer/setPlaying':
      return {
        ...state,
        playing: action.payload,
      };
    case 'viewer/setMuted':
      return {
        ...state,
        muted: action.payload,
      };
    case 'viewer/setMillicastView':
      return {
        ...state,
        millicastView: action.payload,
      };
    case 'viewer/setMultiView':
      return {
        ...state,
        multiView: action.payload,
      };
    case 'viewer/setIsMediaSet':
      return {
        ...state,
        isMediaSet: action.payload,
      };
    default:
      return state;
  }
};

export default viewerReducer;
