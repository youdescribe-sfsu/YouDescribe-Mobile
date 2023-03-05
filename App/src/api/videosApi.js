import { apiClient, youTubeApiClient, youTubeApiKey } from './client';

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

// Function to fetch described searched videos
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

// Function to fetch non-described searched videos
const getSearchedVideosFromYoutube = async(searchTerm, page=1) => {
    try {
        const response = await apiClient.get(`/videos/search?q=${searchTerm}&page=${page}`);
        if(response.data){
            const describedVideos = response.data.result;
            let describedVideoIds = [];
            describedVideos.forEach((video) => {
                describedVideoIds.push(video.youtube_id);
            });
            let youTubeSearchResults = await youTubeApiClient.get(`/search?part=snippet&q=${searchTerm}&maxResults=50&key=${youTubeApiKey}`);
            youTubeSearchResults = youTubeSearchResults.data.items;
            let nonDescribedVideoIds = [];
            youTubeSearchResults.forEach((video) => {
                if(describedVideoIds.indexOf(video.id.videoId) <= -1){
                    nonDescribedVideoIds.push(video.id.videoId);
                }
            });
            nonDescribedVideoIds = nonDescribedVideoIds.join(",");
            let videosFromYouTube = await youTubeApiClient.get(`/videos?id=${nonDescribedVideoIds}&part=contentDetails,snippet,statistics&key=${youTubeApiKey}`);
            videosFromYouTube = videosFromYouTube.data.items;
            const videoData = [];
            videosFromYouTube.forEach((video) => {
                const snippet = video.snippet;
                const duration = convertSecondsToCardFormat(
                    convertISO8601ToSeconds(video.contentDetails.duration)
                );
                const obj = {
                    title: snippet.title,
                    channel: snippet.channelTitle,
                    thumbnail: snippet.thumbnails.medium.url,
                    duration: duration,
                    videoId: video.id,
                    publishedAt: convertISO8601ToDate(snippet.publishedAt),
                    likes: convertLikesToCardFormat(video.statistics.likeCount),
                    views: convertViewsToCardFormat(video.statistics.viewCount)
                }
                videoData.push(obj);
            });
            return videoData;
        }
        return [];
    } catch (error) {
        console.log(error);
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
    getSearchedVideosFromYoutube,
    getUserVideos,
    getVideosData,
    getAudioDescriptions
}