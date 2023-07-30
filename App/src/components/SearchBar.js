import { TextInput, StyleSheet, Keyboard } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSearch, useSearchUpdate } from "../contexts/SearchContext";

export default function SearchBar() {
    const searchTerm = useSearch();
    const updateSearchTerm = useSearchUpdate();
    const [input, setInput] = useState(searchTerm);

    const onSubmit = async () => {
        updateSearchTerm(input);
        if(input){
            let recentSearches = await AsyncStorage.getItem("recentSearches");
            if(recentSearches){
                recentSearches = JSON.parse(recentSearches);
            } else {
                recentSearches = [];
            }
            let newId = -1;
            if(recentSearches.length === 0){
                newId = 1;
            } else {
                newId = recentSearches[0].id + 1;
            }
            recentSearches.unshift({id: newId, phrase: input});
            if(recentSearches.length > 20){
                recentSearches.pop();
            }
            recentSearches = JSON.stringify(recentSearches);
            await AsyncStorage.setItem("recentSearches", recentSearches);
        }
        Keyboard.dismiss;
    }

    useEffect(() => {
        setInput(searchTerm);
    }, [searchTerm]);

    return (
        <TextInput
            style={styles.input}
            placeholder="Search Videos"
            onSubmitEditing={onSubmit}
            value={input}
            onChangeText={(text) => setInput(text)}
            onBlur={Keyboard.dismiss}
            returnKeyType="search"
            clearButtonMode="while-editing"
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 35,
        width: 300,
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: '#fff',
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#434344'
    }
});