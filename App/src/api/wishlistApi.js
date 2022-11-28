import { apiClient } from './client';
import videosApi from './videosApi';

// Function to fetch wishlist videos
const getWishlistVideos = async () => {
    try {
        const response = await apiClient.get('/wishlist');
        if(response.data){
            const videos = response.data.result;
            const videosData = await videosApi.getVideosData(videos);
            return videosData;
        }
        return []
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

export default {
    getWishlistVideos
}