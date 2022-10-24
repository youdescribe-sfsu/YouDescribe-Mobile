import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import VideoPlayer from '../../components/VideoPlayer';
import VideoInfo from "../../components/VideoInfo";
import SelectedDescriptionBox from "../../components/SelectedDescriptionBox";
import DescriptionOptions from "../../components/DescriptionOptions";

import videosApi from "../../api/videosApi";

export default function VideoScreen({ route }) {
    const video = route.params.video;
    const [audioDescriptions, setAudioDescriptions] = useState([]);

    const getAudioDescriptions = async () => {
        const audioDescriptions = await videosApi.getAudioDescriptions(video.videoId);
        setAudioDescriptions(audioDescriptions);
    }

    const parseAudioDescriptions = () => {
        const audioDescriptionsIds = [];
        const audioDescriptionsIdsUsers = {};
        const audioDescriptionsIdsAudioClips = {};

        if (audioDescriptions) {
            audioDescriptions.forEach((ad) => {
                if (ad.status === "published") {
                audioDescriptionsIds.push(ad._id);
                audioDescriptionsIdsUsers[ad._id] = ad.user;
                audioDescriptionsIdsUsers[ad._id].overall_rating_votes_counter = ad.overall_rating_votes_counter;
                audioDescriptionsIdsUsers[ad._id].overall_rating_average = ad.overall_rating_average;
                audioDescriptionsIdsUsers[ad._id].overall_rating_votes_sum = ad.overall_rating_votes_sum;
                audioDescriptionsIdsUsers[ad._id].feedbacks = ad.feedbacks;
                audioDescriptionsIdsAudioClips[ad._id] = [];
                if (ad.audio_clips) {
                    ad.audio_clips.forEach((audioClip) => {
                        // audioClip.url = `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
                        audioDescriptionsIdsAudioClips[ad._id].push(audioClip);
                    });
                }
                }
            });
        }
    }

    // let audioDescribers = [];
    // if(audioDescriptions){
    //     audioDescriptions.forEach((description) => {
    //         audioDescribers.push(<Text key={description._id}>{description.user.name}</Text>);
    //     });
    // }

    useEffect(() => {
        getAudioDescriptions();
    },[]);

    return (
        <View style={styles.container}>
            <VideoPlayer video={video}/>
            <VideoInfo video={video}/>
            <SelectedDescriptionBox ad={audioDescriptions} />
            <DescriptionOptions />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    }
});