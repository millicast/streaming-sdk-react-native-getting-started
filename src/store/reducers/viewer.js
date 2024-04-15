/* eslint-disable */
const initialState = {
  streamName: null,
  accountId: null,
  playing: false,
  error: null,
  remoteTrackSources: [],
  audioRemoteTrackSource: null,
  sourceIds: [],
  activeLayers: [],
  millicastView: null,
  isMediaSet: true,
  selectedSource: null,
  muted: false,
  multiView: false,
  streamStats: null,
  projectedVideoMids: [],
  projectedLayers: [],
};

const viewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'viewer/setStreamStats':
      return {
        ...state,
        streamStats: action.payload,
      };
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
    case 'viewer/setSourceIds':
      return {
        ...state,
        sourceIds: action.payload,
      };
    case 'viewer/setActiveLayers':
      const {mediaId, streamQualities} = action.payload;
      const sourceToAddLayer = state.remoteTrackSources.find(
        (remoteTrackSource) => remoteTrackSource.videoMediaId === mediaId,
      );
      if (sourceToAddLayer) {
        return {
          ...state,
          activeLayers: [...state.activeLayers.filter((activeLayer) => activeLayer.mediaId !== mediaId), {mediaId, streamQualities}]
        };
      } else {
        return {
          ...state,
        };
      }
    case 'viewer/setProjectedLayer':
      const {videoMediaId, streamQuality} = action.payload;
      return {
        ...state,
        projectedLayers: [...state.projectedLayers.filter((projectedLayer) => projectedLayer.mediaId !== videoMediaId), {mediaId: videoMediaId, streamQuality}]
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
    case 'viewer/addVideoMid':
      return {
        ...state,
        sourceIds: [...state.projectedVideoMids, action.payload],
      };
    case 'viewer/addSourceId':
      return {
        ...state,
        sourceIds: [...state.sourceIds, action.payload],
      };
    case 'viewer/removeSourceId':
      const sourceIds = state.sourceIds.filter((sourceId) => sourceId !== action.payload)
      return {
        ...state,
        sourceIds: [...sourceIds],
      };
    case 'viewer/addRemoteTrackSource':
      return {
        ...state,
        remoteTrackSources: [...state.remoteTrackSources, action.payload],
      };
    case 'viewer/removeRemoteTrackSource':
      const remoteTrackSources = state.remoteTrackSources.filter((remoteTrackSource) => remoteTrackSource !== action.payload);
      return {
        ...state,
        remoteTrackSources: [...remoteTrackSources],
      };
    case 'viewer/resetRemoteTrackSources':
      return {
        ...state,
        remoteTrackSources: [],
      };
    case 'viewer/addAudioRemoteTrackSource':
      return {
        ...state,
        audioRemoteTrackSource: action.payload,
      };
    case 'viewer/removeAudioRemoteTrackSource':
      return {
        ...state,
        audioRemoteTrackSource: null,
      };
    case 'viewer/setSelectedSource':
      return {
        ...state,
        selectedSource: { ...action.payload },
      };
    case 'viewer/setError':
      return {
        ...state,
        error: action.payload,
      };
    case 'viewer/resetAll':
      return {
        ...initialState,
        streamName: state.streamName,
        accountId: state.accountId,
      };
    default:
      return state;
  }
};

export default viewerReducer;
