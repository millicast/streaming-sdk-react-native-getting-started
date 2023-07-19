import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import { mediaDevices, RTCView } from 'react-native-webrtc';
// import { MILLICAST_STREAM_NAME, MILLICAST_PUBLISHING_TOKEN } from '@env'

// Import the required classes
import { Director, Publish } from '@millicast/sdk/dist/millicast.debug.umd'
import myStyles from './styles.js'
// import { Ionicons } from 'react-native-vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import PublisherSettings from './PublisherSettings'

var MILLICAST_STREAM_NAME = '...'
var MILLICAST_PUBLISHING_TOKEN = '...'

class MillicastWidget extends React.Component {
    constructor(props) {
        super(props)
        this.millicastPublish = null
        this.state = {
            mediaStream: null,
            stream: null,
            codec: 'vp8',
            mirror: true,
            playing: false,
            audioEnabled: true,
            videoEnabled: true,
            timePlaying: 0, // in seconds
            userCount: 0,
            bitrate: 0,
        }

        this.styles = myStyles
    }

    componentWillUnmount() {
        this.stop()
        this.setState({ mediaStream: null })
        this.setState({ stream: null })
        this.setState({ codec: 'vp8' })
        this.setState({ mirror: false })
        this.setState({ playing: false })
        this.setState({ audioEnabled: true })
        this.setState({ videoEnabled: true })

        clearInterval(this.interval)
    }

    componentDidMount() {
        this.interval = setInterval(
            () => {
                if (this.state.playing) {
                    this.setState({ timePlaying: this.state.timePlaying + 1 })
                }
            },
            1000
        );
    }

    toggleCamera = () => {
        this.state.mediaStream.getVideoTracks().forEach((track) => {
            track._switchCamera()
        })
        this.setState({ mirror: !this.state.mirror })
    }

    start = async () => {
        if (!this.state.mediaStream) {
            let medias;
            try {
                medias = await mediaDevices.getUserMedia({
                    video: this.state.videoEnabled,
                    audio: this.state.audioEnabled
                });
                this.setState({ mediaStream: medias });
                this.publish(this.props.streamName, this.props.token)
            } catch (e) {
                console.error(e);
            }
        }

        if (this.millicastPublish) {
            // State of the broadcast
            this.connectionState()

            this.millicastPublish.on('broadcastEvent', (event) => {
                const { name, data } = event
                if (name === 'viewercount') {
                    this.setState({ userCount: data.viewercount })
                }
            })
        }
    }

    setCodec = (value) => {
        this.setState({
            codec: value
        })
    }

    setBitrate = async (value) => {
        this.setState({
            bitrate: value
        })
        await this.millicastPublish.webRTCPeer.updateBitrate(value)
    }

    stop = () => {
        if (this.state.playing) {
            this.millicastPublish.stop();
            if (this.state.mediaStream) {
                this.state.mediaStream.release();
                this.setState({
                    mediaStream: null
                });
            }
            this.setState({ timePlaying: 0 })
        }

        if (this.millicastPublish) {
            this.connectionState()
        }
    };

    connectionState = () => {
        // State of the broadcast
        this.millicastPublish.on('connectionStateChange', (event) => {
            if (event === 'connected' || event === 'disconnected' || event === 'closed') {
                this.setState({ playing: !this.state.playing });
            }
        })
    }

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
            codec: this.state.codec,
            events: ["active", "inactive", "vad", "layers", "viewercount"]
        }

        // Start broadcast
        try {
            await this.millicastPublish.connect(broadcastOptions)
        } catch (e) {
            console.log('Connection failed, handle error', e)
        }
    }

    handleClickPlay = () => {
        if (!this.state.playing) {
            this.start()
        } else {
            this.stop()
        }
    }

    handleClickMute = () => {
        this.state.mediaStream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled
        })
        this.setState({ audioEnabled: !this.state.audioEnabled });
    }

    handleClickDisableVideo = () => {
        this.state.mediaStream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled
        })
        this.setState({ videoEnabled: !this.state.videoEnabled });
    }

    showTimePlaying = () => {
        let time = this.state.timePlaying

        let seconds = '' + time % 60
        let minutes = '' + Math.floor(time / 60) % 60
        let hours = '' + Math.floor(time / 3600)

        if (seconds < 10) {
            seconds = '0' + seconds
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (hours < 10) {
            hours = '0' + hours
        }

        return hours + ':' + minutes + ':' + seconds
    }

    render() {
        const { navigation } = this.props;

        return (
            <SafeAreaView style={styles.body}>
                {
                    this.state.mediaStream ?
                        <RTCView streamURL={this.state.mediaStream.toURL()} style={this.styles.video} objectFit='contain' mirror={this.state.mirror} />
                        :
                        null
                }

                <View style={myStyles.topViewerCount}>
                    {/* <Ionicons name="ios-person" size={30} color="#7f00b2" /> */}
                    <Text style={myStyles.textShadow}>
                        {`${this.state.userCount}`}
                    </Text>
                </View>

                <Text style={[myStyles.bottomBarTimePlaying, myStyles.textShadow]}>
                    {this.state.playing ? `${this.showTimePlaying()}` : ''}
                </Text>

                <View style={myStyles.bottomMultimediaContainer}>
                    <View style={myStyles.bottomIconWrapper}>
                        <TouchableOpacity onPress={this.handleClickPlay} >
                            <Text>
                                {!this.state.playing ? <Text> Play </Text> : <Text> Pause </Text>}
                            </Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={this.toggleCamera} >
                            <Text>
                                {!!this.state.playing && <Ionicons name="md-camera-reverse" size={30} color="#7f00b2" />}
                            </Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity onPress={this.handleClickMute} >
                            <Text>
                                {!!this.state.playing && (this.state.audioEnabled ? <Text> Mic On </Text> : <Text> Mic Off </Text>)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.handleClickDisableVideo} >
                            <Text>
                                {!!this.state.playing && (!this.state.videoEnabled ? <Text> Camera On </Text> : <Text> Camera Off </Text>)}
                            </Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => navigation.navigate('Publisher Settings', {
                            codec: this.state.codec,
                            bitrate: this.state.bitrate,
                            setCodec: this.setCodec.bind(this),
                            isPlaying: this.state.playing,
                            setBitrate: this.setBitrate.bind(this)
                        })} >
                            <Text>
                                <Ionicons name="md-settings" size={30} color="#7f00b2" />
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

            </SafeAreaView>
        )
    }
};

function PublisherMain(props) {
    return (
        <>
            {/* <StatusBar barStyle="dark-content" /> */}
            <SafeAreaView style={styles.body}>
                <MillicastWidget streamName={MILLICAST_STREAM_NAME} token={MILLICAST_PUBLISHING_TOKEN} {...props} />
            </SafeAreaView>
        </>
    )
}

const PublisherStack = createNativeStackNavigator();

export default function App(props) {
    return (
        <PublisherStack.Navigator screenOptions={{ headerShown: false }}>
            <PublisherStack.Screen name="Publisher Main" component={PublisherMain} {...props} />
            {/* <PublisherStack.Screen name="Publisher Settings" component={PublisherSettings} {...props} /> */}
        </PublisherStack.Navigator>

    );
}

const styles = StyleSheet.create({
    body: {
        // backgroundColor: Colors.white,
        padding: 0,
        margin: 0,
        ...StyleSheet.absoluteFill
    },
    stream: {
        flex: 1
    },
    footer: {
        // backgroundColor: Colors.lighter,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});