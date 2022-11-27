import { StyleSheet, Text, View } from 'react-native';

import { useSearch } from '../contexts/SearchContext';

export default function SearchResults() {
    const searchTerm = useSearch();
    return (
        <View style={styles.container}>
          <Text>{searchTerm}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});