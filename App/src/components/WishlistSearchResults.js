import { useState, useEffect } from 'react';
import VideoCardsList from './VideoCardsList';

import wishlistApi from '../api/wishlistApi';

import { useSearch } from '../contexts/SearchContext';

export default function WishlistSearchResults({stackNavigation}) {
    console.log("Wishlist Search Results");
    const searchTerm = useSearch();
    const [videos, setVideos] = useState([]);
    const getVideos = async() => {
        console.log("Wishlist Search Term",searchTerm);
        const videos = await wishlistApi.getSearchedVideos(searchTerm);
        setVideos(videos);
    }

    useEffect(() => {
        getVideos();
    },[searchTerm]);

    return (
        <VideoCardsList videos={videos} navigation={stackNavigation} ></VideoCardsList>
    );
}