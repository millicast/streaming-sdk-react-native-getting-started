import { AppStyleSheet as StyleSheet } from '@dolbyio/uikit-react-native';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#292930E5',
    marginTop: 100,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  outerContainerTV: {
    height: '51%',
    width: '30%',
    backgroundColor: '#292930',
    bottom: 20,
    left: 20,
    borderRadius: 14,
  },
  innerContainer: {
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  streamInfoContainer: {
    marginTop: Platform.isTV ? 10 : 60,
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
