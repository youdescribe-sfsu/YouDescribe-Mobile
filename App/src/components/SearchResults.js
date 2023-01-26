import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import DescribedSearchResults from './DescribedSearchResults';
import WishlistSearchResults from './WishlistSearchResults';
import NonDescribedSearchResults from './NonDescribedSearchResults';

const Tab = createMaterialTopTabNavigator();

export default function SearchResults({stackNavigation}) {
    const DescribedSearchResultsComponent = () => {
        return (
            <DescribedSearchResults stackNavigation={stackNavigation}/>
        );
    }

    const WishlistSearchResultsComponent = () => {
        return (
            <WishlistSearchResults stackNavigation={stackNavigation}/>
        );
    }

    const NonDescribedSearchResultsComponent = () => {
        return (
            <NonDescribedSearchResults stackNavigation={stackNavigation}/>
        );
    }

    return (
        <NavigationContainer
            independent={true}
        >
            <Tab.Navigator>
                <Tab.Screen 
                    name='Described'
                    component={DescribedSearchResultsComponent}
                />
                <Tab.Screen 
                    name='Wishlist'
                    component={WishlistSearchResultsComponent}
                />
                <Tab.Screen 
                    name='Non-Described'
                    component={NonDescribedSearchResultsComponent}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}