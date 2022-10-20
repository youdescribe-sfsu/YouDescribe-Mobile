import { apiClient } from './client';

import
{ convertISO8601ToSeconds,
  convertSecondsToCardFormat,
  generateYoutubeIdsString
} from '../shared/helperFunctions';

// Function to fetch all videos
const getHomeVideos = async () => {
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

// Function to fetch title, channel title, and thumbnail url of all videos.
const getVideosData = async () => {
    try {
        const videos = await getHomeVideos();
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
                    duration: duration,
                    videoId: items[i].id,
                    publishedAt: snippet.publishedAt,
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
    getVideosData
}