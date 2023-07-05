import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";

export default function DescribeButton() {

    const comingSoonAlert = () => {
        Alert.alert(
            "Feature Not Available",
            "We're sorry! This feature is not yet available on our app. Please visit www.youdescribe.org in order to add or edit an audio description."
        );
    }

    return (
        <TouchableOpacity onPress={comingSoonAlert}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Describe</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 30,
        backgroundColor: '#384488',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12
    }
});