/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { registerGlobals } from 'react-native-webrtc';

import { name as appName } from './app.json';
import App from './src/App';

// This registers the shim WebRTC data structures, like RTCPeerConnection as global variables so the SDK can find them anywhere.
registerGlobals();

AppRegistry.registerComponent(appName, () => App);
