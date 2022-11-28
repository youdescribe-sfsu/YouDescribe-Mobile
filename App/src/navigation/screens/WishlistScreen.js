import { useState, useEffect } from 'react';
import VideoCardsList from "../../components/VideoCardsList";

import wishlistApi from '../../api/wishlistApi';

export default function WishlistScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const getVideos = async() => {
    const videos = await wishlistApi.getWishlistVideos();
    setVideos(videos);
  }

  useEffect(() => {
    getVideos();
  },[]);

  return (
    <VideoCardsList videos={videos} buttons= "upvote-describe" navigation={navigation}></VideoCardsList>
  );
}