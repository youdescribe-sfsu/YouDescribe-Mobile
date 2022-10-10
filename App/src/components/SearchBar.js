import { TextInput, StyleSheet, Keyboard } from "react-native";

export default function SearchBar() {
    return (
        <TextInput
            style={styles.input}
            placeholder="Search Videos"
            placeholderTextColor="green"
            onSubmitEditing={Keyboard.dismiss}
            onBlur={Keyboard.dismiss}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 35,
        width: 300,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: '#fff',
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#434344'
    }
});