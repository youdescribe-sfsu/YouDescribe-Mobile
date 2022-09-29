import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
                    } else if (rn === wishlistName) {
                        iconName = focused ? 'heart' : 'heart-outline';
                    }else if (rn === myDescriptionsName) {
                        return <FontAwesome5 name = 'audio-description' size = {size} color = {color} />
                    } else if (rn === settingsName) {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name = {iconName} size = {size} color = {color} />
                },
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.label
            })}>

            <Tab.Screen
                name={recentVideosName}
                component={RecentVideosScreen}
                options={{ title: 'YouDescribe',
                           tabBarLabel: 'Home',
                           tabBarAccessibilityLabel: 'Recent Videos',
                        }}
            />
            <Tab.Screen
                name={searchName}
                component={SearchScreen}
                options={{ title: 'Search',
                           tabBarLabel: 'Search',
                           tabBarAccessibilityLabel: 'Search Videos',
                        }}
            />
            <Tab.Screen
                name={wishlistName}
                component={WishlistScreen}
                options={{ title: 'Wishlist',
                           tabBarLabel: 'Wishlist',
                           tabBarAccessibilityLabel: 'Wishlist',
                        }}
            />
            <Tab.Screen
                name={myDescriptionsName}
                component={MyDescriptionsScreen}
                options={{ title: 'My Descriptions',
                           tabBarLabel: 'My Descriptions',
                           tabBarAccessibilityLabel: 'My Descriptions',
                        }}
            />
            <Tab.Screen
                name={settingsName}
                component={SettingsScreen}
                options={{ title: 'Settings',
                           tabBarLabel: 'Settings',
                           tabBarAccessibilityLabel: 'Help and Settings',
                        }}
            />

        </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: '9px',
    fontWeight: '700'
  },
  tabBar: {
    backgroundColor: '#434344',
    height: 80,
    padding: 10
  }
});