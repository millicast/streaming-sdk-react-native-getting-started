import { StyleSheet } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

var myStyles = StyleSheet.create({
    video: {
        flex: 10,
        position: 'relative',
    },
    footer: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    },
    containerOfButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#43a1c9',
    },
    container: {
        backgroundColor: Colors.white,
        ...StyleSheet.absoluteFill
    }
})

module.exports = myStyles;