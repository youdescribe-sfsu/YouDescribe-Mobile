import { useLayoutEffect } from "react";
import { Text, Button } from "react-native";

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
        <Text>Help And Support</Text>
    );
}