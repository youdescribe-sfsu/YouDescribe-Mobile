import { SafeAreaView, View, StyleSheet, useWindowDimensions, Modal, Alert, Pressable, Text, TouchableOpacity, Switch } from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import YoutubePlayer from 'react-native-youtube-iframe';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
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
    const deviceHeight = useWindowDimensions().height;
    const remainingHeight = deviceHeight - (9 / 16 * deviceWidth) - 100;
    const isDescriptionActive = getDescriptionActivity();
    const video = route.params.video;
    const user = getUser();
    const [elapsed, setElapsed] = useState('00:00');
    const [elapsedAccessibilityLabel, setElapsedAccessibilityLabel] = useState('Zero minutes, zero seconds');
    const videoPlayerRef = useRef();
    // const currentClipRef = useRef(null);
    const [audioDescriptions, setAudioDescriptions] = useState([]);
    const [audioDescriptionsIds, setAudioDescriptionsIds] = useState([]);
    const [audioDescriptionsIdsUsers, setAudioDescriptionsIdsUsers] = useState({});
    const [audioDescriptionsIdsAudioClips, setAudioDescriptionsIdsAudioClips] = useState({});
    const [selectedAudioDescriptionId, setSelectedAudioDescriptionId] = useState("");
    const [audioClips, setAudioClips] = useState([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isMuteEnabled, setIsMuteEnabled] = useState(false);
    // const [progressWatcher, setProgressWatcher] = useState(null);
    const [changeDescriptionModalVisible, setChangeDescriptionModalVisible] = useState(false);
    const [rateDescriptionModalVisible, setRateDescriptionModalVisible] = useState(false);
    const [starColors, setStarColors] = useState(['#787070','#787070','#787070','#787070','#787070']);
    const [currentRating, setCurrentRating] = useState(0);
    const [currentDescriptionVolume, setCurrentDescriptionVolume] = useState(10);

    // For new playback algorithm
    const [clipStack, setClipStack] = useState([]);
    const [clipStackSize, setClipStackSize] = useState(5);
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const [currentState, setCurrentState] = useState(''); //stores the current state of the YT video.
    const [currentTime, setCurrentTime] = useState(0.0);
    const [previousTime, setPreviousTime] = useState(0.0);
    const [recentAudioPlayedTime, setRecentAudioPlayedTime] = useState(0.0); // used to store the time of a recent AD played to stop playing the same Audio twice concurrently - due to an issue found in updateTime() method because it returns the same currentTime twice or more
    const [playedAudioClip, setPlayedAudioClip] = useState(''); // store clipId of the audio clip that is already played.
    const [playedClipPath, setPlayedClipPath] = useState(''); // store clip_audio_path of the audio clip that is already played.
    const [currExtendedAC, setCurrExtendedAC] = useState(null); // see onStateChange() - stop extended ac, when Video is played.
    const [currInlineAC, setCurrInlineAC] = useState(null);
    const [isCurrentExtACPaused, setCurrentExtACPaused] = useState(false); // Manages the play/pause state of an extended audio clip
    const [previousYTTime, setPreviousYTTime] = useState(0.0);
    const [timer, setTimer] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [samplingRate, setSamplingRate] = useState(200);
    const [elapsedTimeInterval, setElapsedTimeInterval] = useState(null);

    const clipStackRef = useRef(clipStack);
    const clipIdRef = useRef(playedAudioClip);
    const currentTimeRef = useRef(currentTime);
    const previousTimeRef = useRef(previousTime);
    const currentClipIndexRef = useRef(currentClipIndex);
    const currentInlineACRef = useRef(currInlineAC);
    const currentExtendedACRef = useRef(currExtendedAC);

    useEffect(() => {
        onVideoScreenMount();
        getAudioDescriptions(); // Start the algorithm
        return () => {
            onVideoScreenUnmount();
        }; // Cleanup selected audio description and its related data
    }, []);

    useEffect(() => {
        parseAudioDescriptions();
    }, [audioDescriptions]);

    useEffect(() => {
        setAudioDescriptionActive();
    }, [audioDescriptionsIds]);

    useEffect(() => {
        // preLoadAudioClips();
        prepareAudioClips();
    }, [selectedAudioDescriptionId]);

    // useEffect(() => {
    //     setIsVideoPlaying(true); // Start playing the video once the audio clips are loaded.
    // }, [audioClips]);

    useEffect(() => {
        updateDescriptionVolume();
    }, [currentDescriptionVolume]);

    useEffect(() => {
        console.log("Current State changed to ", currentState);
        if(currentState === "playing" && isDescriptionActive){
            setTimer( setInterval(() => updateTime(currentTime,recentAudioPlayedTime), samplingRate) );
        }
    }, [currentState]);

    useEffect(() => {
        console.log("isVideo Playing changed to ", isVideoPlaying);
    }, [isVideoPlaying]);

    // useEffect(() => {
    //     return () => {
    //       console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ TIMER UNMOUNT $$$$$$$$$$$$$$");
    //       console.log("Timer", timer);
    //       clearInterval(timer);
    //       console.log("Timer 2", timer);
    //     }
    //   }, [timer]);

    // Update Refs
    useEffect(() => {
        currentInlineACRef.current = currInlineAC;
        currentExtendedACRef.current = currExtendedAC;
    }, [currInlineAC, currExtendedAC]);

    useEffect(() => {
        currentTimeRef.current = currentTime;
        previousTimeRef.current = previousTime;
    }, [currentTime, previousTime]);

    useEffect(() => {
        clipIdRef.current = playedAudioClip;
    }, [playedAudioClip]);

    useEffect(() => {
        currentClipIndexRef.current = currentClipIndex;
    }, [currentClipIndex]);

    useEffect(() => {
        clipStackRef.current = clipStack;
        console.log('New Clip Stack');
        clipStack.forEach((clip) => {
            console.log("Clip Sequence Number: ", clip.clip_sequence_number);
            console.log("Clip Start Time: ", clip.clip_start_time);
        });
    }, [clipStack]);

    const onVideoScreenMount = async () => {
        try {
            console.log("--------------------MOUNT CALLED-----------------------");
            // Pause and unload current inline audio clip
            if (currentInlineACRef && currentInlineACRef.current) {
                await currentInlineACRef.current.pauseAsync();
                await currentInlineACRef.current.unloadAsync();
            }
            // Pause and unload current extended audio clip
            if (currentExtendedACRef && currentExtendedACRef.current) {
                await currentExtendedACRef.current.pauseAsync();
                await currentExtendedACRef.current.unloadAsync();
            }
            // Clear the timer for audio clip updates
            if (timer) {
                clearInterval(timer);
                // setTimer(null);
            }
            // Set interval to display YT video's elapsed time
            setElapsedTimeInterval(setInterval(async () => {
                try {
                    const elapsed_sec = await videoPlayerRef.current?.getCurrentTime();
            
                    // calculations
                    const elapsed_ms = Math.floor(elapsed_sec * 1000);
                    const ms = elapsed_ms % 1000;
                    const min = Math.floor(elapsed_ms / 60000);
                    const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);
                
                    setElapsed(
                        min.toString().padStart(2, '0') +
                        ':' +
                        seconds.toString().padStart(2, '0')
                    );
                    setElapsedAccessibilityLabel(`${min} minutes, ${seconds} seconds`);
                } catch (error) {
                    console.log("Error: ", error);
                }
            }, 800));
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const onVideoScreenUnmount = async () => {
        try {
            console.log("--------------------UNMOUNT CALLED-----------------------");
            // Make sure to clear any intervals or timeouts as well
            if (currentInlineACRef && currentInlineACRef.current) {
                await currentInlineACRef.current.stopAsync();
                setCurrInlineAC(null);
            }
            if (currentExtendedACRef && currentExtendedACRef.current) {
                await currentExtendedACRef.current.stopAsync();
                setCurrExtendedAC(null);
            }
            if (timer) {
                console.log("Inside if timer.");
                clearInterval(timer);
                // setTimer(null);
            }
            if(elapsedTimeInterval){
                clearInterval(elapsedTimeInterval);
                setElapsedTimeInterval(null);
            }
            setCurrentState('');
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const getAudioDescriptions = async () => {
        console.log("getAudioDescriptions");
        try {
            const audioDescriptions = await videosApi.getAudioDescriptions(video.videoId);
            setAudioDescriptions(audioDescriptions);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const parseAudioDescriptions = () => {
        console.log("parseAudioDescriptions");
        // console.log("Audio Descriptions: ", audioDescriptions);
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

    // const preLoadAudioClips = () => {
    //     console.log("preLoadAudioClips");
    //     let clips = [];
    //     if(audioDescriptionsIdsAudioClips
    //        && selectedAudioDescriptionId
    //        && audioDescriptionsIdsAudioClips[selectedAudioDescriptionId]
    //     ){
    //         clips = audioDescriptionsIdsAudioClips[selectedAudioDescriptionId];
    //     }
    //     clips.forEach(async (clip) => {
    //         try {
    //             const source = { uri: clip.url };
    //             const initialStatus = {
    //                 shouldPlay: false,
    //                 isMuted: false,
    //                 volume: currentDescriptionVolume/10
    //             };
    //             await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    //             const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
    //             clip.sound = sound;
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     });
    //     console.log("Number of Audio Clips: ", clips.length);
    //     clips.forEach((clip, idx) => console.log(idx, clip.start_time));
    //     console.log("Setting audio clips");
    //     setAudioClips(clips);
    // }

    const prepareAudioClips = async () => {
        console.log("prepareAudioClips");
        try {
            let selectedAudioClips = [];
            if(audioDescriptionsIdsAudioClips
                && selectedAudioDescriptionId
                && audioDescriptionsIdsAudioClips[selectedAudioDescriptionId]
            ){
                selectedAudioClips = audioDescriptionsIdsAudioClips[selectedAudioDescriptionId];
            }
            if(selectedAudioClips.length > 100) {
                setClipStackSize(10);
            }
            const audioClipsData = selectedAudioClips.map((audioClip, index) => {
                const clip = convertClassicClipObject(audioClip);
                clip.clip_sequence_number = index + 1;
                // console.log("Clip number ", index, clip);
                return clip;
            });
            const sortedClipData = audioClipsData.sort((a, b) => a.clip_start_time < b.clip_start_time ? -1 : 1);
            console.log("Sorted Clips: ");
            sortedClipData.forEach((clip, index) => {console.log("Clip ", index, clip)});
            const maxStackSize = sortedClipData.length > 100 ? 10 : Math.min(sortedClipData.length, 5);
            const clipStackData = [];
            for (let i = 0; i < maxStackSize; i++) {
                const clip = sortedClipData[i];
                if (clip) {
                    const source = { uri: clip.clip_audio_path };
                    const initialStatus = {
                        shouldPlay: false,
                        isMuted: false,
                        volume: currentDescriptionVolume/10
                    };
                    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                    const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                    clip.clip_audio = sound;
                    clipStackData.push(clip);
                    // console.log("Clip number ", i, clip);
                }
            }
            console.log("Clip Stack Data: ", clipStackData);
            setClipStack(clipStackData);
            setAudioClips([...sortedClipData]);
        } catch (error) {
            console.error(error);
        }
    }

    const convertClassicClipObject = (clip) => {
        const newClip = {
          audioDescriptionAdId: clip.audio_description,
          clip_audio: clip.clip_audio,
          clip_id: clip._id,
          playback_type: clip.playback_type,
          clip_audio_path: clip.url,
          clip_duration: clip.duration,
          createdAt: clip.created_at,
          clip_start_time: clip.start_time,
          clip_end_time: clip.end_time,
          clip_sequence_number: clip.clip_sequence_number ?? 0,
          description_text: clip.description_text,
          description_type: clip.description_type,
          is_recorded: clip.is_recorded,
        }
        return newClip;
    }

    const updateTime = async (ctime, recentAudioPlayedTime) => {
        const time = await videoPlayerRef.current?.getCurrentTime();
        console.log("updateTime: ", time);
        setCurrentTime(time);
        if(recentAudioPlayedTime !== time){
            playAudioAtCurrentTime(time);
        }
        setPreviousTime(time);
    }

    const playAudioAtCurrentTime = async (updatedCurrentTime) => {
        console.log("playAudioAtCurrentTime: ", updatedCurrentTime);
        try {
            if(currentState === "playing"){
                console.log("current state is playing.");
                // If all clips have been played, skip check
                if(clipStackRef.current.length === 0) {
                    console.log('No Clips left to play');
                    return;
                }
                // If a clip is currently playing, skip check
                if(currentInlineACRef && currentInlineACRef.current){
                    console.log("<<<<<<<<<<<<<<<<<<<<<<<Inside 1");
                    const status = await currentInlineACRef.current.getStatusAsync();
                    if(!status.error && (status.isPlaying || status.isBuffering)){
                        console.log('A clip is currently playing');
                        return;
                    }
                }
                if(currentExtendedACRef && currentExtendedACRef.current){
                    const status = await currentExtendedACRef.current.getStatusAsync();
                    if(!status.error && status.isPlaying){
                        console.log('A clip is currently playing');
                        return;
                    }
                }
                // If an inline clip is supposed to be playing right now but the user has
                // either skipped to a time in the middle of the clip
                // or there was an overlap which caused the start time of the clip to be skipped
                // play the clip by seeking to the current time
                if(clipStackRef.current[0].playback_type === 'inline'){
                    console.log("First Clip Start Time: ", clipStackRef.current[0].clip_start_time);
                    console.log("Current Time: ", currentTimeRef.current);
                    if(
                        (clipStackRef.current[0].clip_start_time <= currentTimeRef.current &&
                          clipStackRef.current[0].clip_end_time >= currentTimeRef.current) ||
                        (clipStackRef.current[0].clip_start_time <= currentTimeRef.current &&
                          clipStackRef.current[0].clip_start_time >= previousTimeRef.current)
                    ){
                        console.log("An inline clip is supposed to be playing right now at ", currentTimeRef.current);
                        // If an Inline Clip is Playing - Return
                        if(currentInlineACRef && currentInlineACRef.current) {
                            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<Inside 2");
                            const status = await currentInlineACRef.current.getStatusAsync();
                            if(!status.error && (status.isPlaying || status.isBuffering)){
                                console.log('An inline clip is already playing');
                                return;
                            }
                        }
                        // If the clip is not playing, play it
                        console.log('Playing clip by Seeking to current time');
                        // Play Inline Clip
                        const currentFilteredClip = clipStackRef.current[0];
                        console.log('Clip to be Played', currentFilteredClip);
                        setPlayedAudioClip(currentFilteredClip.clip_id);
                        // update recentAudioPlayedTime - which stores the time at which an audio has been played
                        // to stop playing the same audio twice concurrently
                        setRecentAudioPlayedTime(currentTimeRef.current);
                        const clipAudioPath = currentFilteredClip.clip_audio_path;
                        console.log('Playing clip', clipAudioPath);
                        if(clipAudioPath !== playedClipPath){
                            console.log('Updating Clip Index (inline clip)');
                            setCurrentClipIndex(currentClipIndexRef.current + 1);
                            setPlayedClipPath(clipAudioPath);
                            const currentAudio = currentFilteredClip.clip_audio;
                            console.log('Playing inline clip');
                            if(currentAudio){
                                const status = await currentAudio.getStatusAsync();
                                if(!status.error && status.isPlaying){
                                    console.log('Clip is already playing');
                                    return;
                                }
                            }
                            if(currentInlineACRef && currentInlineACRef.current){
                                const status = await currentInlineACRef.current.getStatusAsync();
                                if(!status.error && status.isPlaying){
                                    console.log('Clip is already playing');
                                    return;
                                }
                            }
                            if(isMuteEnabled){
                                setIsVideoMuted(true);
                            }
                            const newStartTime = currentTimeRef.current - currentFilteredClip.clip_start_time; // new start time in seconds
                            console.log('Seeking to',newStartTime,'seconds');
                            await currentAudio?.playFromPositionAsync(newStartTime * 1000); // convert new start time to milliseconds before passing
                            // see onStateChange() - storing current inline clip.
                            setCurrInlineAC(currentAudio);
                            // Load a new clip and add it to the stack
                            console.log('Current Clip Index', currentClipIndexRef.current);
                            const newClip = audioClips[currentClipIndexRef.current + clipStackSize - 1];
                            console.log('New CLIP (seeked inline) => ', newClip);
                            if(newClip){
                                const source = { uri: newClip.clip_audio_path };
                                const initialStatus = {
                                    shouldPlay: false,
                                    isMuted: false,
                                    volume: currentDescriptionVolume/10
                                };
                                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                                const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                                newClip.clip_audio = sound;
                                setClipStack([...clipStackRef.current.slice(1, clipStackSize), newClip]);
                            } else {
                                setClipStack([...clipStackRef.current.slice(1, clipStackSize)]);
                            }
                        }
                    }
                }
                // Case for playing extended clips when the player come across their start or end times
                // Compare current window with clip at current clip index
                else {
                    if(
                        clipStackRef.current[0].clip_start_time <= currentTimeRef.current + 0.1 &&
                        clipStackRef.current[0].clip_start_time >= previousTimeRef.current - 0.1
                    ){
                        const currentFilteredClip = clipStackRef.current[0];
                        console.log('Updating Clip Index');
                        setCurrentClipIndex(currentClipIndexRef.current + 1); // Update current clip index
                        // Play the clip only if it wasn't played recently
                        if(playedAudioClip !== currentFilteredClip.clip_id){
                            setPlayedAudioClip(currentFilteredClip.clip_id);
                            // update recentAudioPlayedTime - which stores the time at which an audio has been played
                            // to stop playing the same audio twice concurrently
                            setRecentAudioPlayedTime(currentTimeRef.current);
                            const clipAudioPath = currentFilteredClip.clip_audio_path;
                            if(clipAudioPath !== playedClipPath){
                                setPlayedClipPath(clipAudioPath);
                                const currentAudio = currentFilteredClip.clip_audio;
                                setIsVideoPlaying(false);
                                if(currentAudio){
                                    const status = await currentAudio.getStatusAsync();
                                    if(!status.error && !status.isPlaying){
                                        await currentAudio.playAsync();
                                    }
                                }
                                // see onStateChange() - storing current Extended Clip
                                setCurrExtendedAC(currentAudio);
                                // Add a new clip to the stack
                                console.log('Current Clip Index', currentClipIndexRef.current);
                                const newClip = audioClips[currentClipIndexRef.current + (clipStackSize - 1)];
                                console.log('New CLIP (normal extended) => ', newClip);
                                if(newClip){
                                    const source = { uri: newClip.clip_audio_path };
                                    const initialStatus = {
                                        shouldPlay: false,
                                        isMuted: false,
                                        volume: currentDescriptionVolume/10
                                    };
                                    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                                    const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                                    newClip.clip_audio = sound;
                                    setClipStack([...clipStackRef.current.slice(1, clipStackSize), newClip]);
                                } else {
                                    setClipStack([...clipStackRef.current.slice(1, clipStackSize)]);
                                }
                            }
                        }
                    }
                }
                // Check for Skips - This usually occurs when an extended clip was overlapped by an inline clip
                if(
                    clipStackRef.current[0].playback_type === 'extended' &&
                    clipStackRef.current[0].clip_start_time <= currentTimeRef.current
                ){
                    const inlineStatus = await currentInlineACRef.current?.getStatusAsync();
                    const extendedStatus = await currentExtendedACRef.current?.getStatusAsync();
                    if(
                        !inlineStatus.error && !inlineStatus.isPlaying &&
                        !extendedStatus.error && !extendedStatus.isPlaying
                    ){
                        // A skip has most likely occurred
                        console.log('SKIP DETECTED', clipStackRef.current[0]);
                        // Add a new clip to the stack
                        console.log('Current Clip Index', currentClipIndexRef.current);
                        const newClip = audioClips[currentClipIndexRef.current + (clipStackSize - 1)];
                        console.log('New CLIP (normal extended) => ', newClip);
                        if(newClip){
                            const source = { uri: newClip.clip_audio_path };
                            const initialStatus = {
                                shouldPlay: false,
                                isMuted: false,
                                volume: currentDescriptionVolume/10
                            };
                            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                            const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                            newClip.clip_audio = sound;
                            setClipStack([...clipStackRef.current.slice(1, clipStackSize), newClip]);
                        } else {
                            setClipStack([...clipStackRef.current.slice(1, clipStackSize)]);
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const onVPStateChange = async (state) => {
        console.log("onVPStateChange ", state);
        const currTime = await videoPlayerRef.current?.getCurrentTime();
        setCurrentTime(currTime);
        setCurrentState(state);
        switch(state){
            case "ended":
                setIsVideoPlaying(false);
                if(timer){
                    clearInterval(timer);
                    // setTimer(null);
                }
                break;
            case "playing":
                setIsVideoPlaying(true);
                // if(isDescriptionActive){
                //     setTimer( setInterval(() => updateTime(currTime,recentAudioPlayedTime), samplingRate) );
                // }
                // If the difference between current time and previous time is greater than 0.2 seconds
                // update the clip stack
                if (Math.abs(currTime - previousYTTime) > 0.2) {
                    console.log('User has potentially seeked to a different time');
                    setPreviousYTTime(currTime);
                    updateClipStackData();
                }
                // Case for Extended Audio Clips:
                // When an extended Audio Clip is playing, YT video is paused
                // User plays the YT Video. Extended is still played along with the video. Overlapping with Dialogs &/ other audio clips
                // Work around - add current extended audio clip to a state variable & check if YT state is changed to playing i.e. 1
                // if yes, stop playing the extended audio clip & set the state back to null
                if (!isActive){
                    setIsActive(true); //if the timer is paused it will start again when the video plays
                }
                if (currExtendedAC){
                    // to stop playing -> pause and set time to 0
                    await currExtendedAC.pauseAsync();
                    await currExtendedAC.setPositionAsync(0);
                    setCurrExtendedAC(null);
                }
                if (currInlineAC){
                    // to stop playing -> pause and set time to 0
                    // await currInlineAC.playAsync();
                    // currInlineAC.on('end', function () {
                    //     setCurrInlineAC(undefined) // setting back to null, as it is played completely.
                    // })
                    // currInlineAC.currentTime = 0;
                    // setCurrInlineAC(null);
                }
                if(timer){
                    clearInterval(timer);
                    // setTimer(null);
                }
                break;
            case "paused":
                setIsVideoPlaying(false);
                if(timer){
                    clearInterval(timer);
                }
                // If the difference between current time and previous time is greater than 0.2 seconds
                // update the clip stack
                if (Math.abs(currTime - previousYTTime) > 0.2) {
                    console.info('User has potentially seeked to a different time');
                    setPreviousYTTime(currTime);
                    updateClipStackData();
                }
                // Case for Inline Audio Clips:
                // When an inline Audio Clip is playing along with the Video,
                // If user pauses the YT video, Inline Clip is still played.
                // Work around - add current inline audio clip to a state variable & check if YT state is changed to paused i.e. 2
                // if yes, stop playing the inline audio clip & set the state back to null
                if (currInlineAC) {
                    // to stop playing -> pause and set time to 0
                    await currInlineAC.stopAsync();
                    // currInlineAC.currentTime = 0;
                    setCurrInlineAC(null);
                }
                break;
            case "buffering":
                // onSeek - Buffering event is also called
                // so that when user wants to go back and play the same clip again, recentAudioPlayedTime will be reset to 0.
                setPlayedClipPath('');
                setPlayedAudioClip('');
                console.log('Buffering (on seek)');
                setRecentAudioPlayedTime(0.0);
                if(timer){
                    clearInterval(timer);
                }
                // updateClipStackData();
                if(currExtendedAC){
                    await currExtendedAC.stopAsync();
                    setCurrExtendedAC(null);
                }
                if(currInlineAC){
                    await currInlineAC.stopAsync();
                    setCurrInlineAC(null);
                }
                break;
            default:
                if(timer){
                    clearInterval(timer);
                }
                break;
        }
    }

    const updateClipStackData = useCallback(async () => {
        console.log('Updating Clip Stack | Current Time =', currentTimeRef.current);
        const newClipIndex = audioClips.findIndex((clip) =>
            clip.clip_start_time >= currentTimeRef.current ||
            (clip.clip_start_time < currentTimeRef.current && clip.clip_end_time > currentTimeRef.current)
        );
        setCurrentClipIndex(newClipIndex);
        console.log('Current Clip Index', newClipIndex);

        // slice audio clips from newClipIndex to newClipIndex + 5
        const clipStackData = [];
        for (let i = newClipIndex; i < newClipIndex + clipStackSize; i++) {
            const clip = audioClips[i]
            if (clip) {
                const source = { uri: clip.clip_audio_path };
                const initialStatus = {
                    shouldPlay: false,
                    isMuted: false,
                    volume: currentDescriptionVolume/10
                };
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                const { sound } = await Audio.Sound.createAsync(source, initialStatus, handleClipUpdates);
                clip.clip_audio = sound;
                clipStackData.push(clip);
            }
        }
        // Update clipStack
        setClipStack(clipStackData);
    }, [audioClips, setCurrentClipIndex]);

    // const onVPStateChange = async (event) => {
    //     console.log("onVPStateChange");
    //     try {
    //         switch(event){
    //             case "playing":
    //                 console.log("playing");
    //                 setIsVideoPlaying(true);
    //                 if(currentClipRef.current && currentClipRef.current.playbackType === "extended"){
    //                     await currentClipRef.current.audio.stopAsync();
    //                     currentClipRef.current = null;
    //                 } else {
    //                     checkSeek();
    //                     if(isDescriptionActive){
    //                         startProgressWatcher();
    //                     }
    //                 }
    //                 break;
    //             case "paused":
    //                 console.log("paused");
    //                 stopProgressWatcher();
    //                 setIsVideoPlaying(false);
    //                 if(currentClipRef.current && currentClipRef.current.playbackType !== "extended"){
    //                     pauseAudioClips();
    //                 }
    //                 break;
    //             case "buffering":
    //                 console.log("buffering");
    //                 if(currentClipRef.current && currentClipRef.current.playbackType !== "extended"){
    //                     await currentClipRef.current.audio.stopAsync();
    //                     currentClipRef.current = null;
    //                 }
    //                 break;
    //             default:
    //                 console.log("default");
    //                 break;
    //         }
    //     } catch (error) {
    //         console.log("Error: ", error);
    //     }
    // }

    // const checkSeek = async () => {
    //     console.log("checkSeek");
    //     try {
    //         if(selectedAudioDescriptionId && currentClipRef.current){
    //             await currentClipRef.current.audio.stopAsync();
    //             currentClipRef.current = null;
    //         }
    //         let videoTimestamp;
    //         videoPlayerRef.current?.getCurrentTime().then(currentTime => {
    //             videoTimestamp = currentTime;
    //         });
    //         //round to 2 nearest dec
    //         videoTimestamp = Math.round(videoTimestamp * 100) / 100;
    //         for(let i = 0; i < audioClips.length; i++){
    //             const clip = audioClips[i];
    //             if(clip.playback_type === "inline"){
    //                 let startTime = Math.round(clip.start_time * 100) / 100;
    //                 let duration = Math.round(clip.duration * 100) / 100;
    //                 if(startTime > videoTimestamp){
    //                     break;
    //                 }
    //                 if(startTime < videoTimestamp && videoTimestamp < startTime + duration){
    //                     const diff = videoTimestamp - startTime;
    //                     playAudioClip(clip, diff);
    //                     break;
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log("Error: ", error);
    //     }
    // }

    // const startProgressWatcher = () => {
    //     console.log("startProgressWatcher");
    //     if(selectedAudioDescriptionId){
    //         const interval = 50;
    //         if(progressWatcher){
    //             stopProgressWatcher();
    //         }
    //         const progressWatcher = setInterval(async () => {
    //             try {
    //                 if(videoPlayerRef && videoPlayerRef.current){
    //                     const currentTime = await videoPlayerRef.current.getCurrentTime();
    //                     const currentVideoProgressFloor = parseFloat(currentTime);
    //                     // TODO: Audio Ducking goes here.
    //                     audioClips.forEach((audioClip, idx) => {
    //                         if(currentVideoProgressFloor >= parseFloat(parseFloat(audioClip.start_time) - 0.07) &&
    //                            currentVideoProgressFloor <= parseFloat(parseFloat(audioClip.start_time) + 0.07)){
    //                             if(!currentClipRef.current){
    //                                 playAudioClip(audioClip, idx);
    //                             }
    //                         }
    //                     });
    //                 }
    //             } catch (error) {
    //                 console.log("Error: ", error);
    //             }
    //         }, interval);
    //         setProgressWatcher(progressWatcher);
    //     }
    // }

    // const stopProgressWatcher = () => {
    //     console.log("stopProgressWatcher");
    //     if(progressWatcher){
    //         clearInterval(progressWatcher);
    //         setProgressWatcher(null);
    //     }
    // }

    // const playAudioClip = async (audioClip, idx, timestamp = null) => {
    //     try {
    //         console.log("playAudioClip Idx:", idx);
    //         // console.log("Sound: ", audioClip.sound);
    //         console.log("Audio Clip Type: ",audioClip.playback_type);
    //         console.log("Audio Clip Duration: ", parseInt(audioClip.duration*1000));
    //         console.log("Audio Clip Start Time: ", audioClip.start_time);
    //         if(currentClipRef.current === null){
    //             currentClipRef.current = {
    //                 audio: audioClip.sound,
    //                 playbackType: audioClip.playback_type,
    //                 duration: audioClip.duration,
    //                 start_time: audioClip.start_time
    //             };
    //             if(timestamp){
    //                 await audioClip.sound.setPositionAsync(timestamp);
    //             }
    //             if(audioClip.playback_type === "extended"){
    //                 setIsVideoPlaying(false);
    //             }
    //             if(audioClip.playback_type === "inline" && isMuteEnabled){
    //                 setIsVideoMuted(true);
    //             }
    //             // await audioClip.sound.setVolumeAsync(currentDescriptionVolume/10);
    //             await audioClip.sound.playAsync();
    //             updateDescriptionVolume();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const pauseAudioClips = async () => {
    //     try {
    //         console.log("pauseAudioClips");
    //         if(currentClipRef.current){
    //             if(currentClipRef.current.playbackType === 'inline'){
    //                 await currentClipRef.current.audio.stopAsync();
    //                 currentClipRef.current = null;
    //             } else {
    //                 await currentClipRef.current.audio.pauseAsync();
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    let prevTimestamp = -1;
    const handleClipUpdates = async (status) => {
        console.log("handleClipUpdates");
        try {
            if(status.isLoaded){
                if(status.isPlaying){
                    console.log("Audio Clip is Playing");
                    console.log("Audio Clip current timestamp: ",status.positionMillis/1000);
                    // Manually checking if the audio clip has finished playing
                    // because for some clips, when they finish playing, the status doesn't change automatically
                    // if(currentClipRef && currentClipRef.current && 
                    //    status.positionMillis === prevTimestamp &&
                    //    status.positionMillis === parseInt(currentClipRef.current.duration*1000)){
                    //     console.log("Finished Playing Manually");
                    //     if(currentClipRef.current){
                    //         if(currentClipRef.current.playbackType === 'extended'){
                    //             setIsVideoPlaying(true);
                    //         } else {
                    //             setIsVideoMuted(false);
                    //         }
                    //         await currentClipRef.current.audio.stopAsync();
                    //         currentClipRef.current = null;
                    //     }
                    // } else {
                    //     prevTimestamp = status.positionMillis;
                    // }

                    // New Algo
                    if(currInlineAC){
                        await currInlineAC.setVolumeAsync(currentDescriptionVolume/10);
                    }
                    if(currExtendedAC){
                        await currExtendedAC.setVolumeAsync(currentDescriptionVolume/10);
                    }
                } else if(status.isBuffering){
                    console.log("Audio Clip Buffering");
                } else if(status.didJustFinish){
                    console.log("Finished Playing Automatically");
                    // if(currentClipRef.current){
                    //     if(currentClipRef.current.playbackType === 'extended'){
                    //         setIsVideoPlaying(true);
                    //     }
                    //     currentClipRef.current = null;
                    // }

                    // New Algo
                    if(currentInlineACRef && currentInlineACRef.current){
                        console.log("Inside if currInlineAC");
                        setCurrInlineAC(null);
                        setIsVideoMuted(false);
                        // currentAudio.unload() // Unload current clip
                    }
                    if(currentExtendedACRef && currentExtendedACRef.current){
                        setCurrExtendedAC(null);
                        setIsVideoPlaying(true);
                        // currentAudio.unload() // Unload current clip
                        setCurrentExtACPaused(false);
                    }
                }
            } else {
                if(status.error) {
                    console.log("Error while playing audio clip: ", status.error);
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const showChangeDescriptionModal = () => {
        setChangeDescriptionModalVisible(true);
    }

    const hideChangeDescriptionModal = async () => {
        // stopProgressWatcher();
        if(timer){
            clearInterval(timer);
        }
        videoPlayerRef.current?.seekTo(0,true);
        // if(currentClipRef.current){
        //     await currentClipRef.current.audio.stopAsync();
        //     currentClipRef.current = null;
        // }
        if(currInlineAC){
            await currInlineAC.stopAsync();
        }
        if(currExtendedAC){
            await currExtendedAC.stopAsync();
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
        try {
            // if(currentClipRef.current){
            //     await currentClipRef.current.audio.setVolumeAsync(currentDescriptionVolume/10);
            // }
            if(currInlineAC){
                await currInlineAC.setVolumeAsync(currentDescriptionVolume/10);
            }
            if(currExtendedAC){
                await currExtendedAC.setVolumeAsync(currentDescriptionVolume/10);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const stopYTVideo = async () => {
        console.log("stopYTVideo Clicked");
        try {
            if(videoPlayerRef && videoPlayerRef.current){
                setIsVideoPlaying(false);
                const duration = await videoPlayerRef.current.getDuration();
                await videoPlayerRef.current.seekTo(duration);
                // stopProgressWatcher();
                // if(currentClipRef && currentClipRef.current){
                //     await currentClipRef.current.audio.stopAsync();
                //     currentClipRef.current = null;
                // }
                if(timer){
                    clearInterval(timer);
                }
                if(currInlineAC){
                    await currInlineAC.stopAsync();
                }
                if(currExtendedAC){
                    await currExtendedAC.stopAsync();
                }
                setElapsed('00:00');
                setElapsedAccessibilityLabel('Zero minutes, zero seconds');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const forwardYTVideo = async (seconds) => {
        console.log("forwardYTVideo Clicked");
        try {
            if(videoPlayerRef && videoPlayerRef.current){
                const currentTime = await videoPlayerRef.current.getCurrentTime();
                setPreviousYTTime(currentTime);
                await videoPlayerRef.current.seekTo(currentTime + seconds);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const backwardYTVideo = async (seconds) => {
        console.log("backwardYTVideo Clicked");
        try {
            if(videoPlayerRef && videoPlayerRef.current){
                const currentTime = await videoPlayerRef.current.getCurrentTime();
                setPreviousYTTime(currentTime);
                await videoPlayerRef.current.seekTo(currentTime - seconds);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const toggleMute = () => setIsMuteEnabled(previousState => !previousState);

    // useEffect(() => {
    //     getAudioDescriptions();

    //     const interval = setInterval(async () => {
    //         try {
    //             const elapsed_sec = await videoPlayerRef.current?.getCurrentTime();
        
    //             // calculations
    //             const elapsed_ms = Math.floor(elapsed_sec * 1000);
    //             const ms = elapsed_ms % 1000;
    //             const min = Math.floor(elapsed_ms / 60000);
    //             const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);
            
    //             setElapsed(
    //                 min.toString().padStart(2, '0') +
    //                 ':' +
    //                 seconds.toString().padStart(2, '0')
    //             );
    //             setElapsedAccessibilityLabel(`${min} minutes, ${seconds} seconds`);
    //         } catch (error) {
    //             console.log("Error: ", error);
    //         }
    //     }, 800);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, []);

    return (
        <SafeAreaView style={styles.container}>
            <YoutubePlayer
                ref={videoPlayerRef}
                height={deviceWidth * 9 / 16} // Setting the height to 9/16th of the device's width as the video player's aspect ratio is 16:9
                play={isVideoPlaying}
                videoId={video.videoId}
                mute={true} // Change from true to isVideoMuted
                onChangeState={onVPStateChange}
            />
            <View style={{ height: remainingHeight }}>
                <View style={styles.mediaControls}>
                    <Pressable
                        style={styles.mediaControlBtn}
                        onPress={() => setIsVideoPlaying(!isVideoPlaying)}
                        accessibilityLabel={ isVideoPlaying ? "Pause video." : "Play video."}
                        accessibilityRole="button"
                    >
                        {
                            isVideoPlaying ?
                            <FontAwesome5 name = 'pause' size = {30} color = {'#384488'} /> :
                            <FontAwesome5 name = 'play' size = {30} color = {'#384488'} />
                        }
                    </Pressable>
                    <Text
                        style={{fontSize: 20, fontWeight: 'bold', paddingHorizontal: 30}}
                        accessibilityLabel={elapsedAccessibilityLabel}
                    >
                        Elapsed Time : {elapsed}
                    </Text>
                </View>
                <View style={{ height: '59%' }}>
                    <VideoInfo video={video}/>
                    <SelectedDescriptionBox
                        user={audioDescriptionsIdsUsers[selectedAudioDescriptionId]}
                        showRateDescriptionModal={showRateDescriptionModal}
                    />
                    <DescriptionOptions
                        numberOfDescriptions={audioDescriptions ? audioDescriptions.length : 0}
                        showChangeDescriptionModal={showChangeDescriptionModal}
                    />
                </View>
                {
                    audioDescriptions &&
                    audioDescriptions.length > 0 &&
                    <View style={styles.muteSwitchContainer}>
                        <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                            Mute video volume while incline clips are playing?
                        </Text>
                        <Switch
                            trackColor={{false: '#767577', true: '#384488'}}
                            thumbColor={isMuteEnabled ? '#f4f3f4' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleMute}
                            value={isMuteEnabled}
                        />
                    </View>
                }
                {
                    audioDescriptions &&
                    audioDescriptions.length > 0 &&
                    <View style={styles.sliderContainerView}>
                        <Text
                            style={{color: '#fff', fontSize: 16}}
                            accessibilityLabel={`Description Volume. Currently set to ${currentDescriptionVolume}`}
                        >
                            Description Volume
                        </Text>
                        <View style={styles.descriptionVolume}>
                            <Pressable
                                style={styles.descriptionVolumeBtn}
                                onPress={decrementDescriptionVolume}
                                disabled={currentDescriptionVolume <= 0}
                                accessibilityLabel="Decrease Description Volume."
                                accessibilityRole="button"
                                accessibilityHint="Click to decrease the description volume by 1."
                            >
                                <FontAwesome5 name = 'minus' size = {16} color = {'#384488'} />
                            </Pressable>
                            <Text
                                style={styles.descriptionVolumeText}
                                accessibilityLabel={`Description volume is set to ${currentDescriptionVolume}.`}
                            >
                                {currentDescriptionVolume}
                            </Text>
                            <Pressable
                                style={styles.descriptionVolumeBtn}
                                onPress={incrementDescriptionVolume}
                                disabled={currentDescriptionVolume >= 10}
                                accessibilityLabel="Increase Description Volume."
                                accessibilityRole="button"
                                accessibilityHint="Click to increase the description volume by 1."
                            >
                                <FontAwesome5 name = 'plus' size = {16} color = {'#384488'} />
                            </Pressable>
                        </View>
                    </View>
                }
                <View style={styles.mediaControls}>
                    <TouchableOpacity
                        style={styles.mediaControlBtn}
                        onPress={() => backwardYTVideo(30)}
                        accessibilityLabel="Rewind 30 seconds"
                        accessibilityRole="button"
                        accessibilityHint="Double tab to jump back 30 seconds in the video."
                    >
                        <FontAwesome5 name = 'fast-backward' size = {24} color = {'#384488'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mediaControlBtn}
                        onPress={() => backwardYTVideo(5)}
                        accessibilityLabel="Rewind 5 seconds"
                        accessibilityRole="button"
                        accessibilityHint="Double tab to jump back 5 seconds in the video."
                    >
                        <FontAwesome5 name = 'backward' size = {24} color = {'#384488'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mediaControlBtn}
                        onPress={stopYTVideo}
                        accessibilityLabel="Stop video"
                        accessibilityRole="button"
                        accessibilityHint="Double tap to stop playing the video and audio clips."
                    >
                        <FontAwesome5 name = 'stop' size = {24} color = {'#384488'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mediaControlBtn}
                        onPress={() => forwardYTVideo(5)}
                        accessibilityLabel="Forward 5 seconds"
                        accessibilityRole="button"
                        accessibilityHint="Double tab to jump forward 5 seconds in the video."
                    >
                        <FontAwesome5 name = 'forward' size = {24} color = {'#384488'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mediaControlBtn}
                        onPress={() => forwardYTVideo(30)}
                        accessibilityLabel="Forward 30 seconds"
                        accessibilityRole="button"
                        accessibilityHint="Double tab to jump forward 30 seconds in the video."
                    >
                        <FontAwesome5 name = 'fast-forward' size = {24} color = {'#384488'} />
                    </TouchableOpacity>
                </View>
                {/* <View style={{ height: '1%', backgroundColor: 'red' }}></View> */}
            </View>
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
        </SafeAreaView>
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
        height: '10%',
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
    },
    mediaControls: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '10%',
        paddingHorizontal: 10,
        backgroundColor: 'gray'
    },
    mediaControlBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        width: '16%'
    },
    muteSwitchContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '10%',
        paddingHorizontal: 10,
        backgroundColor: 'gray'
    }
});