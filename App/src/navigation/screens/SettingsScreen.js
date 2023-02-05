import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {

  const [appIsReady, setAppIsReady] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '3158679793-cd09i4qersgl0o0mdab1tfm7lqe9kg8q.apps.googleusercontent.com',
    iosClientId: '3158679793-l94a8t4asb14ar54ud9a93164sulh56l.apps.googleusercontent.com',
    androidClientId: '3158679793-rlr3itj0rt0j36eqt2tcucaslvl19oob.apps.googleusercontent.com'
  });

  const fetchUserInfo = async () => {
    try {
      let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userInfo = await userInfoResponse.json();
      console.log(userInfo);
      await AsyncStorage.setItem("authCredentials", JSON.stringify(userInfo));
      setUser(userInfo);
    } catch (error) {
      console.log(error);
    }
  }

  const ShowUserInfo = () => {
    if(user){
      return(
        <View>
          <Image source={{uri: user.picture}} style={{width: 100, height: 100, borderRadius: 50}}/>
          <Text>{user.name}</Text>
        </View>
      );
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      // const { authentication } = response;
      // console.log(authentication);
      setAccessToken(response.authentication.accessToken);
      if(accessToken){
        fetchUserInfo();
      }
    }
  }, [response, accessToken]);

  useEffect(() => {
    async function prepare() {
      try {
        const userInfo = await AsyncStorage.getItem("authCredentials");
        if(userInfo){
          setUser(JSON.parse(userInfo));
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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {user && <ShowUserInfo />}
      {user === null && 
        <>
          <Text>Settings Screen</Text>
          <Button
            disabled={!request}
            title="Login"
            onPress={() => {
              promptAsync({ useProxy: true });
            }}
          />
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});