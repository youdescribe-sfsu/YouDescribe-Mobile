import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DescriptionOptions() {
    return (
        <View style={styles.container}>
            <Text>Other Description Options</Text>
            <TouchableOpacity style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Turn Off Descriptions</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Add Description</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        marginHorizontal: 20,
        marginVertical: 10
    },
    button: {
        width: 240,
        height: 40,
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
        fontSize: '18px'
    }
});