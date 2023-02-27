import { apiClient } from './client';

import
{ convertISO8601ToSeconds,
  convertSecondsToCardFormat,
  generateYoutubeIdsString,
  convertISO8601ToDate,
  convertLikesToCardFormat,
  convertViewsToCardFormat
} from '../shared/helperFunctions';

// Function to fetch all videos
const getHomeVideos = async () => {
    try {
        const response = await apiClient.get('/videos');
        if(response.data){
            const videos = response.data.result;
            const videosData = await getVideosData(videos);
            return videosData;
        }
        return []
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

// Function to fetch searched videos
const getSearchedVideos = async (searchTerm, page=1) => {
    try {
        const response = await apiClient.get(`/videos/search?q=${searchTerm}&page=${page}`);
        if(response.data){
            const videos = response.data.result;
            const videosData = await getVideosData(videos);
            return videosData;
        }
        return []
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

// Function to fetch user described videos
const getUserVideos = async (userId) => {
    try {
        const response = await apiClient.get(`/videos/user/${userId}`);
        if(response.data){
            const videos = response.data.result;
            const videosData = await getVideosData(videos);
            return videosData;
        }
        return []
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

// Function to fetch title, channel title, and thumbnail url of all videos.
const getVideosData = async (videos) => {
    try {
        console.log("getVideosData videos length: ", videos.length);
        const youtubeIds = generateYoutubeIdsString(videos);
        const response = await apiClient.get(`/videos/getyoutubedatafromcache?youtubeids=${youtubeIds}&key=home`);
        if(response.data){
            const result = JSON.parse(response.data.result);
            console.log("Result: ", result);
            const items = result.items;
            const videoData = [];
            for (let i = 0; i < items.length; i++) {
                const snippet = items[i].snippet;
                const duration = convertSecondsToCardFormat(
                    convertISO8601ToSeconds(items[i].contentDetails.duration)
                );
                const obj = {
                    id: videos[i]._id,
                    title: snippet.title,
                    channel: snippet.channelTitle,
                    thumbnail: snippet.thumbnails.medium.url,
                    duration: duration,
                    videoId: items[i].id,
                    publishedAt: convertISO8601ToDate(snippet.publishedAt),
                    likes: convertLikesToCardFormat(items[i].statistics.likeCount),
                    views: convertViewsToCardFormat(items[i].statistics.viewCount)
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

const getAudioDescriptions = async (videoId) => {
    try {
        const response = await apiClient.get(`/videos/${videoId}`);
        if(response.data){
            const video = response.data.result;
            return video.audio_descriptions;
        }
        return [];
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

export default {
    getHomeVideos,
    getSearchedVideos,
    getUserVideos,
    getVideosData,
    getAudioDescriptions
}