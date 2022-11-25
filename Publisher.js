import {
    Button,
    SafeAreaView,
    StyleSheet,
    View,
    StatusBar,
    TextInput,
    Text
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
            mirror: false,
            playing: false,
            audioEnabled: true,
            videoEnabled: true
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
            track._switchCamera()
        })
    }

    updateDevices = async () => {
        let medias;
        try {
            medias = await mediaDevices.getUserMedia({ video: this.state.videoEnabled, audio: this.state.audioEnabled })
            this.setState({ mediaStream: medias })
        } catch (e) {
            console.error(e)
        }
    };

    start = async () => {
        if (!this.state.mediaStream) {
            let medias;
            try {
                medias = await mediaDevices.getUserMedia({ video: this.state.videoEnabled, audio: this.state.audioEnabled });
                this.setState({ mediaStream: medias });
                this.publish(this.props.streamName, this.props.token)
            } catch (e) {
                console.error(e);
            }
        }
    }

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

        // Create a new instance
        this.millicastPublish = new Publish(streamName, tokenGenerator)

        this.setState({
            streamURL: this.state.mediaStream
        })
        
        // Publishing Options
        const broadcastOptions = {
            mediaStream: this.state.mediaStream,
            codec: this.state.codec
        }

        // Start broadcast
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
        this.state.mediaStream.getAudioTracks().forEach((track) =>  {
            track.enabled = !track.enabled
        })
        this.setState({audioEnabled: !this.state.audioEnabled});
    }

    handleClickDisableVideo = () => {
        this.state.mediaStream.getVideoTracks().forEach((track) =>  {
            track.enabled = !track.enabled
        })
        this.setState({videoEnabled: !this.state.videoEnabled});
    }

    handleClickMirrorVideo = () => {
        this.setState({ mirror: !this.state.mirror })
    }

    render() {
        return (
            <View style={styles.body}>
                {
                    this.state.mediaStream ?
                        <RTCView streamURL={this.state.mediaStream.toURL()} style={this.styles.video} objectFit='contain' mirror={this.state.mirror} />
                        :
                        <Text>
                            No video is being published.
                        </Text>
                }
                <View style={styles.footer}>
                    <TextInput
                        onChangeText={this.setCodec}
                        value={this.state.codec}
                    />
                    <Button
                        title={ !this.state.playing ? "Play" : "Pause" }
                        onPress={ this.handleClickPlay } />
                    { !!this.state.playing && <Button
                                                title={ "Switch Camera" }
                                                onPress={ this.toggleCamera } /> }
                    { !!this.state.playing && <Button
                                                title={ !this.state.audioEnabled ? "Mute" : "Unmute" }
                                                onPress={ this.handleClickMute } /> }
                    { !!this.state.playing && <Button
                                                title={ !this.state.videoEnabled ? "Enable video" : "Disable video" }
                                                onPress={ this.handleClickDisableVideo } /> }
                    { !!this.state.playing && <Button
                                                title={ "Mirror video" }
                                                onPress={ this.handleClickMirrorVideo } /> }
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
