import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

export const ADD_STREAM = 'ADD_STREAM';
export const DELETE_ALL_STREAMS = 'DELETE_ALL_STREAMS';

export const addStream = (stream) => ({
  type: ADD_STREAM,
  payload: {
    stream,
  },
});

export const deleteAllStreams = () => ({
  type: DELETE_ALL_STREAMS,
});

/* eslint-disable */
const initialState = {
  streams: []
}

const savedStreamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_STREAM: {
      const { stream } = action.payload;
      return {
        ...state,
        streams: [stream, ...state.streams.filter(element => element.streamName !== stream.streamName && element.accountId !== stream.accountId).slice(0, 24)],
      };
    }
    case DELETE_ALL_STREAMS: {
      return {
        ...state,
        streams: [],
      };
    }
    default:
      return state;
  }
};

export default savedStreamsReducer;

const persistConfig = {
  key: 'savedStreams',
  storage: AsyncStorage,
};

export const persistedSavedStreamsReducer = persistReducer(persistConfig, savedStreamsReducer);
