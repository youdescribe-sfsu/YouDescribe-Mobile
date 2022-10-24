import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function SelectedDescriptionBox(props) {
    let describer;
    if(props.ad.length > 0){
        console.log(props.ad);
        describer = props.ad[0].user;
    }
    if(describer){
        return (
            <View style={styles.container}>
                <Text>Selected Description</Text>
                <View style={styles.describerInfo}>
                    <Image
                        source={{uri: describer.picture}}
                        style={styles.describerImage}
                    />
                    <View style={styles.nameRating}>
                        <Text style={styles.describerName}>{describer.name}</Text>
                        <View style={styles.rating}>
                            <FontAwesome5 name='star' size={24} color={'#787070'} solid/>
                            <FontAwesome5 name='star' size={24} color={'#787070'} solid/>
                            <FontAwesome5 name='star' size={24} color={'#787070'} solid/>
                            <FontAwesome5 name='star' size={24} color={'#787070'} solid/>
                            <FontAwesome5 name='star' size={24} color={'#787070'} solid/>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Rate Description</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View></View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        borderWidth: 2,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        borderColor: '#c3b6b6'
    },
    describerInfo: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 20,
        marginLeft: 15,
        alignItems: 'center'
    },
    nameRating: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: 15,
        paddingVertical: 11,
        height: 75
    },
    rating: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 180
    },
    describerImage: {
        width: 75,
        height: 75,
        borderRadius: '50%'
    },
    describerName:{
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonContainer: {
        alignSelf: 'center'
    },
    button: {
        width: 240,
        height: 40,
        backgroundColor: '#384488',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '18px'
    }
});