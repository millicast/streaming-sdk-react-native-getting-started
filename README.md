# Millicast React Native Example App

This is a sample app that showcases the integration between the JS streaming SDK and React Native.

Add a `.env` file in the current path. You can find the following example in `.env.sample` file:

```
MILLICAST_STREAM_NAME=yourStreamName
MILLICAST_ACCOUNT_ID=yourAccountId
MILLICAST_PUBLISHING_TOKEN=yourPublishingToken
```

You will need to find or create a new stream name with a token in your Millicast Dashboard. You can do that following this [link](https://docs.dolby.io/streaming-apis/docs/managing-your-tokens).

You need to set up an emulator or connect a real device in order to run the app.

## Connecting a Real Device

For **Android**:

1. Put you Android device in debug mode following this [tutorial](https://developer.android.com/studio/debug/dev-options).
2. Connect device to your PC and using your specific IDE.
3. Run the app in the detected device.

For **iOS**:

1. Plug in your iPhone, sign in with your iCloud account in XCode.
2. Change the device in your IDE.
4. Build and run in the detected device.


### Setting Up an Emulator with Android Studio

Following the guide above, you should already have your emulator up and running.

Be sure to give access to your computer camera and microphone in order to be able to use it for testing, otherwise the emulator will create a sample video simulating the camera usage.

### Setting Up the Camera

To give your Android emulator access to your camera, go to Android Studio and edit your desired emulator.

<img src="assets/setCameraAndroidStudio.png" alt="drawing" width="500"/>

### Setting Up the Microphone

To give your Android emulator access to your microphone, start you emulator and open the emulator options. Then enable `Virtual headset plug inserted` and `Virtual microphone uses host audio input`.

<img src="assets/setMicAndroidEmulator.png" alt="drawing" width="500"/>

## Setting up Emulator for iOS

If you want to test the Publish feature in iOS you will need an actual Apple device, as the Apple emulator does not allow access to the camera.

## Usage

In order to run the example app, it is necessary to have Yarn installed. You can do this by simply running the following command:

```
npm install --global yarn
```

Now, you are ready to use Yarn in the command line.

To install all the required dependencies, run the following command:
```
yarn
```

To test the example app once the `.env` file is set up, simply run the following command in the root folder:

```
yarn run
```

There you will be asked to lanuch it on Android or iOS.

Once in the app you will be prompted with the home page allowing you to choose between the Publisher and Subscriber (Viewer) apps.

<img src="assets/home.png" alt="drawing" width="500"/>

## Publisher App

In the **Publisher app**, you can play/pause, switch camera, mute/unmute and turn camera on/off, allowing you to keep the viewer user count.

<img src="assets/publisher.png" alt="drawing" width="500"/>

### Publisher Settings

Publisher settings allow you to set the codec (only before the streaming is started) and change the bitrate (only after the streaming is started). By default, the bitrate is set to the maximum one possible.

## Subscriber App

In the **Subscriber app**, you can play/pause, mute/unmute and have access to the multiview functionality.

<img src="assets/viewerScreen.png" alt="drawing" width="500"/>

## Troubleshooting

- It is known that the app may experiment some issues in Samsung phones.
- The codec H264 is known to not reproduce correctly on emulator.