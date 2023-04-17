import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function ChangeDescriptionModal({ hideModal, describers, selectedAudioDescriptionId, setSelectedAudioDescriptionId }) {

    const describersArray = [];
    for(const key in describers){
        let describer = describers[key];
        describer.descriptionId = key;
        describer.isSelected = key === selectedAudioDescriptionId;
        describersArray.push(describer);
    }

    const changeSelectedDescription = (adId) => {
        setSelectedAudioDescriptionId(adId);
        hideModal();
    }

    const renderDescriberInfo = ({item}) => {
        return(
            <TouchableOpacity
                style={styles.describerInfo}
                onPress={() => {
                    console.log("Id Touched: ", item.descriptionId);
                    changeSelectedDescription(item.descriptionId);
                }}
            >
                <Image
                    source={{uri: item.picture}}
                    style={styles.describerImage}
                />
                <View style={styles.nameRating}>
                    <Text style={styles.describerName}>{item.name}</Text>
                    <View style={styles.rating}>
                        <FontAwesome5 name='star' size={18} color={'#787070'} solid/>
                        <FontAwesome5 name='star' size={18} color={'#787070'} solid/>
                        <FontAwesome5 name='star' size={18} color={'#787070'} solid/>
                        <FontAwesome5 name='star' size={18} color={'#787070'} solid/>
                        <FontAwesome5 name='star' size={18} color={'#787070'} solid/>
                    </View>
                </View>
                { item.isSelected && <FontAwesome5 name="check" size={22} color={'#fff'} /> }
            </TouchableOpacity>
        );
    }

    return(
        <View style={styles.container}>
          <View style={styles.modalView}>
            <FlatList
                data={describersArray || []}
                renderItem={renderDescriberInfo}
                keyExtractor={describer => describer.descriptionId}
                style={styles.describersList}
            />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        margin: 10,
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '40%',
        width: '90%'
    },
    describerInfo: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 15,
        alignItems: 'center'
    },
    nameRating: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 45,
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
        fontWeight: 'bold',
        color: 'white'
    },
    describersList: {
        width: '100%'
    }
})