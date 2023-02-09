import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountScreen from './screens/AccountScreen';
import HelpAndSupportModal from '../components/HelpAndSupportModal';
import CreditsModal from '../components/CreditsModal';
import ContactUsModal from '../components/ContactUsModal';

const Stack = createNativeStackNavigator();

export default function AccountScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName={'Account'}>
            <Stack.Screen name={'Account'} component={AccountScreen} options={{headerShown: false}}/>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name={'Help And Support'} component={HelpAndSupportModal} />
                <Stack.Screen name={'Credits'} component={CreditsModal} />
                <Stack.Screen name={'Contact Us'} component={ContactUsModal} />
            </Stack.Group>
        </Stack.Navigator>
    );
}