import * as React from 'react';
<<<<<<< HEAD
import { StyleSheet } from 'react-native';
=======
import { StyleSheet, Text, View } from 'react-native';
>>>>>>> ceef559 (Updated navigation with all 5 screens)

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
<<<<<<< HEAD

import SearchBar from '../components/SearchBar';
=======
>>>>>>> ceef559 (Updated navigation with all 5 screens)

//Screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import WishlistScreen from './screens/WishlistScreen';
import MyDescriptionsScreen from './screens/MyDescriptionsScreen';
import SettingsScreen from './screens/SettingsScreen';

//Screen Names
const homeName = 'Home';
const searchName = 'Search';
const wishlistName = 'Wishlist';
const myDescriptionsName = 'My Descriptions';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
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
<<<<<<< HEAD
                tabBarLabelStyle: styles.label,
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle
            })}>

            <Tab.Screen
                name={homeName}
                component={HomeScreen}
=======
                tabBarLabelStyle: styles.label
            })}>

            <Tab.Screen
                name={recentVideosName}
                component={RecentVideosScreen}
>>>>>>> ceef559 (Updated navigation with all 5 screens)
                options={{ title: 'YouDescribe',
                           tabBarLabel: 'Home',
                           tabBarAccessibilityLabel: 'Recent Videos',
                        }}
            />
            <Tab.Screen
                name={searchName}
                component={SearchScreen}
<<<<<<< HEAD
                options={{ headerTitle: () => <SearchBar></SearchBar>,
=======
                options={{ title: 'Search',
>>>>>>> ceef559 (Updated navigation with all 5 screens)
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
<<<<<<< HEAD
    height: 80
  },
  header: {
    backgroundColor: '#434344'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
=======
    height: 80,
    padding: 10
>>>>>>> ceef559 (Updated navigation with all 5 screens)
  }
});