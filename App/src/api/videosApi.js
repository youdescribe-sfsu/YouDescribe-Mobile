import apiClient from './client';

// import { convertISO8601ToSeconds, convertSecondsToCardFormat, TMP } from '../shared/helperFunctions';

const convertISO8601ToSeconds = (input) => {
    const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let totalseconds;
    if (reptms.test(input)) {
      const matches = reptms.exec(input);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      totalseconds = (hours * 3600) + (minutes * 60) + seconds;
    }
    return (totalseconds);
}

const convertSecondsToCardFormat = (timeInSeconds) => {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds);
    // let milliseconds = Math.floor((timeInSeconds - Math.floortimeInSeconds) * 100);
    if (hours >= 24) hours = Math.floor(hours % 24);
    // if (hours < 10) hours = '0' + hours;
    if (minutes >= 60) minutes = Math.floor(minutes % 60);
    if (minutes < 10 && timeInSeconds >= 3600) minutes = `0${minutes}`;
    if (seconds >= 60) seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    // if (milliseconds < 10) milliseconds = `0${milliseconds}`;
  
    return timeInSeconds < 3600 ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

// Function to fetch all videos
const getAllVideos = async () => {
    try {
        const response = await apiClient.get('/videos');
        if(response.data){
            return response.data.result;
        }
        return []
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

// Function to generate a comma-separated string of youtubeIds of all the given videos.
const generateYoutubeIdsString = (videos) => {
    let youtubeIds = [];
    // Only getting youtubeIds of the first 20 videos for now.
    // TODO: Change 20 to videos.length
    for (let i = 0; i < 20; i++) {
        const video = videos[i];
        youtubeIds.push(video.youtube_id);
    }
    return youtubeIds.join(',');
}

// Function to fetch title, channel title, and thumbnail url of all videos.
const getVideosData = async () => {
    try {
        const videos = await getAllVideos();
        const youtubeIds = generateYoutubeIdsString(videos);
        const response = await apiClient.get(`/videos/getyoutubedatafromcache?youtubeids=${youtubeIds}&key=home`);

        if(response.data){
            const result = JSON.parse(response.data.result);
            const items = result.items;
            const videoData = [];
            for (let i = 0; i < items.length; i++) {
                const snippet = items[i].snippet;
                const duration = convertSecondsToCardFormat(
                    convertISO8601ToSeconds(items[i].contentDetails.duration)
                );
                const obj = {
                    id: i,
                    title: snippet.title,
                    channel: snippet.channelTitle,
                    thumbnail: snippet.thumbnails.medium.url,
                    duration: duration
                }
                videoData.push(obj);
            }
            return videoData;
        }
        return [];
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

export default {
    getAllVideos,
    getVideosData
}