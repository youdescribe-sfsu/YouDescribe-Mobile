import { View, StyleSheet, useWindowDimensions, Modal, Pressable, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import YoutubePlayer from 'react-native-youtube-iframe';
import { Audio } from 'expo-av';

import { audioClipsUploadsPath } from "../../api/client";
import { getDescriptionActivity } from "../../contexts/DescriptionActivityContext";

import ChangeDescriptionModal from "../../components/ChangeDescriptionModal";
import VideoInfo from "../../components/VideoInfo";
import SelectedDescriptionBox from "../../components/SelectedDescriptionBox";
import DescriptionOptions from "../../components/DescriptionOptions";

import videosApi from "../../api/videosApi";

export default function VideoScreen({ route }) {
    console.log("Rerendered!!");
    const deviceWidth = useWindowDimensions().width;
    const isDescriptionActive = getDescriptionActivity();
    const video = route.params.video;
    let videoDurationInSeconds = null;
    const videoPlayerRef = useRef();
    const currentClipRef = useRef(null);
    const [audioDescriptions, setAudioDescriptions] = useState([]);
    const [audioDescriptionsIds, setAudioDescriptionsIds] = useState([]);
    const [audioDescriptionsIdsUsers, setAudioDescriptionsIdsUsers] = useState({});
    const [audioDescriptionsIdsAudioClips, setAudioDescriptionsIdsAudioClips] = useState({});
    const [selectedAudioDescriptionId, setSelectedAudioDescriptionId] = useState("");
    const [audioClips, setAudioClips] = useState([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    // const [currentVideoProgress, setCurrentVideoProgress] = useState(null);
    const [videoVolume, setVideoVolume] = useState(100);
    const [oldVolume, setOldVolume] = useState(50);
    // const [playheadPosition, setPlayheadPosition] = useState(null);
    const [progressWatcher, setProgressWatcher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getAudioDescriptions = async () => {
        console.log("getAudioDescriptions");
        const audioDescriptions = await videosApi.getAudioDescriptions(video.videoId);
        console.log(video);
        setAudioDescriptions(audioDescriptions);
    }

    const parseAudioDescriptions = () => {
        console.log("parseAudioDescriptions");
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
                            // audioClip.url = `../../assets/Y6Hfp3HXCSc/${audioClip.file_name}`;
                            adIdsAudioClips[ad._id].push(audioClip);
                        });
                    }
                }
            });
            // console.log(adIds);
            // console.log(adIdsAudioClips);
            setAudioDescriptionsIdsUsers(adIdsUsers);
            setAudioDescriptionsIdsAudioClips(adIdsAudioClips);
            setAudioDescriptionsIds(adIds);
        }
    }

    const getHighestRatingADId = () => {
        console.log("getHighestRatingADId");
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
        console.log("setAudioDescritionActive");
        if(!selectedAudioDescriptionId){
            let adId = getHighestRatingADId();
            if(audioDescriptionsIds.length > 0 && audioDescriptionsIds.indexOf(adId) === -1){
                adId = audioDescriptionsIds[0];
            }
            setSelectedAudioDescriptionId(adId);
        }
    }

    const preLoadAudioClips = () => {
        console.log("preLoadAudioClips");
        let clips = [];
        if(audioDescriptionsIdsAudioClips
           && selectedAudioDescriptionId
           && audioDescriptionsIdsAudioClips[selectedAudioDescriptionId]
        ){
            clips = audioDescriptionsIdsAudioClips[selectedAudioDescriptionId];
        }
        console.log("Number of Audio Clips: ",clips.length);
        clips.forEach(async (clip, idx) => {
            try {
                const source = { uri: clip.url };
                const initialStatus = {
                    shouldPlay: false,
                    isMuted: false
                };
                const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                clip.sound = sound;
            } catch (e) {
                console.error(e);
            }
        });
        console.log("Setting audio clips");
        setAudioClips(clips);
    }

    const onVPStateChange = (event) => {
        console.log("onVPStateChange");
        switch(event){
            case "playing":
                setIsVideoPlaying(true);
                if(videoDurationInSeconds === null){
                    videoPlayerRef.current?.getDuration().then(duration => {
                        videoDurationInSeconds = duration;
                    });
                }
                if(currentClipRef.current && currentClipRef.current.playbackType === "extended"){
                    console.log("Extended AC! Pause Video.");
                    setIsVideoPlaying(false);
                    // if (currentClipRef.current.audio.playing()){
                    //     pauseAudioClips();
                    // } else {
                    //     currentClipRef.current.audio.play();
                    // }
                } else {
                    // checkSeek();
                    if(isDescriptionActive){
                        startProgressWatcher();
                    }
                }
                break;
            case "paused":
                stopProgressWatcher();
                setIsVideoPlaying(false);
                if(currentClipRef.current && currentClipRef.current.playbackType !== "extended"){
                    pauseAudioClips();
                }
                break;
            case "buffering":
                if(currentClipRef.current && currentClipRef.current.playbackType !== "extended"){
                    currentClipRef.current.audio.stop();
                    currentClipRef.current = null;
                }
                break;
            default:
                break;
        }
    }

    const checkSeek = () => {
        console.log("checkSeek");
        if(selectedAudioDescriptionId && currentClipRef.current){
            currentClipRef.current.audio.stop();
            currentClipRef.current = null;
        }
        let videoTimestamp;
        videoPlayerRef.current?.getCurrentTime().then(currentTime => {
            videoTimestamp = currentTime;
        });
        //round to 2 nearest dec
        videoTimestamp = Math.round(videoTimestamp * 100) / 100;
        for(let i = 0; i < audioClips.length; i++){
            const clip = audioClips[i];
            if(clip.playback_type === "inline"){
                let startTime = Math.round(clip.start_time * 100) / 100;
                let duration = Math.round(clip.duration * 100) / 100;
                if(startTime > videoTimestamp){
                    break;
                }
                if(startTime < videoTimestamp && videoTimestamp < startTime + duration){
                    const diff = videoTimestamp - startTime;
                    playAudioClip(clip, diff);
                    break;
                }
            }
        }
    }

    const startProgressWatcher = () => {
        console.log("startProgressWatcher");
        if(selectedAudioDescriptionId){
            const interval = 141;
            if(progressWatcher){
                stopProgressWatcher();
            }
            const progressWatcher = setInterval(async () => {
                if(videoPlayerRef && videoPlayerRef.current){
                    const currentTime = await videoPlayerRef.current.getCurrentTime();
                    // const volume = await videoPlayerRef.current.getVolume();
                    // setVideoVolume(volume);
                    // setPlayheadPosition( 756 * (currentVideoProgress / videoDurationInSeconds) );
    
                    // TODO: Audio Ducking goes here.
                    if(currentClipRef.current && currentClipRef.current.playbackType === 'inline'){
                        setVideoVolume(5);
                    }
                    const currentVideoProgressFloor = parseFloat(currentTime);
                    // Skipping an audio clip that is stuck in the buffering phase
                    // if(currentClipRef.current &&
                    //    currentVideoProgressFloor > parseFloat(currentClipRef.current.start_time + currentClipRef.current.duration + 0.25)){
                    //     await currentClipRef.current.audio.stopAsync();
                    //     await currentClipRef.current.audio.unloadAsync();
                    //     currentClipRef.current = null;
                    //     console.log("Audio Clip Skipped.");
                    // }
                    // console.log("CurrentVideoProgressFloor ", currentVideoProgressFloor);
                    audioClips.forEach((audioClip, idx) => {
                        if(currentVideoProgressFloor >= parseFloat(parseFloat(audioClip.start_time) - 0.07) &&
                           currentVideoProgressFloor <= parseFloat(parseFloat(audioClip.start_time) + 0.07)){
                            if(!currentClipRef.current){
                                videoPlayerRef.current.getVolume().then(volume => {
                                    setOldVolume(volume);
                                });
                                playAudioClip(audioClip, idx);
                            }
                        }
                    });
                }
            }, interval);
            setProgressWatcher(progressWatcher);
        }
    }

    const stopProgressWatcher = () => {
        console.log("stopProgressWatcher");
        if(progressWatcher){
            clearInterval(progressWatcher);
            setProgressWatcher(null);
        }
    }

    const playAudioClip = async (audioClip, idx, timestamp = null) => {
        try {
            console.log("playAudioClip");
            // console.log("Audio Clip: ", audioClip);
            console.log("Audio Clip Type: ",audioClip.playback_type);
            console.log("Audio Clip Duration: ", parseInt(audioClip.duration*1000));
            console.log("Audio Clip Start Time: ", audioClip.start_time);
            if(currentClipRef.current === null){
                console.log("Index: ", idx);
                currentClipRef.current = {
                    audio: audioClip.sound,
                    playbackType: audioClip.playback_type,
                    duration: audioClip.duration,
                    start_time: audioClip.start_time
                };
                // console.log(currentClipRef.current);
                if(timestamp){
                    await audioClip.sound.setPositionAsync(timestamp);
                }
                if(audioClip.playback_type === "extended"){
                    setIsVideoPlaying(false);
                }
                // const status = await audioClip.sound.getStatusAsync();
                // if(!status.isLoaded){
                //     await audioClip.sound.loadAsync();
                // }
                await audioClip.sound.playAsync();
                // let vol = await videoPlayerRef.current.getVolume();
                // console.log("Current video volume is ", vol);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const pauseAudioClips = async () => {
        try {
            console.log("pauseAudioClips");
            if(currentClipRef.current){
                if(currentClipRef.current.playbackType === 'inline'){
                    await currentClipRef.current.audio.stopAsync();
                    currentClipRef.current = null;
                } else {
                    await currentClipRef.current.audio.pauseAsync();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    let prevTimestamp = -1;
    const handleClipUpdates = async (status) => {
        // console.log("handleClipUpdates");
        if(status.isLoaded){
            if(status.isPlaying){
                console.log("Audio Clip is Playing");
                console.log("Audio Clip current timestamp: ",status.positionMillis/1000);
                // Manually checking if the audio clip has finished playing
                // because for some clips, when they finish playing, the status doesn't change automatically
                if(status.positionMillis === prevTimestamp &&
                   status.positionMillis === parseInt(currentClipRef.current.duration*1000)){
                    console.log("Finished Playing Manually");
                    if(currentClipRef.current){
                        console.log("Inside currentClipRef.current");
                        if(currentClipRef.current.playbackType === 'extended'){
                            setIsVideoPlaying(true);
                        } else {
                            setVideoVolume(100);
                        }
                        await currentClipRef.current.audio.stopAsync();
                        currentClipRef.current = null;
                    }
                } else {
                    prevTimestamp = status.positionMillis;
                }
            } else if(status.isBuffering){
                console.log("Audio Clip Buffering");
            } else if(status.didJustFinish){
                console.log("Finished Playing Automatically");
                if(currentClipRef.current){
                    console.log("Inside currentClipRef.current");
                    if(currentClipRef.current.playbackType === 'extended'){
                        setIsVideoPlaying(true);
                    } else {
                        setVideoVolume(100);
                    }
                    currentClipRef.current = null;
                }
            }
        } else {
            if(status.error) {
                console.log("Error while playing audio clip: ", status.error);
            }
        }
    }

    const showModal = () => {
        setModalVisible(true);
    }

    const hideModal = () => {
        setModalVisible(false);
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

    useEffect(() => {
        console.log("SelectedAudioDescriptionId changed to ", selectedAudioDescriptionId);
        preLoadAudioClips();
    }, [selectedAudioDescriptionId]);

    useEffect(() => {
        console.log("isVideoPlaying Changed!");
        console.log("isVideoPlaying: ", isVideoPlaying);
    }, [isVideoPlaying]);

    return (
        <View style={styles.container}>
            <YoutubePlayer
                ref={videoPlayerRef}
                height={deviceWidth * 9 / 16} // Setting the height to 9/16th of the device's width as the video player's aspect ratio is 16:9
                play={isVideoPlaying}
                volume={videoVolume}
                videoId={video.videoId}
                onChangeState={onVPStateChange}
            />
            <VideoInfo video={video}/>
            <SelectedDescriptionBox user={audioDescriptionsIdsUsers[selectedAudioDescriptionId]} />
            <DescriptionOptions
                multipleDescriptions={audioDescriptions && audioDescriptions.length > 1}
                showModal={showModal}
            />
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() =>  setModalVisible(!modalVisible) }
                transparent={true}
            >
                <ChangeDescriptionModal
                    hideModal={hideModal}
                    describers={audioDescriptionsIdsUsers}
                    selectedAudioDescriptionId={selectedAudioDescriptionId}
                    setSelectedAudioDescriptionId={setSelectedAudioDescriptionId}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});