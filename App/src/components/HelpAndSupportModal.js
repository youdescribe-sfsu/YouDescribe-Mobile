import { useLayoutEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HelpAndSupportModal({navigation}) {

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
            <Text>Please visit <Text style={styles.linkText}>youdescribe.org/support</Text> to read general information about YouDescribe, FAQs, trouble shooting common issues, and to read our privacy policy.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 50
    },
    linkText: {
        fontWeight: 'bold',
        color: 'blue'
    }
});