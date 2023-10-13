import { createStore } from 'redux';
import viewerReducer from './reducers/viewer';

// const initialState = {};

const store = createStore(viewerReducer);

export default store;
