import apiClient from './client';

const getAllVideos = async () => {
    try {
        let videoData = [];
        const response = await apiClient.get('/videos');
        if(response.data){
            let youtubeIds = [];
            for (let i = 0; i < 10; i++) {
                const video = response.data.result[i];
                youtubeIds.push(video.youtube_id);
            }
            youtubeIds = youtubeIds.join(',');
            const response2 = await apiClient.get(`/videos/getyoutubedatafromcache?youtubeids=${youtubeIds}&key=home`);
            const result = JSON.parse(response2.data.result);
            const items = result.items;
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
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

export default {
    getAllVideos
}