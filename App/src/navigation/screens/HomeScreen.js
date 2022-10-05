import { StyleSheet, Text, View, FlatList } from 'react-native';

import VideoCard from '../../components/VideoCard';

const DATA = [
  {
    id: '1',
    title: 'First Video',
    channel: 'Channel 1',
    thumbnail: `https://www.akc.org/wp-content/uploads/2020/07/Golden-Retriever-puppy-standing-outdoors-500x486.jpg`
  },
  {
    id: '2',
    title: 'Second Video',
    channel: 'Channel 2',
    thumbnail: `https://www.akc.org/wp-content/uploads/2020/07/Golden-Retriever-puppy-standing-outdoors-500x486.jpg`
  },
  {
    id: '3',
    title: 'Third Video',
    channel: 'Channel 3',
    thumbnail: `https://www.thebeardenpack.com/wp-content/uploads/2020/08/golden-retriever-rescue.jpg`
  },
  {
    id: '4',
    title: 'Fourth Video',
    channel: 'Channel 4',
    thumbnail: `https://www.akc.org/wp-content/uploads/2020/07/Golden-Retriever-puppy-standing-outdoors-500x486.jpg`
  },
  {
    id: '5',
    title: 'Fifth Video',
    channel: 'Channel 5',
    thumbnail: `https://www.thebeardenpack.com/wp-content/uploads/2020/08/golden-retriever-rescue.jpg`
  },
  {
    id: '6',
    title: 'Sixth Video',
    channel: 'Channel 6',
    thumbnail: `https://www.thebeardenpack.com/wp-content/uploads/2020/08/golden-retriever-rescue.jpg`
  },
  {
    id: '7',
    title: 'Seventh Video',
    channel: 'Channel 7',
    thumbnail: `https://www.akc.org/wp-content/uploads/2020/07/Golden-Retriever-puppy-standing-outdoors-500x486.jpg`
  },
  {
    id: '8',
    title: 'Eighth Video',
    channel: 'Channel 8',
    thumbnail: `https://www.thebeardenpack.com/wp-content/uploads/2020/08/golden-retriever-rescue.jpg`
  },
  {
    id: '9',
    title: 'Ninth Video',
    channel: 'Channel 9',
    thumbnail: `https://www.akc.org/wp-content/uploads/2020/07/Golden-Retriever-puppy-standing-outdoors-500x486.jpg`
  },
];

export default function HomeScreen() {

  const renderVideo = ({ item }) => (
    <VideoCard video={item}  />
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
