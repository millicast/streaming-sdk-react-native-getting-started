import { registerRootComponent } from 'expo';
import {
    registerGlobals
} from 'react-native-webrtc';

// This registers the shim WebRTC data structures, like RTCPeerConnection as global variables so the SDK can find them anywhere.                                                                                                                                
registerGlobals();

// Here we can import the SDK and use it normally.
// Millicast Logger will help you debug your app.
import { Logger as MillicastLogger } from '@millicast/sdk/dist/millicast.debug.umd'

// // Initialize Logger
window.Logger = MillicastLogger

window.Logger.setLevel(MillicastLogger.DEBUG);

import App from './Publisher';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
