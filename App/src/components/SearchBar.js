import { TextInput, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";

import { useSearchUpdate } from "../contexts/SearchContext";

export default function SearchBar() {
    const [input, setInput] = useState("");
    const updateSearchTerm = useSearchUpdate();

    const onSubmit = () => {
        updateSearchTerm(input);
        setInput("");
        Keyboard.dismiss;
    }

    return (
        <TextInput
            style={styles.input}
            placeholder="Search Videos"
            onSubmitEditing={onSubmit}
            value={input}
            onChangeText={(text) => setInput(text)}
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