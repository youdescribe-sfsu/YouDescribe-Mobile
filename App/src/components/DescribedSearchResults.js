import { useState, useEffect } from 'react';
import VideoCardsList from './VideoCardsList';

import videosApi from '../api/videosApi';

import { useSearch } from '../contexts/SearchContext';

export default function DescribedSearchResults({stackNavigation}) {
    console.log("Described Search Results");
    const searchTerm = useSearch();
    const [videos, setVideos] = useState([]);
    const getVideos = async() => {
        console.log("Described Search Term",searchTerm);
        const videos = await videosApi.getSearchedVideos(searchTerm);
        setVideos(videos);
    }

    useEffect(() => {
        getVideos();
    },[searchTerm]);

    return (
        <VideoCardsList videos={videos} navigation={stackNavigation} ></VideoCardsList>
    );
}