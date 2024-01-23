import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';

// local storage for persisting data
import reducer from './reducers/index';

export const store = createStore(reducer);
export const persistor = persistStore(store);
