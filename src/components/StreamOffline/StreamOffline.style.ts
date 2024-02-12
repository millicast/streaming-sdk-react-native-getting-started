import { AppStyleSheet as StyleSheet } from '@dolbyio/uikit-react-native';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: height / 3,
  },
});
export default styles;
