import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  squareBtn: {
    width: 48,
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  rectangular: {
    width: 72,
    height: 48,
  },

  circle: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },

  buttonStroke: {
    borderWidth: 1,
  },

  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

export default styles;
