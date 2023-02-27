import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import MyDescriptionsScreen from './screens/MyDescriptionsScreen';
import VideoScreen from './screens/VideoScreen';

const Stack = createNativeStackNavigator();

export default function MyDescriptionsScreenNavigator({ navigation, route }) {

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
        <Stack.Navigator initialRouteName={'My Descriptions'}>
            <Stack.Screen 
                name={'My Descriptions'}
                component={MyDescriptionsScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={'Video'}
                component={VideoScreen}
                options={{
                    title: 'Video Player',
                    headerBackTitle: 'My Descriptions'
                }}
            />
        </Stack.Navigator>
    );
}