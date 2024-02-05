import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    container: {
      backgroundColor: '#14141A',
      ...StyleSheet.absoluteFill,
    },
    bottomMultimediaContainer: {
      width,
      alignItems: 'stretch',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderTopColor: '#34343B',
      borderWidth: 0,
      position: 'absolute',
      bottom: 0,
    },
    bottomIconWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    indicatorLayout: {
      position: 'absolute',
      left: '3%',
      top: '38%',
    },
    video: {
      flex: 1,
      zIndex: -1, // works on ios
      elevation: -1, // works on android,
    },
    videoContainer: {
      flex: 1,
      alignSelf: 'center',
    },
  });

export default styles;
