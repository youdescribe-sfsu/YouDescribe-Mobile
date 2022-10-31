import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import { audioClipsUploadsPath } from "../../api/client";

import VideoPlayer from '../../components/VideoPlayer';
import VideoInfo from "../../components/VideoInfo";
import SelectedDescriptionBox from "../../components/SelectedDescriptionBox";
import DescriptionOptions from "../../components/DescriptionOptions";

import videosApi from "../../api/videosApi";

export default function VideoScreen({ route }) {
    const video = route.params.video;
    const [audioDescriptions, setAudioDescriptions] = useState([]);
    const [audioDescriptionsIds, setAudioDescriptionsIds] = useState([]);
    const [audioDescriptionsIdsUsers, setAudioDescriptionsIdsUsers] = useState({});
    const [audioDescriptionsIdsAudioClips, setAudioDescriptionsIdsAudioClips] = useState({});
    const [selectedAudioDescriptionId, setSelectedAudioDescriptionId] = useState("");

    const getAudioDescriptions = async () => {
        const audioDescriptions = await videosApi.getAudioDescriptions(video.videoId);
        setAudioDescriptions(audioDescriptions);
    }

    const parseAudioDescriptions = () => {
        if (audioDescriptions) {
            const adIds = [];
            const adIdsUsers = {};
            const adIdsAudioClips = {};
            audioDescriptions.forEach((ad) => {
                if (ad.status === "published") {
                adIds.push(ad._id);
                adIdsUsers[ad._id] = ad.user;
                adIdsUsers[ad._id].overall_rating_votes_counter = ad.overall_rating_votes_counter;
                adIdsUsers[ad._id].overall_rating_average = ad.overall_rating_average;
                adIdsUsers[ad._id].overall_rating_votes_sum = ad.overall_rating_votes_sum;
                adIdsUsers[ad._id].feedbacks = ad.feedbacks;
                adIdsAudioClips[ad._id] = [];
                if (ad.audio_clips) {
                    ad.audio_clips.forEach((audioClip) => {
                        audioClip.url = `${audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
                        adIdsAudioClips[ad._id].d
                    });
                }
                }
            });
            setAudioDescriptionsIdsUsers(adIdsUsers);
            setAudioDescriptionsIdsAudioClips(adIdsAudioClips);
            setAudioDescriptionsIds(adIds);
        }
    }

    const getHighestRatingADId = () => {
        let selectedId = null;
        if(audioDescriptions){
            selectedId = audioDescriptionsIds[0];
            if(audioDescriptionsIds.length > 1){
                let maxAverage = 0;
                audioDescriptionsIds.forEach((adId) => {
                    let current = audioDescriptionsIdsUsers[adId];
                    if(current.overall_rating_average > maxAverage){
                        maxAverage = current.overall_rating_average;
                        selectedId = adId;
                    }
                });
            }
        }
        return selectedId;
    }

    const setAudioDescriptionActive = () => {
        if(!selectedAudioDescriptionId){
            let adId = getHighestRatingADId();
            if(audioDescriptionsIds.length > 0 && audioDescriptionsIds.indexOf(adId) === -1){
                adId = audioDescriptionsIds[0];
            }
            setSelectedAudioDescriptionId(adId);
        }
    }

    useEffect(() => {
        getAudioDescriptions();
    }, []);

    useEffect(() => {
        parseAudioDescriptions();
    }, [audioDescriptions]);

    useEffect(() => {
        setAudioDescriptionActive();
    }, [audioDescriptionsIds]);

    return (
        <View style={styles.container}>
            <VideoPlayer video={video}/>
            <VideoInfo video={video}/>
            <SelectedDescriptionBox user={audioDescriptionsIdsUsers[selectedAudioDescriptionId]} />
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



// let audioDescribers = [];
// if(audioDescriptions){
//     audioDescriptions.forEach((description) => {
//         audioDescribers.push(<Text key={description._id}>{description.user.name}</Text>);
//     });
// }