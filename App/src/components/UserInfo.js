import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { getUser } from '../contexts/UserContext';

export default function UserInfo({loginUser, logoutUser}) {

    const user = getUser();

    if(user){
        return(
            <View style={styles.container}>
                <Image source={{uri: user.picture}} style={styles.userImage}/>
                <Text style={styles.userName} accessibilityLabel={`Signed in as ${user.name}`}>
                    {user.name}
                </Text>
                <Text style={styles.userEmail} accessibilityLabel={`Signed in with email ${user.email}`}>
                    {user.email}
                </Text>
                <TouchableOpacity onPress={() => logoutUser(true)} accessibilityRole="button">
                    <View style={styles.loginBtn}>
                        <Image style={styles.loginBtnImg} source={require('../assets/google_logo.png')} />
                        <Text style={styles.loginBtnText}>Sign In with another account</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <Image source={require('../assets/user_placeholder.webp')} style={styles.userImage}/>
            <Text style={{marginTop: 5}}>Please Sign In to access more features.</Text>
            <TouchableOpacity onPress={loginUser} accessibilityRole="button">
                <View style={styles.loginBtn}>
                    <Image style={styles.loginBtnImg} source={require('../assets/google_logo.png')} />
                    <Text style={styles.loginBtnText}>Sign In with Google</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      backgroundColor: '#f7fafa',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20
    },
    userName: {
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 16
    },
    userEmail: {
        color: 'gray'
    },
    loginBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray'
    },
    loginBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray',
        marginLeft: 15
    },
    loginBtnImg: {
        width: 25,
        height: 25
    }
});