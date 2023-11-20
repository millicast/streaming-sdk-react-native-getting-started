import {combineReducers} from 'redux';
import viewerReducer from './viewer.js';
import publisherReducer from './publisher.js';

export default combineReducers({
  viewerReducer,
  publisherReducer,
});
