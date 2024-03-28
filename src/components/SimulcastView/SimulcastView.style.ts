import { AppStyleSheet as StyleSheet } from '@dolbyio/uikit-react-native';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#292930E5',
    marginTop: 100,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  outerContainerTV: {
    height: '30%',
    width: '20%',
    position: 'absolute',
    backgroundColor: '#292930',
    bottom: 20,
    left: '80%',
    borderRadius: 14,
  },
  innerContainer: {
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  simulcastOptionsContainer: {
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
