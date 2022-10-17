import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import VideoCard from './VideoCard';
import videosApi from '../api/videosApi';

export default function VideoCardsList(props) {

  const [videoData, setVideoData] = useState([]);

  const getVideos = async () => {
    const allVideos = await videosApi.getVideosData();
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