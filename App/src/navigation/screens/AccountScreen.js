import { StyleSheet, Text, View, TouchableOpacity, Alert, Button } from 'react-native';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser, useUserUpdate } from '../../contexts/UserContext';
import UserInfo from '../../components/UserInfo';
import { expoClientId, iosClientId, androidClientId, youDescribeApi } from '../../api/client';

WebBrowser.maybeCompleteAuthSession();

export default function AccountScreen({navigation}) {

  const user = getUser();
  const updateUser = useUserUpdate();
  const [idToken, setIdToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: "id_token",
    expoClientId: expoClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId
  });

  const fetchUserInfo = async () => {
    try {
      const userInfoResponse = await fetch(`${youDescribeApi}/auth`, {
        method: 'POST',
        body: JSON.stringify({ googleToken: idToken }),
        headers: { 'Content-Type': 'application/json' }
      });
      let userInfo = await userInfoResponse.json();
      userInfo = JSON.stringify(userInfo.result);
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

  const openHelpAndSupport = () => {
    navigation.navigate('Help And Support');
  }

  const openCredits = () => {
    navigation.navigate('Credits');
  }

  const openContactUs = () => {
    navigation.navigate('Contact Us');
  }

  useEffect(() => {
    if (response?.type === 'success') {
      setIdToken(response.params.id_token);
      if(idToken){
        fetchUserInfo();
      }
    }
  }, [response, idToken]);

  return(
    <View style={styles.container} >
      <UserInfo loginUser={loginUser} logoutUser={logoutUser}/>
      <View style={styles.accountOptions}>
        <TouchableOpacity onPress={openHelpAndSupport}>
          <View style={styles.accountOption}>
            <Ionicons name = 'help-circle' size = '22' color = '#000' />
            <Text style={styles.accountOptionText}>Help And Support</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openCredits}>
          <View style={styles.accountOption}>
            <Ionicons name = 'people' size = '22' color = '#000' />
            <Text style={styles.accountOptionText}>Credits</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openContactUs}>
          <View style={styles.accountOption}>
            <Ionicons name = 'mail' size = '22' color = '#000' />
            <Text style={styles.accountOptionText}>Contact Us</Text>
          </View>
        </TouchableOpacity>
      </View>
      {user ? <LogoutButton /> : <View />}
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
  },
  accountOptions: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 14
  },
  accountOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10
  },
  accountOptionText: {
    marginLeft: 10,
    fontSize: 16
  }
});