import { AppStyleSheet as StyleSheet } from '@dolbyio/uikit-react-native';

const styles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    headerViewWrapperTV: {
      flexDirection: 'row',
      height: 75,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    streamListSectionHeaderWrapper: {
      flexDirection: 'row',
      flex: 1,
    },
    streamListSectionHeaderText: {
      flexDirection: 'row',
      flex: 1,
    },
    noStreamsMessageWrapper: {
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -100,
    },
  });
export default styles;
