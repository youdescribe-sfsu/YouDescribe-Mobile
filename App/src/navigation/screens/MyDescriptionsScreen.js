import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import VideoCardsList from "../../components/VideoCardsList";
import { getUser } from "../../contexts/UserContext";
import videosApi from "../../api/videosApi";

export default function MyDescriptionsScreen({navigation}) {

  const user = getUser();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if(user){
      const getVideos = async () => {
        const videos = await videosApi.getUserVideos(user._id)
        setVideos(videos);
      }
      getVideos();
    }
  },[user]);

  if(!user){
    return(
      <View style={styles.container}>
        <Text>Sign In to your account in order to view your descriptions.</Text>
      </View>
    );
  }
  return (
    <VideoCardsList videos={videos} buttons= "edit" navigation={navigation}></VideoCardsList>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});