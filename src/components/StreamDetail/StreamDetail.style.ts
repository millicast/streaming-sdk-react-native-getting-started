import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    backgroundColor: '#34343B',
    borderRadius: 4,
    minHeight: 83,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 24,
    flex: 1,
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  streamNameText: {
    paddingBottom: 3,
  },
  accountIdTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIdText: {
    paddingRight: 5,
  },
});
export default styles;
