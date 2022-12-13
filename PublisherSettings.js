import {
    Text,
    Button,
    TextInput,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import React from 'react';
import { LogBox } from 'react-native';


LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function PublisherSettings({ route, navigation }) {
    const { codec,
        setCodec,
        isPlaying,
        bitrate,
        setBitrate } = route.params;

    const [selected, setSelected] = React.useState("");

    const data = [
        { key: 'vp8', value: 'VP8' },
        { key: 'vp9', value: 'VP9' },
        { key: 'h264', value: 'H264' },
        { key: 'av1', value: 'AV1' },
    ]

    return (
        <>
            {!isPlaying ? (
                <>
                    <Text>
                        Codec
                    </Text>

                    <SelectList
                        setSelected={(val) => setCodec(val)}
                        data={data}
                        save="key"
                        placeholder={codec}
                    />
                </>
            ) : null}

            <Text>
                BitRate
            </Text>

            <Button title="Save" onPress={() => navigation.goBack()} />
        </>
    )
}
