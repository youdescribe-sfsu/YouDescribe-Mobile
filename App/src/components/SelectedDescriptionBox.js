import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { getDescriptionActivity } from '../contexts/DescriptionActivityContext';

export default function SelectedDescriptionBox({ user, showRateDescriptionModal }) {
    const isDescriptionActive = getDescriptionActivity();
    let describer = user;
    if(describer && isDescriptionActive){
        const rating = describer.overall_rating_average === undefined ? 0 : describer.overall_rating_average;
        const starColors = [];
        for(let i=1; i<=5; i++){
            if(rating >= i){
                starColors.push('gold');
            } else {
                starColors.push('#787070');
            }
        }
        return (
            <View style={styles.container}>
                <Text>Selected Description</Text>
                <View
                    style={styles.describerInfo}
                    accessible={true}
                    accessibilityLabel={`Description by ${describer.name}. Rated ${rating} stars out of 5.`}
                >
                    <Image
                        source={{uri: describer.picture}}
                        style={styles.describerImage}
                    />
                    <View style={styles.nameRating}>
                        <Text style={styles.describerName}>{describer.name}</Text>
                        <View style={styles.rating}>
                            <FontAwesome5 name='star' size={18} color={starColors[0]} solid/>
                            <FontAwesome5 name='star' size={18} color={starColors[1]} solid/>
                            <FontAwesome5 name='star' size={18} color={starColors[2]} solid/>
                            <FontAwesome5 name='star' size={18} color={starColors[3]} solid/>
                            <FontAwesome5 name='star' size={18} color={starColors[4]} solid/>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={showRateDescriptionModal}>
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
        marginBottom: 10,
        padding: 10,
        borderColor: '#c3b6b6'
    },
    describerInfo: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 5,
        marginLeft: 15,
        alignItems: 'center'
    },
    nameRating: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: 15,
        paddingVertical: 14,
        height: 75
    },
    rating: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120
    },
    describerImage: {
        width: 60,
        height: 60,
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
        width: 200,
        height: 36,
        backgroundColor: '#384488',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px'
    }
});