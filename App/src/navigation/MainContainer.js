import { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { SearchProvider } from '../contexts/SearchContext';
import { useUserUpdate, getUser } from '../contexts/UserContext';

import SearchBar from '../components/SearchBar';

//Navigators
import HomeScreenNavigator from './HomeScreenNavigator';
import WishlistScreenNavigator from './WishlistScreenNavigator';
import SearchScreenNavigator from './SearchScreenNavigator';
import AccountScreenNavigator from './AccountScreenNavigator';
import MyDescriptionsScreenNavigator from './MyDescriptionsScreenNavigator';

//Screen Names
const homeName = 'Home Navigator';
const searchName = 'Search Navigator';
const wishlistName = 'Wishlist Navigator';
const myDescriptionsName = 'My Descriptions Navigator';
const accountName = 'Account Navigator';

const Tab = createBottomTabNavigator();

export default function MainContainer({userInfo}) {

  const updateUser = useUserUpdate();
  const user = getUser();

  useEffect(() => {
    if(userInfo){
      updateUser(userInfo);
    }
  },[]);

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
                    } else if (rn === accountName && !user) {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    } else if(rn === accountName && user) {
                        if(focused){
                          return <Image
                                    source={{uri: user.picture}}
                                    style={{width: size, height: size, borderRadius: 50, borderWidth: 2, borderColor: color}}
                                  />
                        }
                        return <Image
                                  source={{uri: user.picture}}
                                  style={{width: size, height: size, borderRadius: 50}}
                                />
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
                component={MyDescriptionsScreenNavigator}
                options={{ title: 'My Descriptions',
                           tabBarLabel: 'My Descriptions',
                           tabBarAccessibilityLabel: 'My Descriptions',
                        }}
            />
            <Tab.Screen
                name={accountName}
                component={AccountScreenNavigator}
                options={{ title: 'Account',
                           tabBarLabel: 'Account',
                           tabBarAccessibilityLabel: 'Account, Help and Settings',
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