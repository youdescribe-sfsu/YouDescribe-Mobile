import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { SearchProvider } from '../contexts/SearchContext';

import SearchBar from '../components/SearchBar';

//Screens
import MyDescriptionsScreen from './screens/MyDescriptionsScreen';
import SettingsScreen from './screens/SettingsScreen';

import HomeScreenNavigator from './HomeScreenNavigator';
import WishlistScreenNavigator from './WishlistScreenNavigator';
import SearchScreenNavigator from './SearchScreenNavigator';

//Screen Names
const homeName = 'Home Navigator';
const searchName = 'Search Navigator';
const wishlistName = 'Wishlist Navigator';
const myDescriptionsName = 'My Descriptions';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <SearchProvider>
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
                tabBarLabelStyle: styles.label,
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle
            })}>

            <Tab.Screen
                name={homeName}
                component={HomeScreenNavigator}
                options={{ title: 'YouDescribe',
                           tabBarLabel: 'Home',
                           tabBarAccessibilityLabel: 'Recent Videos',
                        }}
            />
            <Tab.Screen
                name={searchName}
                component={SearchScreenNavigator}
                options={{ headerTitle: () => <SearchBar />,
                           tabBarLabel: 'Search',
                           tabBarAccessibilityLabel: 'Search Videos',
                        }}
            />
            <Tab.Screen
                name={wishlistName}
                component={WishlistScreenNavigator}
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
      </SearchProvider>
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
    height: 80
  },
  header: {
    backgroundColor: '#434344'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});