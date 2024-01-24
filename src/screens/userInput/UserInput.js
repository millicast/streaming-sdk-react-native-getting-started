import { Layout, Text } from '@dolbyio/uikit-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import makeStyles from './UserInput.style';

export const UserInput = ({ navigation }) => {
  const styles = makeStyles();
  return (
    <Layout testID="WelcomeScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <Text type="h1" align="center" style={{ paddingTop: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
