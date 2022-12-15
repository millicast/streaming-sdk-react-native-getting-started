import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SelectList } from 'react-native-dropdown-select-list'
import React from 'react';
import { LogBox } from 'react-native';
import myStyles from './styles.js'


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
        <View style={styles.body}>
            {!isPlaying ? (
                <>
                    <Text style={myStyles.titleSettings}>
                        Codec
                    </Text>

                    <SelectList
                        setSelected={(val) => setCodec(val)}
                        data={data}
                        save="key"
                        placeholder={codec}
                    />

                    <Text></Text>
                </>
            ) : null}

            {isPlaying ? (
                <>
                    <Text style={myStyles.titleSettings}>
                        BitRate
                    </Text>

                    <TextInput
                        onChangeText={setBitrate}
                        value={bitrate}
                    />
                </>) : null}

            <View style={{
                alignItems: "center",
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={myStyles.buttonDesign}>
                    <Text style={myStyles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.white,
        padding: 20,
        margin: 0,
        ...StyleSheet.absoluteFill
    },
});