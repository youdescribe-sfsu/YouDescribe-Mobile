import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
        if(describedVideos && describedVideos.length > 0){
            return (
                <VideoCardsList navigation={stackNavigation} videos={describedVideos} />
            );
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No Results</Text>
            </View>
        );
    }
    const WishlistSearchResultsComponent = () => {
        if(wishlistVideos && wishlistVideos.length > 0){
            return (
                <VideoCardsList navigation={stackNavigation} videos={wishlistVideos} buttons="upvote-describe"/>
            );
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No Results</Text>
            </View>
        );
    }
    const NonDescribedSearchResultsComponent = () => {
        if(nonDescribedVideos && nonDescribedVideos.length > 0){
            return (
                <VideoCardsList navigation={stackNavigation} videos={nonDescribedVideos} buttons="upvote-describe"/>
            );
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No Results</Text>
            </View>
        );
    }
    const getVideos = async() => {
        const term = searchTerm.toUpperCase();
        const describedVideos = await videosApi.getSearchedVideos(term);
        setDescribedVideos(describedVideos);
        const wishlistVideos = await wishlistApi.getSearchedVideos(term);
        setWishlistVideos(wishlistVideos);
        const nonDescribedVideos = await videosApi.getSearchedVideosFromYoutube(term);
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
                        tabBarAccessibilityLabel: `Described video results for ${searchTerm}`,
                        tabBarLabelStyle: { fontSize: 10 }
                    }}
                />
                <Tab.Screen 
                    name='Wishlist Search Results'
                    component={WishlistSearchResultsComponent}
                    options={{
                        tabBarLabel: "Wishlist",
                        tabBarAccessibilityLabel: `Wishlist video results for ${searchTerm}`,
                        tabBarLabelStyle: { fontSize: 10 }
                    }}
                />
                <Tab.Screen 
                    name='Non-Described Search Results'
                    component={NonDescribedSearchResultsComponent}
                    options={{
                        tabBarLabel: "Non-Described",
                        tabBarAccessibilityLabel: `Non-Described video results for ${searchTerm}`,
                        tabBarLabelStyle: { fontSize: 10 }
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}