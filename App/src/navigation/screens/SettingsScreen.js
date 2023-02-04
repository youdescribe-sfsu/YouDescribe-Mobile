import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {

  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '3158679793-cd09i4qersgl0o0mdab1tfm7lqe9kg8q.apps.googleusercontent.com',
    iosClientId: '3158679793-l94a8t4asb14ar54ud9a93164sulh56l.apps.googleusercontent.com',
    androidClientId: '3158679793-rlr3itj0rt0j36eqt2tcucaslvl19oob.apps.googleusercontent.com'
  });

  const fetchUserInfo = async () => {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userInfo = await userInfoResponse.json();
    console.log(userInfo);
    setUser(userInfo);
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

  return (
    <View style={styles.container}>
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