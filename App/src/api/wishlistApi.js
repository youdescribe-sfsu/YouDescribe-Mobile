import { apiClient, youDescribeApi } from './client';
import videosApi from './videosApi';

// Function to fetch wishlist videos
const getWishlistVideos = async () => {
    try {
        const response = await apiClient.get('/wishlist');
        if(response.data){
            const videos = response.data.result;
            // videos.forEach((video) => {console.log("Youtube ID: ", video.youtube_id, "Votes: ", video.votes, "Voted: ", video.voted)});
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

// Function to add a vote to a wishlist video
const upvoteVideo = async (youtubeId, userId, userToken) => {
    try {
        const response = await fetch(`${youDescribeApi}/wishlist`, {
            method: 'POST',
            body: JSON.stringify({
                youTubeId: youtubeId,
                userId: userId,
                userToken: userToken
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        let result = await response.json();
        return result;
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

export default {
    getWishlistVideos,
    getSearchedVideos,
    upvoteVideo
}