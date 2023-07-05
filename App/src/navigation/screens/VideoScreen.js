import { View, StyleSheet, useWindowDimensions, Modal, Alert, Pressable, Text, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import YoutubePlayer from 'react-native-youtube-iframe';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Audio } from 'expo-av';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { audioClipsUploadsPath } from "../../api/client";
import videosApi from "../../api/videosApi";
import audioDescriptionsApi from "../../api/audioDescriptionsApi";

import { getDescriptionActivity } from "../../contexts/DescriptionActivityContext";
import { getUser } from "../../contexts/UserContext";

import ChangeDescriptionModal from "../../components/ChangeDescriptionModal";
import RateDescriptionModal from "../../components/RateDescriptionModal";
import VideoInfo from "../../components/VideoInfo";
import SelectedDescriptionBox from "../../components/SelectedDescriptionBox";
import DescriptionOptions from "../../components/DescriptionOptions";

export default function VideoScreen({ route }) {
    // console.log("Rerendered!!");
    const deviceWidth = useWindowDimensions().width;
    const isDescriptionActive = getDescriptionActivity();
    const video = route.params.video;
    const user = getUser();
    const videoPlayerRef = useRef();
    const currentClipRef = useRef(null);
    const [audioDescriptions, setAudioDescriptions] = useState([]);
    const [audioDescriptionsIds, setAudioDescriptionsIds] = useState([]);
    const [audioDescriptionsIdsUsers, setAudioDescriptionsIdsUsers] = useState({});
    const [audioDescriptionsIdsAudioClips, setAudioDescriptionsIdsAudioClips] = useState({});
    const [selectedAudioDescriptionId, setSelectedAudioDescriptionId] = useState("");
    const [audioClips, setAudioClips] = useState([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [progressWatcher, setProgressWatcher] = useState(null);
    const [changeDescriptionModalVisible, setChangeDescriptionModalVisible] = useState(false);
    const [rateDescriptionModalVisible, setRateDescriptionModalVisible] = useState(false);
    const [starColors, setStarColors] = useState(['#787070','#787070','#787070','#787070','#787070']);
    const [currentRating, setCurrentRating] = useState(0);
    const [currentDescriptionVolume, setCurrentDescriptionVolume] = useState(10);

    const getAudioDescriptions = async () => {
        // console.log("getAudioDescriptions");
        const audioDescriptions = await videosApi.getAudioDescriptions(video.videoId);
        setAudioDescriptions(audioDescriptions);
    }

    const parseAudioDescriptions = () => {
        // console.log("parseAudioDescriptions");
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
                            adIdsAudioClips[ad._id].push(audioClip);
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
        // console.log("getHighestRatingADId");
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
        // console.log("setAudioDescritionActive");
        if(!selectedAudioDescriptionId){
            let adId = getHighestRatingADId();
            if(audioDescriptionsIds.length > 0 && audioDescriptionsIds.indexOf(adId) === -1){
                adId = audioDescriptionsIds[0];
            }
            setSelectedAudioDescriptionId(adId);
        }
    }

    const preLoadAudioClips = () => {
        // console.log("preLoadAudioClips");
        let clips = [];
        if(audioDescriptionsIdsAudioClips
           && selectedAudioDescriptionId
           && audioDescriptionsIdsAudioClips[selectedAudioDescriptionId]
        ){
            clips = audioDescriptionsIdsAudioClips[selectedAudioDescriptionId];
        }
        clips.forEach(async (clip) => {
            try {
                const source = { uri: clip.url };
                const initialStatus = {
                    shouldPlay: false,
                    isMuted: false,
                    volume: currentDescriptionVolume/10
                };
                const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                clip.sound = sound;
            } catch (e) {
                console.error(e);
            }
        });
        // console.log("Number of Audio Clips: ", clips.length);
        // console.log("Setting audio clips");
        setAudioClips(clips);
    }

    const onVPStateChange = async (event) => {
        // console.log("onVPStateChange");
        switch(event){
            case "playing":
                setIsVideoPlaying(true);
                if(currentClipRef.current && currentClipRef.current.playbackType === "extended"){
                    await currentClipRef.current.audio.stopAsync();
                    currentClipRef.current = null;
                } else {
                    checkSeek();
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
                    await currentClipRef.current.audio.stopAsync();
                    currentClipRef.current = null;
                }
                break;
            default:
                break;
        }
    }

    const checkSeek = () => {
        // console.log("checkSeek");
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
        // console.log("startProgressWatcher");
        if(selectedAudioDescriptionId){
            const interval = 141;
            if(progressWatcher){
                stopProgressWatcher();
            }
            const progressWatcher = setInterval(async () => {
                if(videoPlayerRef && videoPlayerRef.current){
                    const currentTime = await videoPlayerRef.current.getCurrentTime();
                    const currentVideoProgressFloor = parseFloat(currentTime);
                    // TODO: Audio Ducking goes here.
                    audioClips.forEach((audioClip, idx) => {
                        if(currentVideoProgressFloor >= parseFloat(parseFloat(audioClip.start_time) - 0.07) &&
                           currentVideoProgressFloor <= parseFloat(parseFloat(audioClip.start_time) + 0.07)){
                            if(!currentClipRef.current){
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
        // console.log("stopProgressWatcher");
        if(progressWatcher){
            clearInterval(progressWatcher);
            setProgressWatcher(null);
        }
    }

    const playAudioClip = async (audioClip, idx, timestamp = null) => {
        try {
            // console.log("playAudioClip");
            // console.log("Audio Clip Type: ",audioClip.playback_type);
            // console.log("Audio Clip Duration: ", parseInt(audioClip.duration*1000));
            // console.log("Audio Clip Start Time: ", audioClip.start_time);
            if(currentClipRef.current === null){
                currentClipRef.current = {
                    audio: audioClip.sound,
                    playbackType: audioClip.playback_type,
                    duration: audioClip.duration,
                    start_time: audioClip.start_time
                };
                if(timestamp){
                    await audioClip.sound.setPositionAsync(timestamp);
                }
                if(audioClip.playback_type === "extended"){
                    setIsVideoPlaying(false);
                }
                await audioClip.sound.setVolumeAsync(currentDescriptionVolume/10);
                await audioClip.sound.playAsync();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const pauseAudioClips = async () => {
        try {
            // console.log("pauseAudioClips");
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
                // console.log("Audio Clip is Playing");
                // console.log("Audio Clip current timestamp: ",status.positionMillis/1000);
                // Manually checking if the audio clip has finished playing
                // because for some clips, when they finish playing, the status doesn't change automatically
                if(status.positionMillis === prevTimestamp &&
                   status.positionMillis === parseInt(currentClipRef.current.duration*1000)){
                    // console.log("Finished Playing Manually");
                    if(currentClipRef.current){
                        if(currentClipRef.current.playbackType === 'extended'){
                            setIsVideoPlaying(true);
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
                // console.log("Finished Playing Automatically");
                if(currentClipRef.current){
                    if(currentClipRef.current.playbackType === 'extended'){
                        setIsVideoPlaying(true);
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

    const showChangeDescriptionModal = () => {
        setChangeDescriptionModalVisible(true);
    }

    const hideChangeDescriptionModal = async () => {
        stopProgressWatcher();
        videoPlayerRef.current?.seekTo(0,true);
        if(currentClipRef.current){
            await currentClipRef.current.audio.stopAsync();
            currentClipRef.current = null;
        }
        setChangeDescriptionModalVisible(false);
    }

    const showRateDescriptionModal = () => {
        if(!user){
            Alert.alert(
                `Sign In Required`,
                `You have to be logged in in order to rate a description`
            );
        } else {
            setRateDescriptionModalVisible(true);
        }
    }

    const hideRateDescriptionModal = () => {
        setRateDescriptionModalVisible(false);
    }

    const handleRatingChange = (rating) => {
        setCurrentRating(rating);
        let colors = [];
        for(let i = 1; i <= rating; i++){
            colors.push('gold');
        }
        for(let i = 1; i <= 5-rating; i++){
            colors.push('#787070');
        }
        setStarColors(colors);
    }

    const handleRatingSubmit = async () => {
        const response = await audioDescriptionsApi.rateAudioDescription(currentRating, selectedAudioDescriptionId, user._id, user.token);
        if(response && response.status === 200){
            const describers = {...audioDescriptionsIdsUsers};
            const selectedId = selectedAudioDescriptionId;
            if (!describers[selectedId].overall_rating_votes_sum) {
                describers[selectedId].overall_rating_votes_sum = 0;
            }
            if (!describers[selectedId].overall_rating_votes_counter) {
                describers[selectedId].overall_rating_votes_counter = 0;
            }
            if (!describers[selectedId].overall_rating_average) {
                describers[selectedId].overall_rating_average = 0;
            }
            describers[selectedId].overall_rating_votes_sum += currentRating;
            describers[selectedId].overall_rating_votes_counter += 1;
            describers[selectedId].overall_rating_average = describers[selectedId].overall_rating_votes_sum / describers[selectedId].overall_rating_votes_counter;
            setAudioDescriptionsIdsUsers(describers);
            Alert.alert(
                `Thanks for your feedback!`
            );
        } else {
            Alert.alert(
                `Rating Description Unsuccessful`,
                `There was a problem while rating the audio description. Try to logout and login again.`
            );
        }
        hideRateDescriptionModal();
    }

    const incrementDescriptionVolume = () => {
        setCurrentDescriptionVolume(currentDescriptionVolume + 1);
    }

    const decrementDescriptionVolume = () => {
        setCurrentDescriptionVolume(currentDescriptionVolume - 1);
    }

    const updateDescriptionVolume = async () => {
        if(currentClipRef.current){
            await currentClipRef.current.audio.setVolumeAsync(currentDescriptionVolume/10);
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

    useEffect(() => {
        preLoadAudioClips();
    }, [selectedAudioDescriptionId]);

    useEffect(() => {
        updateDescriptionVolume();
    }, [currentDescriptionVolume]);

    return (
        <View style={styles.container}>
            <YoutubePlayer
                ref={videoPlayerRef}
                height={deviceWidth * 9 / 16} // Setting the height to 9/16th of the device's width as the video player's aspect ratio is 16:9
                play={isVideoPlaying}
                videoId={video.videoId}
                onChangeState={onVPStateChange}
            />
            <View style={styles.sliderContainerView}>
                <Text style={{color: '#fff', fontSize: 16}}>Description Volume</Text>
                <View style={styles.descriptionVolume}>
                    <Pressable
                        style={styles.descriptionVolumeBtn}
                        onPress={decrementDescriptionVolume}
                        disabled={currentDescriptionVolume <= 0}
                    >
                        <FontAwesome5 name = 'minus' size = {16} color = {'#384488'} />
                    </Pressable>
                    <Text style={styles.descriptionVolumeText}>
                        {currentDescriptionVolume}
                    </Text>
                    <Pressable
                        style={styles.descriptionVolumeBtn}
                        onPress={incrementDescriptionVolume}
                        disabled={currentDescriptionVolume >= 10}
                    >
                        <FontAwesome5 name = 'plus' size = {16} color = {'#384488'} />
                    </Pressable>
                </View>
            </View>
            <VideoInfo video={video}/>
            <SelectedDescriptionBox
                user={audioDescriptionsIdsUsers[selectedAudioDescriptionId]}
                showRateDescriptionModal={showRateDescriptionModal}
            />
            <DescriptionOptions
                multipleDescriptions={audioDescriptions && audioDescriptions.length > 1}
                showChangeDescriptionModal={showChangeDescriptionModal}
            />
            <Modal
                animationType="slide"
                visible={changeDescriptionModalVisible}
                onRequestClose={() =>  setChangeDescriptionModalVisible(!changeDescriptionModalVisible) }
                transparent={true}
            >
                <ChangeDescriptionModal
                    hideChangeDescriptionModal={hideChangeDescriptionModal}
                    describers={audioDescriptionsIdsUsers}
                    selectedAudioDescriptionId={selectedAudioDescriptionId}
                    setSelectedAudioDescriptionId={setSelectedAudioDescriptionId}
                />
            </Modal>
            <Modal
                animationType="slide"
                visible={rateDescriptionModalVisible}
                onRequestClose={() =>  setRateDescriptionModalVisible(!rateDescriptionModalVisible) }
                transparent={true}
            >
                <RateDescriptionModal
                    hideRateDescriptionModal={hideRateDescriptionModal}
                    handleRatingSubmit={handleRatingSubmit}
                    handleRatingChange={handleRatingChange}
                    starColors={starColors}
                    currentRating={currentRating}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderContainer: {
        backgroundColor: '#000',
        paddingHorizontal: 15,
        height: 40
    },
    sliderContainerView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        backgroundColor: '#000',
        paddingHorizontal: 15,
    },
    descriptionVolume: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 125,
        marginRight: 15
    },
    descriptionVolumeBtn: {
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 5
    },
    descriptionVolumeText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});