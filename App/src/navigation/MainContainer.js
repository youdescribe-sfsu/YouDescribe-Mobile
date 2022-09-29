import * as React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import RecentVideosScreen from './screens/RecentVideosScreen';
import SearchScreen from './screens/SearchScreen';
import WishlistScreen from './screens/WishlistScreen';
import MyDescriptionsScreen from './screens/MyDescriptionsScreen';
import SettingsScreen from './screens/SettingsScreen';

//Screen Names
const recentVideosName = 'Recent Videos';
const searchName = 'Search';
const wishlistName = 'Wishlist';
const myDescriptionsName = 'My Descriptions';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
        <Tab.Navigator
            initialRouteName={recentVideosName}
            screenOptions={({route}) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === recentVideosName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === searchName) {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (rn === settingsName) {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name = {iconName} size = {size} color = {color} />
                }
            })}>

            <Tab.Screen
                name={recentVideosName}
                component={RecentVideosScreen}
                options={{ title: 'YouDescribe' }}
            />
            <Tab.Screen
                name={searchName}
                component={SearchScreen}
            />
            <Tab.Screen
                name={settingsName}
                component={SettingsScreen}
            />

        </Tab.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });