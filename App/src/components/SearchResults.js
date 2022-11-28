import { useState, useEffect } from 'react';
import VideoCardsList from './VideoCardsList';

import videosApi from '../api/videosApi';

import { useSearch } from '../contexts/SearchContext';

export default function SearchResults({navigation}) {
    const searchTerm = useSearch();
    const [videos, setVideos] = useState([]);
    const getVideos = async() => {
        const videos = await videosApi.getSearchedVideos(searchTerm);
        setVideos(videos);
    }

    useEffect(() => {
        getVideos();
    },[searchTerm]);

    return (
        <VideoCardsList videos={videos} navigation={navigation} ></VideoCardsList>
    );
}