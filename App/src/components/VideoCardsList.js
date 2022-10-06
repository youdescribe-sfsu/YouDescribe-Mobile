import { StyleSheet, View, FlatList } from 'react-native';

import VideoCard from './VideoCard';
import { DATA } from '../navigation/tmp_data';

export default function VideoCardsList(props) {

  const renderVideo = ({ item }) => (
    <VideoCard video={item} buttons={props.buttons} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderVideo}
        keyExtractor={video => video.id}
        style={styles.videoList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
  videoList: {
    width: '100%',
    paddingHorizontal: 5
  }
});