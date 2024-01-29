import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
      backgroundColor: '#14141A',
    },
    bottomIconWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    indicatorPosition: {
      position: 'absolute',
      left: 20,
      marginTop: 280,
    },
  });
export default styles;
