import { useState, useEffect } from 'react';
import VideoCardsList from "../../components/VideoCardsList";

import videosApi from "../../api/videosApi";

export default function HomeScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const getVideos = async() => {
    const videos = await videosApi.getHomeVideos();
    setVideos(videos);
  }

  useEffect(() => {
    getVideos();
  },[]);

  return (
    <VideoCardsList videos={videos} navigation={navigation} ></VideoCardsList>
  );
}