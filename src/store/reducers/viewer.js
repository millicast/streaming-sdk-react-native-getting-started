/* eslint-disable */
const initialState = {
  streamName: null,
  accountId: null,
  playing: false,
  streams: [],
  sourceIds: ['main'],
  streamsProjecting: [],
  activeLayers: [],
  millicastView: null,
  isMediaSet: true,
  selectedSource: {
    url: null,
    mid: null,
  },
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
      const mediaStream = event?.streams?.[0];
      const streamsArray = [...state.streams];
      if (mediaStream) {
        const audioPromise = async () => {
          await Promise.all(
            streamsArray?.map((stream) => {
              if (stream.stream.toURL() == event.streams?.[0]?.toURL()) {
                stream.audioMid = event.transceiver.mid;
              }
            }),
          );
        };
        if (event.track.kind == 'audio') {
          audioPromise();
        } else {
          streamsArray.push({
            stream: mediaStream,
            videoMid: event.transceiver.mid,
          });
        }
      }
      return {
        ...state,
        streams: streamsArray,
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
    case 'viewer/addSourceId':
      return {
        ...state,
        sourceIds: [...state.sourceIds, action.payload],
      };
    case 'viewer/addStream':
      return {
        ...state,
        streams: [...state.streams, action.payload],
      };
    case 'viewer/removeStream':
      const streams = state.streams.filter((stream) => stream !== action.payload);
      return {
        ...state,
        streams: [...streams],
      };
    case 'viewer/addProjectingStream':
      return {
        ...state,
        streamsProjecting: [...state.streamsProjecting, action.payload],
      };
    case 'viewer/removeProjectingStream':
      const projectingStreams = state.streamsProjecting.filter((stream) => stream !== action.payload);
      return {
        ...state,
        streamsProjecting: projectingStreams,
      };
    case 'viewer/removeProjectingStreams':
      return {
        ...state,
        streamsProjecting: [],
      };
    case 'viewer/setSelectedSource':
      return {
        ...state,
        selectedSource: { ...action.payload },
      };
    default:
      return state;
  }
};

export default viewerReducer;
