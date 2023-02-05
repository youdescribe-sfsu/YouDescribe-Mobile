import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUser, useUserUpdate } from '../../contexts/UserContext';

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {

  const user = getUser();
  const updateUser = useUserUpdate();
  const [accessToken, setAccessToken] = useState(null);
  // const [rerender, setRerender] = useState(false);

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
      let userInfo = await userInfoResponse.json();
      userInfo = JSON.stringify(userInfo);
      // console.log(userInfo);
      await AsyncStorage.setItem("authCredentials", userInfo);
      updateUser(userInfo);
    } catch (error) {
      console.log(error);
    }
  }

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem("authCredentials");
      updateUser(null);
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
      setAccessToken(response.authentication.accessToken);
      if(accessToken){
        fetchUserInfo();
      }
    }
  }, [response, accessToken]);

  // useEffect(() => {
  //   setRerender(!rerender);
  // }, [user]);

  if(user){
    return(
      <View style={styles.container} >
        <ShowUserInfo />
        <Button 
          title='Logout'
          onPress={() => {
            logoutUser();
          }}
        />
      </View>
    );
  }
  
  return(
    <View style={styles.container} >
      <Text>Settings Screen</Text>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync({ useProxy: true });
        }}
      />
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