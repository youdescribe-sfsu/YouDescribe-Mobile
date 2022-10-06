import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function EditButton() {
    return (
        <TouchableOpacity>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
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
        fontSize: '12px'
    }
});