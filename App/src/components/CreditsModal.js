import { useLayoutEffect } from "react";
import { Text, Button, View, StyleSheet, FlatList } from "react-native";
import MemberCard from "./MemberCard";
import { creditsDetails } from '../shared/data/credits';

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
    
    const renderMemberCard = ({ item }) => (
        <MemberCard member={item} />
    );

    return(
        <View style={styles.container}>
            <Text style={styles.headerText}>Meet the creative minds behind YouDescribe</Text>
            <FlatList
                data={creditsDetails || []}
                renderItem={renderMemberCard}
                keyExtractor={member => member.name}
                style={styles.memberList}
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
        paddingTop: 10
    },
    memberList: {
        width: '100%',
        paddingHorizontal: 5
    },
    headerText: {
        marginVertical: 15,
        fontSize: 16,
        fontWeight: 'bold'
    }
});