import { StyleSheet, View, FlatList, Text, Keyboard, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSearchUpdate } from "../contexts/SearchContext";

export default function RecentSearches() {

  const updateSearchTerm = useSearchUpdate();
  const [recentSearches, setRecentSearches] = useState(null);

  const renderSearchPhrase = ({ item }) => (
    <TouchableOpacity style={styles.searchPhrase} onPress={() => updateSearchTerm(item.phrase)}>
        <FontAwesome5 name='history' size={20}/>
        <Text style={styles.searchPhraseText}>{item.phrase}</Text>
    </TouchableOpacity>
  );

  const fetchRecentSearches = async () => {
    let searches = await AsyncStorage.getItem("recentSearches");
    if(searches){
      searches = JSON.parse(searches);
    } else {
      searches = [];
    }
    setRecentSearches(searches);
  }

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  if(recentSearches === null){
    return (
      <View></View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recentSearches || []}
        renderItem={renderSearchPhrase}
        keyExtractor={search => search.id}
        style={styles.recentSearchList}
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    width: '100%'
  },
  recentSearchList: {
    width: '100%',
    paddingLeft: 15
  },
  searchPhrase: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  searchPhraseText: {
    fontWeight: 'bold', 
    fontSize: 16,
    marginLeft: 30
  }
});