/* eslint-disable */
import { combineReducers } from 'redux';

import publisherReducer from './publisher.js';
import viewerReducer from './viewer.js';

export default combineReducers({
  viewerReducer,
  publisherReducer,
});
