import { Layout, Input } from '@dolbyio/uikit-react-native';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from '../../components/text/Text';

import makeStyles from './UserInput.style';

export const UserInput = ({ navigation }) => {
  const styles = makeStyles();
  const [streamName, setStreamName] = useState<string>('');

  return (
    <Layout testID="UserInputScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <View style={{ paddingTop: 48 }} />
          <Text id="demo" type="h1" align="center" style={{ paddingTop: 16 }} />
          <Input
            value={streamName}
            label="streamNameInputLabel"
            textColor="white"
            onChangeText={() => {}}
            validation={() => {}}
            autoFocus
          />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
