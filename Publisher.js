import {
    Button,
    SafeAreaView,
    StyleSheet,
    View,
    StatusBar,
    TextInput
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React from 'react';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import { MILLICAST_STREAM_NAME, MILLICAST_PUBLISHING_TOKEN } from '@env'

// Import the required classes
import { Director, Publish } from '@millicast/sdk/dist/millicast.debug.umd'

class MillicastWidget extends React.Component {
    constructor(props) {
        super(props)
        this.millicastPublish = null
        this.state = {
            mediaStream: null,
            stream: null,
            codec: 'vp8',
            mirror: true, // for switching camera
            playing: false,
            muted: false
        }

        this.styles = StyleSheet.create({
            video: {
                width: '100%',
                height: '100%',
            },
        })
    }

    toggleCamera = () => {
        this.state.mediaStream.getVideoTracks().forEach((track) => {
            track._switchCamera();
            this.setState({
                mirror: !this.state.mirror
            })
        })
    }

    start = async () => {
        if (!this.state.mediaStream) {
            let s;
            try {
                s = await mediaDevices.getUserMedia({ video: true, audio: true });
                this.setState({
                    mediaStream: s
                });
                this.publish(this.props.streamName, this.props.token)
            } catch (e) {
                console.error(e);
            }
        }
    };

    setCodec = (value) => {
        console.log(value);
        this.setState({
            codec: value
        })
    }

    stop = () => {
        this.millicastPublish.stop();
        if (this.state.mediaStream) {
            this.state.mediaStream.release();
            this.setState({
                mediaStream: null
            });
        }
    };

    async publish(streamName, token) {
        const tokenGenerator = () => Director.getPublisher({
            token,
            streamName
        })
        //Create a new instance
        this.millicastPublish = new Publish(streamName, tokenGenerator)

        this.setState({
            streamURL: this.state.mediaStream
        })
        //Publishing Options
        const broadcastOptions = {
            mediaStream: this.state.mediaStream,
            codec: this.state.codec
        }

        //Start broadcast
        try {
            await this.millicastPublish.connect(broadcastOptions)
        } catch (e) {
            console.log('Connection failed, handle error', e)
        }
    }

    handleClickPlay = () => {
        if (!this.state.playing){
            this.start()
        } else {
            this.stop()
        }
        this.setState({playing: !this.state.playing});
    }

    handleClickMute = () => {
        this.setState({muted: !this.state.muted});
        console.log("yet to be implemented")
    }

    render() {
        return (
            <View style={styles.body}>
                {
                    this.state.mediaStream ?
                        <RTCView streamURL={this.state.mediaStream.toURL()} style={this.styles.video} objectFit='contain' mirror={this.state.mirror} />
                        :
                        null
                }
                <View style={styles.footer}>
                    <TextInput
                        onChangeText={this.setCodec}
                        value={this.state.codec}
                    />
                <Button
                    title={ !this.state.playing ? "Play" : "Pause" }
                    onPress={ this.handleClickPlay } />
                <Button
                    title="Switch Camera"
                    onPress={ this.toggleCamera } />
                <Button
                    title={ !this.state.muted ? "Mute" : "Unmute" }
                    onPress={ this.handleClickMute } />
                </View>
            </View>
        )
    }
};

export default function App() {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.body}>
                <MillicastWidget streamName={ MILLICAST_STREAM_NAME } token={ MILLICAST_PUBLISHING_TOKEN } />
            </SafeAreaView>
        </>
    );
}


const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.white,
        ...StyleSheet.absoluteFill
    },
    stream: {
        flex: 1
    },
    footer: {
        backgroundColor: Colors.lighter,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
