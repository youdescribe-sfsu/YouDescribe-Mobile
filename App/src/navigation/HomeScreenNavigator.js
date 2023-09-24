import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';
import VideoScreen from './screens/VideoScreen';

const Stack = createNativeStackNavigator();

export default function HomeScreenNavigator({ navigation, route }) {

    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "Video"){
            navigation.setOptions({tabBarStyle: {display: 'none'}, headerShown: false});
        }else {
            navigation.setOptions({tabBarStyle: {   display: 'flex',
                                                    backgroundColor: '#434344',
                                                    height: 80
                                                },
                                    headerShown: true});
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{ animation: 'none' }}
        >
            <Stack.Screen 
                name={'Home'}
                component={HomeScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={'Video'}
                component={VideoScreen}
                options={{
                    title: 'Video Player with Audio Descriptions',
                    headerBackTitle: 'YouDescribe'
                }}
            />
        </Stack.Navigator>
    );
}