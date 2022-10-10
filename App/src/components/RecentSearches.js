import { StyleSheet, View, FlatList, Text, Keyboard } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Recent_Searches } from '../navigation/tmp_data';

export default function RecentSearches() {

  const renderSearchPhrase = ({ item }) => (
    <View style={styles.searchPhrase}>
        <FontAwesome5 name='history' size='20px'/>
        <Text style={styles.searchPhraseText}>{item.phrase}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Recent_Searches}
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
    fontSize: '16px',
    marginLeft: 30
  }
});