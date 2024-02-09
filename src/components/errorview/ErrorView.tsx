/* eslint-disable react/jsx-props-no-spreading */
import { CustomText, IconButton } from '@dolbyio/uikit-react-native';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DeviceEventEmitter, Platform, StyleSheet, View } from 'react-native';

const ErrorView = (props) => {
  const { navigation, route } = props;
  const type = route.params.errorType;
  const id = type === 'streamOffline' ? 'streamOffline' : 'networkDisconnected';
  const subtitleId = type === 'streamOffline' ? 'streamOfflineSubtitle' : 'networkDisconnectedSubtitle';
  const { isTV } = Platform;
  let topPadding = 0;
  if (Platform.OS === 'ios' && !Platform.isTV) {
    topPadding = 40;
  }

  return (
    <View style={stylesContainer.container}>
      <View style={{ flexDirection: 'row', paddingTop: topPadding }}>
        <View style={stylesContainer.indicatorContainer}>
          <CustomText style={stylesContainer.indicator} type="bodySmall">
            <FormattedMessage id="streamOfflineNotLiveBadge" />
          </CustomText>
        </View>
        {!isTV && (
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', padding: 10 }}>
            <IconButton
              style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}
              variant="circle"
              backgroundColor="grey"
              icon="close"
              size="xs"
              onPress={() => {
                navigation.goBack();
                DeviceEventEmitter.emit('event.errorView.close');
              }}
            />
          </View>
        )}
      </View>
      <View style={stylesContainer.textContainer}>
        <View style={{ padding: 5 }}>
          <CustomText
            style={{
              textAlign: 'center',
            }}
            type="H2"
            align="center"
          >
            <FormattedMessage id={id} />
          </CustomText>
        </View>
        <View>
          <CustomText style={stylesContainer.paragraph} type="paragraph" align="center">
            <FormattedMessage id={subtitleId} />
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const stylesContainer = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#14141A',
    ...StyleSheet.absoluteFill,
  },
  indicatorContainer: {
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    alignSelf: 'flex-start',
    backgroundColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 50,
  },
  paragraph: {
    alignSelf: 'center',
    paddingTop: 10,
  },
});

export default ErrorView;
