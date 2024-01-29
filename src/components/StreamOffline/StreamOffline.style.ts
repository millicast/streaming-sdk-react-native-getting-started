import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: height / 3,
  },
});
export default styles;
