import { useLayoutEffect } from "react";
import { Text, Button } from "react-native";

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
        <Text>Contact Us</Text>
    );
}