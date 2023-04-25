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

// Function to add a vote to a wishlist video
// TODO: This function is not working at the moment. Returns a status code 504.
const upvoteVideo = async (youtubeId, userId, userToken) => {
    try {
        // console.log("youtubeId: ", youtubeId);
        // console.log("userId: ", userId);
        // console.log("userToken: ", userToken);
        const response = await fetch(`https://api.youdescribe.org/v1/wishlist`, {
            method: 'POST',
            body: JSON.stringify({
                youtubeId: youtubeId,
                userId: userId,
                userToken: userToken
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("Success Upvote", response);
    } catch (error) {
        if(error.code === 67){
            console.log("It is not possible to vote again for this video.");
        } else {
            console.log("It was impossible to vote. Maybe your session has expired. Try to logout and login again.");
            console.log(error);
        }
    }
}

export default {
    getWishlistVideos,
    getSearchedVideos,
    upvoteVideo
}