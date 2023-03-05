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

// Function to fetch searched videos
const getSearchedVideos = async (searchTerm, page=1) => {
    try {
        const response = await apiClient.get(`/wishlist/search?search=${searchTerm}&page=${page}`);
        if(response.data){
            const videos = response.data.result.items;
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
    getWishlistVideos,
    getSearchedVideos
}