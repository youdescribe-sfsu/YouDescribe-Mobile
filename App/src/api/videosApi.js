import apiClient from './client';

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
    // Only getting youtubeIds of the first 10 videos for now.
    // TODO: Change 10 to videos.length
    for (let i = 0; i < 10; i++) {
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
                const obj = {
                    id: i,
                    title: snippet.title,
                    channel: snippet.channelTitle,
                    thumbnail: snippet.thumbnails.medium.url
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