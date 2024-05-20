# Dolby.io Interactive Player React Native

## Overview

This project demonstrates a multiview Realtime Streaming Viewing sample app.

| Use cases                        | Features                                                         | Tech Stack   |
| -------------------------------- | ---------------------------------------------------------------- | ------------ |
| Multisource video stream monitor | Start a stream monitoring with a stream name and account ID pair | React Native |

## Requirements and supported platforms

The application is meant to run on mobile (Android and iOS) and TV (Android and tvOS).

### Environment Set Up

- We recommend using `yarn`, if you previously haven't installed yarn, please execute the below command:

```
npm install --global yarn
```

- For **Android** platforms you will need `Java SDK 11` and Android Studio installed.

## Getting Started

To get started with building this app, you will need a Dolby.io account.

### Pre-requisites

- Dolby account
- It is required to have Java SDK 11
- Yarn installed
- Xcode 15.2
- Android Studio Dolphin
- Android API 33
- Ruby version 3.1 or higher
- Bundler

#### How to get a Dolby.io account

To set up your [Dolby.io](https://dolby.io/) account, go to the [Dolby.io](https://dolby.io/) dashboard and complete the form. After confirming your email address, you will be logged in.
If you did not receive a verification email, check your Spam or Junk email folders.

#### Setting Up the Project in Android

In case you want to run the app on Android, be sure to create a file `/android/local.properties` with the following content:

```
sdk.dir = PATH_ANDROID_SDK
```

Where `PATH_ANDROID_SDK` should be replaced by your Android SDK path.

## How to build and run the React Native Sample App

### Apple

The following steps are common for all Apple devices.

1. Clone this repository.

2. Install the dependencies:

```
yarn
```

3. Then, execute:

```
cd ios && bundle install

export GITHUB_PERSONAL_ACCESS_TOKEN=<YOUR_PERSONAL_ACCESS_TOKEN>

bundle exec pod install
```

#### iOS

1. Open Xcode.
2. Select `Open a project from a file` and then select `/streaming-sdk-react-native-getting-started/ios/TestApp.xcworkspace`.
3. Select `TestApp project`, then `TestApp` target.
4. Select `TestApp` project and use any iOS simulator or device.
5. Run the project, you should see the app with a home screen where you can enter a Stream name and Account Id to view.

#### tvOS

1. Open Xcode.
2. Select `Open a project from a file` and then select `/streaming-sdk-react-native-getting-started/ios/TestApp.xcworkspace`.
3. Select `TestApp project`, then `TestApp-tvOS` target.
4. Select `TestApp-tvOS` project and use any tvOS simulator or device.
5. Run the project, you should see the app with a home screen where you can enter a Stream name and Account Id to view.

To navigate use the arrow keys and enter button. Also, on the Simulator window you can go to `Window -> Show Apple TV Remote` and use it.

### Android

The following steps are common for all Android devices.

1. Clone this repository.
2. To install dependencies, run:

```
yarn
```

3. Inside the `android` directory, create a file called `local.properties` which only content should be the path of the Java SDK directory, this should look like this:

```
sdk.dir = /../Android/sdk
```

4. If you want to run it on an emulator, make sure to have installed one on Android Studio (mobile or TV). To do this go to: `Android Studio -> More Actions -> Virtual Device Manager -> Create device`. In case you want to run it on a real Android device, just plug it in through USB. Make sure you have already upgraded the device to 'developer mode'.

5. Open and run the simulator and then execute the application from the terminal:

```
yarn run android
```

You should have an Android TV/mobile simulator on Android Studio or a device connected.

## Troubleshooting

### WebRTC related errors during runtime

If you have any issues related to WebRTC, and you already used this app it maybe due to an outdated node module. Follow this steps:

1. Delete `node_modules` directory.
2. Run `yarn cache clean`.
3. Re install dependencies with `yarn` command.
4. Continue with [Getting Started](#getting-started).

## License

Please refer to [LICENSE](https://github.com/millicast/streaming-sdk-react-native-getting-started/blob/main/LICENSE) file.

## More resources

Looking for more sample apps and projects? Head to the [Project Gallery](https://docs.dolby.io/communications-apis/page/gallery).
