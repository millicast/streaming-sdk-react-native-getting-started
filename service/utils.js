import DeviceInfo from 'react-native-device-info';

export function isTV () {
    return DeviceInfo.getDeviceType() === 'Tv'
}