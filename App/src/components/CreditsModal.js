import { useLayoutEffect } from "react";
import { Text, Button } from "react-native";

export default function CreditsModal({navigation}) {

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
        <Text>Credits</Text>
    );
}