import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const theme = StyleSheet.create({
  video: {
    flex: 1,
    position: 'relative',
    zIndex: -1, // works on ios
    elevation: -1, // works on android,
    top: 0,
  },
  videoMultiView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  footer: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: '#A3F',
    color: '#FFF',
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
    fontWeight: '700',
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    marginTop: '8%',
    lineHeight: 24,
  },
  buttonDesign: {
    width: '85%',
    alignItems: 'center',
  },
  buttonMultiview: {
    width: '80%',
    height: '25%',
    alignItems: 'center',
    marginTop: '0%',
    marginBottom: '0%',
  },
  container: {
    ...StyleSheet.absoluteFill,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14141A',
  },
  screenMediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#474747',
  },
  title: {
    height: '20%',
    color: 'white',
    fontWeight: '700',
    fontSize: 30,
  },
  bottomMultimediaContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: '#34343B',
    borderWidth: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#14141A',
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  topViewerCount: {
    position: 'absolute',
    top: '2%',
    right: '2%',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    textShadowColor: 'white',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  titleSettings: {
    fontWeight: 'bold',
  },
});

module.exports = theme;
