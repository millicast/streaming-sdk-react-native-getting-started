/* eslint-disable */
import { combineReducers } from 'redux';

import publisherReducer from './publisher.js';
import viewerReducer from './viewer.js';
import savedStreamsReducer, { persistedSavedStreamsReducer } from './savedStreams.js'

export default combineReducers({
  viewerReducer,
  publisherReducer,
  persistedSavedStreamsReducer
});
