import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import VideoCard from './VideoCard';
// Importing temporary data to create a basic UI component.
// TODO: Fetch data from API to replace the temporary data.
// import { DATA } from '../navigation/tmp_data';
import sampleApi from '../api/sampleApi';

export default function VideoCardsList(props) {

  const [videoData, setVideoData] = useState([]);

  const getVideos = async () => {
    const allVideos = await sampleApi.getAllVideos();
    console.log(allVideos);
    setVideoData(allVideos);
  }

  useEffect(() => {
    getVideos();
  },[]);

  const renderVideo = ({ item }) => (
    <VideoCard video={item} buttons={props.buttons} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videoData}
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