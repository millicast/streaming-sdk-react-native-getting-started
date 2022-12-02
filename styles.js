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
        backgroundColor: '#6C0AC3',
        color: '#FFF',
        width: "70%",
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: '600',
        padding: "2%",
        fontSize:  20,
        marginTop: '8%'
    },
    buttonDesign:{
        width:'60%',
        height:'10%',
        alignItems: 'center'
    },
    container: {
        backgroundColor: Colors.white,
        ...StyleSheet.absoluteFill
    },
    screenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems:"center",
        backgroundColor: '#FFF'
    },
    screenMediaContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems:"center",
        backgroundColor: '#474747',
        width:'100%'
    },
    title:{
        height: '20%',
        color: "#6C0AC3",
        fontWeight: 'bold',
        fontSize:  20
      }
})

module.exports = myStyles;