import { AppStyleSheet as StyleSheet } from '@dolbyio/uikit-react-native';

const styles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    recentStreamsInfoText: {
      paddingTop: 8,
      paddingBottom: 20,
    },
    streamListHeaderWrapper: {
      flexDirection: 'row',
      flex: 1,
    },
    recentlyViewedText: {
      paddingRight: 5,
      flex: 1,
    },
    alternateOptionText: {
      paddingTop: 16,
      paddingBottom: 16,
    },
  });
export default styles;
