import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
    borderRadius: 6,
    flexDirection: 'row',
  },
  textAndIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingLeft: 13,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  buttonContainer: { alignSelf: 'center' },
  textStyle: {
    flexWrap: 'wrap',
    flex: 1,
  },
  spacer: {
    width: 8,
  },
});
