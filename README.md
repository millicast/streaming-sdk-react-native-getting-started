## React Native TV Sample App

### tvOS

- It is required to have WebRTC.framework m112 build for tvOS. Place your build directory inside the ios folder.

Clone this repository and move to tvapp branch.
Execute `yarn` to install dependencies.
Then execute ``cd ios && pod install``.

Create `.env` inside the root folder with the following credentials:

`MILLICAST_STREAM_NAME=`

`MILLICAST_ACCOUNT_ID=`

`MILLICAST_PUBLISHING_TOKEN=`

### Xcode settings

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

### Android TV

You should have an Android TV Simulator in Android Studio.

Clone this repository and move to tvapp branch.
Execute `yarn` to install dependencies.

Inside android directory, create a file called local.properties and add the path to the sdk directory as follows:
`sdk.dir = /../Android/sdk`

Open and run de Android TV simulator and then execute the application from the terminal with `yarn run android`.