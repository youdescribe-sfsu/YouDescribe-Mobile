import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import VideoScreen from './screens/VideoScreen';

const Stack = createNativeStackNavigator();

export default function HomeScreenNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={({route}) => ({
                headerShown: false
            })}
        >
            <Stack.Screen 
                name={'Home'}
                component={HomeScreen}
            />
            <Stack.Screen
                name={'Video'}
                component={VideoScreen}
            />
        </Stack.Navigator>
    );
}