import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { getDescriptionActivity, setDescriptionActivity } from '../contexts/DescriptionActivityContext';

export default function DescriptionOptions() {

    const isDescriptionActive = getDescriptionActivity();
    const updateisDescriptionActive = setDescriptionActivity();
    const toggleDescriptionActivity = () => {
        const newStatus = isDescriptionActive ? 'Off' : 'On';
        Alert.alert(
            `Descriptions ${newStatus}`,
            `The audio descriptions for this video has been turned ${newStatus}`
        );
        updateisDescriptionActive(!isDescriptionActive);
    }

    const comingSoonAlert = () => {
        Alert.alert(
            "Feature Not Available",
            "We're sorry! This feature is not yet available on our app. Please visit www.youdescribe.org in order to add or edit an audio description."
        );
    }

    if(isDescriptionActive){
        return (
            <View style={styles.container}>
                <Text>Other Description Options</Text>
                <TouchableOpacity style={styles.button} onPress={toggleDescriptionActivity}>
                    <Text style={styles.buttonText}>Turn Off Descriptions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={comingSoonAlert}>
                    <Text style={styles.buttonText}>Add Description</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>Descriptions Off</Text>
                <TouchableOpacity style={styles.button} onPress={toggleDescriptionActivity}>
                    <Text style={styles.buttonText}>Turn On Descriptions</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        marginHorizontal: 20,
        marginVertical: 10
    },
    button: {
        width: 200,
        height: 36,
        backgroundColor: '#384488',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px'
    }
});