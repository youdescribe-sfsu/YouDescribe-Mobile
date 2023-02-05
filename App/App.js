import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import { UserProvider } from './src/contexts/UserContext';
import MainContainer from "./src/navigation/MainContainer";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    async function prepare() {
      try {
        const authCredentials = await AsyncStorage.getItem("authCredentials");
        if(authCredentials){
          setUserInfo(authCredentials);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function hideSplashScreen() {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplashScreen();
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <UserProvider>
      <MainContainer userInfo={userInfo}/>
    </UserProvider>
  );
}