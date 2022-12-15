import { StyleSheet, Dimensions } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('window');

var myStyles = StyleSheet.create({
    video: {
        flex: 1,
        position: 'relative',
        zIndex: -1, // works on ios
        elevation: -1, // works on android,
        top: 0
    },
    footer: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    buttonText: {
        backgroundColor: '#7f00b2',
        color: '#FFF',
        width: "70%",
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: '600',
        padding: "2%",
        fontSize: 20,
        marginTop: '8%',
        height: 35,
    },
    buttonDesign: {
        width: '60%',
        height: '10%',
        alignItems: 'center'
    },
    buttonMultiview: {
        width: '80%',
        height: '25%',
        alignItems: 'center',
        marginTop: '0%',
        marginBottom: '0%'
    },
    container: {
        backgroundColor: Colors.white,
        ...StyleSheet.absoluteFill
    },
    screenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FFF'
    },
    screenMediaContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#474747'
    },
    title: {
        height: '20%',
        color: "#7f00b2",
        fontWeight: 'bold',
        fontSize: 20
    },
    bottomMultimediaContainer: {
        width: width,
        alignItems: 'center',
        paddingVertical: 10,
        borderColor: '#ADADAD',
        borderWidth: 1,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#C0C0C0'
    },
    bottomIconWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    topViewerCount: {
        position: 'absolute',
        top: '2%',
        right: '2%',
        justifyContent: 'space-between',
        alignItems: 'center',
        /*
        backgroundColor: "white",
        opacity: 0.5,
        borderRadius: 10,
        padding: 10,
        */
    },
    bottomBarTimePlaying: {
        width: '100%',
        bottom: 80,
        textAlignVertical: 'center',
        textAlign: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 0,
        left: 0,
        zIndex: 2, // works on ios
        elevation: 2, // works on android
        fontSize: 30,
    },
    textShadow: {
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: "white",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    titleSettings: {
        fontWeight: 'bold',
    }
})

module.exports = myStyles;