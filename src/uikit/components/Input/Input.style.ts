import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },

  labelContainer: {
    alignSelf: 'flex-start',
    marginStart: 16,
    zIndex: 1,
    elevation: 1,
    position: 'absolute',
    top: -8,
  },

  inputContainer: {
    borderWidth: 2,
    borderRadius: 4,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    zIndex: 0,
  },

  buttonContainer: {
    alignSelf: 'flex-end',
    zIndex: 1,
    elevation: 1,
    position: 'absolute',
  },

  errorContainer: {
    marginTop: 8,
  },
});
