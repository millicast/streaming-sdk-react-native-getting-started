import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#292930E5',
    marginTop: 100,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  innerContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  streamInfoContainer: {
    marginTop: 60,
    marginHorizontal: 16,
  },
  closeIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
export default styles;
