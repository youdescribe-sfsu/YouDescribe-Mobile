import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import VideoPlayer from '../../components/VideoPlayer';
import VideoInfo from "../../components/VideoInfo";

import videosApi from "../../api/videosApi";

export default function VideoScreen({ route }) {
    const video = route.params.video;
    const [audioDescriptions, setAudioDescriptions] = useState([]);

    const getAudioDescriptions = async () => {
        const audioDescriptions = await videosApi.getAudioDescriptions(video.videoId);
        setAudioDescriptions(audioDescriptions);
    }

    useEffect(() => {
        getAudioDescriptions();
    },[]);

    let audioDescribers = [];
    if(audioDescriptions){
        audioDescriptions.forEach((description) => {
            audioDescribers.push(<Text key={description._id}>{description.user.name}</Text>);
        });
    }

    return (
        <View style={styles.container}>
            <VideoPlayer video={video}/>
            <VideoInfo video={video}/>
            {audioDescribers}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    }
});