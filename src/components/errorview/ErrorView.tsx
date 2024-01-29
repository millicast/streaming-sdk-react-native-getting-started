  /* eslint-disable react/jsx-props-no-spreading */
  import { CustomTextProps as UITextProps, IconButton } from '@dolbyio/uikit-react-native';
  import { CustomText } from '@dolbyio/uikit-react-native';
  import React, { useState } from 'react';
  import { FormattedMessage } from 'react-intl';
  import { Modal, Platform, View } from 'react-native';

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
  const id = errorType == 'streamOffline' ? "streamOffline" : "networkDisconnected"
  const subtitleId = errorType == 'streamOffline' ? "streamOfflineSubtitle" : "networkDisconnectedSubtitle"
  const isTV = Platform.isTV;
  const [modalVisible, setModalVisible] = useState(true);
  var topPadding = 0;
  if (Platform.OS === 'ios' && !Platform.isTV) {
    topPadding = 40;
  }
  return (
    <Modal onRequestClose={() => { setModalVisible(false); onClose(); }} visible={modalVisible}>
      <View style={{ flexDirection: 'column', height: '100%', backgroundColor: 'black' }}>
        <View style={{ flexDirection: 'row', paddingTop: topPadding }}>
            <View style={{ justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center', flex: 1 }}>
              <CustomText {...rest} style={{ alignSelf: 'flex-start', backgroundColor: 'grey', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2, marginHorizontal: 10, marginVertical: 20 }} type='bodySmall'>{<FormattedMessage id="streamOfflineNotLiveBadge" />}</CustomText>
            </View>
            {!isTV && <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', padding: 10 }}> 
              <IconButton
                style={{alignSelf: 'flex-end', marginLeft: 'auto'}}
                variant='circle'
                backgroundColor="grey"
                icon="close"
                size="xs"
                onPress={() => { setModalVisible(false); onClose(); }}
              />
            </View>}
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'center',
            alignContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
          }}>
            <View><CustomText {...rest} style={{alignSelf: 'center'}} type='H2'>{<FormattedMessage id={id}/>}</CustomText></View> 
            <View><CustomText {...rest} style={{alignSelf: 'center', paddingTop: 10}} type='bodySmall'>{<FormattedMessage id={subtitleId} />}</CustomText></View>
        </View>
      </View>
    </Modal>
    );
};

export default ErrorView;
