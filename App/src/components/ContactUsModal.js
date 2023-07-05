import { useLayoutEffect } from "react";
import { View, Text, Button, Linking, StyleSheet, Pressable } from "react-native";

export default function ContactUsModal({navigation}) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => {
                return(
                    <Button 
                        title="Done"
                        onPress={() => navigation.goBack()}
                    />
                );
            }
        });
    }, [navigation]);

    return(
        <View style={styles.container}>
            <Text style={styles.containerText}>YouDescribe is a project of:</Text>
            <Text style={styles.containerText}>The Smith-Kettlewell Eye Research Institute</Text>
            <Text style={styles.containerText}>2318 Fillmore Street</Text>
            <Text style={styles.containerText}>San Francisco, CA 94115</Text>
            <View style={styles.emailText}>
                <Text style={styles.containerText}>Email questions, comments, bug reports, and feature requests to:</Text>
                <Pressable
                    onPress={() => Linking.openURL('mailto:info@youdescribe.org')}
                >
                    <Text style={styles.emailBtnText}>info@youdescribe.org</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginTop: 50
    },
    containerText: {
        fontSize: 16
    },
    emailText: {
        marginTop: 20
    },
    emailBtnText: {
        fontSize: 16,
        color: 'blue'
    }
});