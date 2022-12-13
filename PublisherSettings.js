import {
    Text,
    Button,
    TextInput,
} from 'react-native';



export default function PublisherSettings({ route, navigation }) {
    const { codec } = route.params;

    return (
        <>
            <Text>
                Codec
            </Text>
            {/*
            <TextInput
                onChangeText={this.setCodec}
                value={this.state.codec}
            />
    */
                console.log(this.getCodec)
            }
            <Button title="Save" onPress={() => navigation.goBack()} />
        </>
    )
}
