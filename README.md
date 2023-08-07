# React Native TV Sample App

In this document we describe how to run the application on mobile (Android and iOS) and TV (Android and tvOS).

## Apple

### tvOS

- It is required to have `WebRTC.framework` M112 build for tvOS. Place your build directory inside the `ios` folder.

Clone this repository and move to `tvapp` branch.
Execute `yarn` to install dependencies.
Then execute ``cd ios && pod install``.

Create `.env` inside the root folder with the following credentials:

`MILLICAST_STREAM_NAME=`

`MILLICAST_ACCOUNT_ID=`

`MILLICAST_PUBLISHING_TOKEN=`

#### Xcode settings

Open Xcode, select **Open a project from a file** and select `/streaming-sdk-react-native-getting-started/ios/TestApp.xcworkspace`

Select TestApp project, then TestApp-tvOS target.

Go to **General -> Frameworks, Libraries, and Embedded Content** and add WebRTC.framework m112 build for tvOS.
Also, add the framework in **Build Phases -> Embed Frameworks** and on **Link Binary With Libraries**.

Then select Pods Xcode project and go to Build Settings -> Search Paths.

In Frameworks Search Paths, insert the following line: 
* $(PROJECT_DIR)/../libWebRTC/WebRTC.xcframework/tvos-arm64-simulator

In Header Search Paths, insert the following line: 
* $(PROJECT_DIR)/../libWebRTC/WebRTC.xcframework/tvos-arm64-simulator
* $(PROJECT_DIR)/../libWebRTC/WebRTC.xcframework/tvos-arm64-simulator/WebRTC.framework/Headers

Select TestApp-tvOS project and use a tvOS simulator with tvOS 16.

Run the project, you should see the simulator with the app home page with a buttom to subscribe to a stream.

## Android

1. Clone this repository and move to `tvapp` branch.
2. To install dependencies, run:
```
yarn
```
1. Inside `android` directory, create a file called `local.properties` which only content should be the path of the Java SDK directory, this should look like:
```
sdk.dir = /../Android/sdk
```
This varies from OS to OS, so make sure to put the right path.

1. If you want to run it on an emulator, make sure to install one from Android Studio. To do this go to: Android Studio -> More Actions -> Virtual Device Manager -> Create device. In case you want to run it on an real android device, just plug it in through USB. Make you sure you have already upgraded the device to 'developer mode'.

2. Open and run the simulator and then execute the application from the terminal:
```
yarn run android
```


### Android TV

You should have an Android TV simulator on Android Studio.

### Android mobile

You should have an Android mobile simulator on Android Studio.
