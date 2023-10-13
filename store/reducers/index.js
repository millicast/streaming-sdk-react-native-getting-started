import {combineReducers} from 'redux';
import viewerReducer from '/viewer';
import publisherReducer from '/publisher';

export default combineReducers({
  viewerReducer,
  publisherReducer,
});
