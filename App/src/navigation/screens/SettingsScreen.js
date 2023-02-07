import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser, useUserUpdate } from '../../contexts/UserContext';

import UserInfo from '../../components/UserInfo';

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {

  const user = getUser();
  const updateUser = useUserUpdate();
  const [accessToken, setAccessToken] = useState(null);

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
      await AsyncStorage.setItem("authCredentials", userInfo);
      updateUser(userInfo);
    } catch (error) {
      console.log(error);
    }
  }

  const loginUser = () => {
    promptAsync({useProxy: true});
  }

  const logoutUser = async (promptLogin) => {
    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out from this account?',
      [
        {
          text: 'Cancel',
          onPress: () => {return null;},
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("authCredentials");
              updateUser(null);
              if(promptLogin){
                loginUser();
              }
            } catch (error) {
              console.log(error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  }

  const LogoutButton = () => {
    return(
      <TouchableOpacity onPress={() => logoutUser(false)}>
        <View style={styles.logoutBtn}>
          <Ionicons name = 'log-out-outline' size = '28' color = '#db411a' />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
      if(accessToken){
        fetchUserInfo();
      }
    }
  }, [response, accessToken]);

  return(
    <View style={styles.container} >
      <UserInfo loginUser={loginUser} logoutUser={logoutUser}/>
      {user && <LogoutButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  },
  logoutBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdcdc',
    paddingVertical: 10,
    marginBottom: 0
  },
  logoutBtnText: {
    fontSize: 18,
    color: '#db411a',
    marginLeft: 15
  }
});