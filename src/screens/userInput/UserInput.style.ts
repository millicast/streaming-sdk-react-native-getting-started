import { AppStyleSheet as StyleSheet } from '@dolbyio/uikit-react-native';

const styles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    demoButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 32,
      backgroundColor: '#34343B',
    },
    demoButtonInFocus: {
      borderWidth: 2,
      borderColor: '#AA33FF',
    },
  });
export default styles;
