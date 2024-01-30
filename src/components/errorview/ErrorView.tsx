/* eslint-disable react/jsx-props-no-spreading */
import { CustomText, CustomTextProps as UITextProps, IconButton } from '@dolbyio/uikit-react-native';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, Platform, StyleSheet, View } from 'react-native';

export type ErrorViewProps = {
  text: string;
  visible: boolean;
  onClose: () => void;
  testID?: string;
};

type TextProps = {
  errorType: 'streamOffline' | 'networkOffline';
  onClose: () => void;
} & Partial<UITextProps>;

const ErrorView = ({ errorType, onClose, children, ...rest }: TextProps) => {
  const id = errorType === 'streamOffline' ? 'streamOffline' : 'networkDisconnected';
  const subtitleId = errorType === 'streamOffline' ? 'streamOfflineSubtitle' : 'networkDisconnectedSubtitle';
  const { isTV } = Platform;
  const [modalVisible, setModalVisible] = useState(true);
  let topPadding = 0;
  if (Platform.OS === 'ios' && !Platform.isTV) {
    topPadding = 40;
  }

  return (
    <Modal
      onRequestClose={() => {
        setModalVisible(false);
        onClose();
      }}
      visible={modalVisible}
    >
      <View style={stylesContainer.container}>
        <View style={{ flexDirection: 'row', paddingTop: topPadding }}>
          <View style={stylesContainer.indicatorContainer}>
            <CustomText {...rest} style={stylesContainer.indicator} type="bodySmall">
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
                  setModalVisible(false);
                  onClose();
                }}
              />
            </View>
          )}
        </View>
        <View style={stylesContainer.textContainer}>
          <View style={{ padding: 5 }}>
            <CustomText
              {...rest}
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
            <CustomText {...rest} style={stylesContainer.paragraph} type="paragraph" align="center">
              <FormattedMessage id={subtitleId} />
            </CustomText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesContainer = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
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
