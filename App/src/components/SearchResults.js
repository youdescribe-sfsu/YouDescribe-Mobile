import { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import videosApi from '../api/videosApi';
import wishlistApi from '../api/wishlistApi';
import { useSearch } from '../contexts/SearchContext';

import VideoCardsList from './VideoCardsList';

const Tab = createMaterialTopTabNavigator();

export default function SearchResults({stackNavigation}) {
    const searchTerm = useSearch();
    const [describedVideos, setDescribedVideos] = useState([]);
    const [wishlistVideos, setWishlistVideos] = useState([]);
    const [nonDescribedVideos, setNonDescribedVideos] = useState([]);
    const DescribedSearchResultsComponent = () => {
        return (
            <VideoCardsList navigation={stackNavigation} videos={describedVideos} />
        );
    }
    const WishlistSearchResultsComponent = () => {
        return (
            <VideoCardsList navigation={stackNavigation} videos={wishlistVideos} buttons="upvote-describe"/>
        );
    }
    const NonDescribedSearchResultsComponent = () => {
        return (
            <VideoCardsList navigation={stackNavigation} videos={nonDescribedVideos} buttons="upvote-describe"/>
        );
    }
    const getVideos = async() => {
        const describedVideos = await videosApi.getSearchedVideos(searchTerm);
        setDescribedVideos(describedVideos);
        const wishlistVideos = await wishlistApi.getSearchedVideos(searchTerm);
        setWishlistVideos(wishlistVideos);
        const nonDescribedVideos = await videosApi.getSearchedVideosFromYoutube(searchTerm);
        setNonDescribedVideos(nonDescribedVideos);
    }

    useEffect(() => {
        getVideos();
    }, [searchTerm]);

    return (
        <NavigationContainer
            independent={true}
        >
            <Tab.Navigator>
                <Tab.Screen 
                    name='Described Search Results'
                    component={DescribedSearchResultsComponent}
                    options={{
                        tabBarLabel: "Described",
                        tabBarLabelStyle: { fontSize: 10 }
                    }}
                />
                <Tab.Screen 
                    name='Wishlist Search Results'
                    component={WishlistSearchResultsComponent}
                    options={{
                        tabBarLabel: "Wishlist",
                        tabBarLabelStyle: { fontSize: 10 }
                    }}
                />
                <Tab.Screen 
                    name='Non-Described Search Results'
                    component={NonDescribedSearchResultsComponent}
                    options={{
                        tabBarLabel: "Non-Described",
                        tabBarLabelStyle: { fontSize: 10 }
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}