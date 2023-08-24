import { TouchableOpacity, Text, View, StyleSheet, Pressable } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RateDescriptionModal({ hideRateDescriptionModal, handleRatingSubmit, handleRatingChange, starColors, currentRating }){
    return(
        <View style={styles.container}>
            <View style={styles.modalView}>
                <View style={styles.modalHeading}>
                    <Text style={styles.modalHeadingText}>Rate Description</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={hideRateDescriptionModal}>
                        <Ionicons name='close' size={26} color='white' solid/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>Please rate this description with 1 star being unusable and 5 stars being perfect</Text>
                <View style={styles.stars}>
                    <TouchableOpacity
                        onPress={() => { handleRatingChange(1) }}
                        accessibilityLabel={`1 star`}
                        accessibilityRole="button"
                        accessibilityHint={`Double tap to select one star out of five.`}
                    >
                        <FontAwesome5 name='star' size={22} color={starColors[0]} solid/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { handleRatingChange(2) }}
                        accessibilityLabel={`2 stars`}
                        accessibilityRole="button"
                        accessibilityHint={`Double tap to select two stars out of five.`}
                    >
                        <FontAwesome5 name='star' size={22} color={starColors[1]} solid/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { handleRatingChange(3) }}
                        accessibilityLabel={`3 stars`}
                        accessibilityRole="button"
                        accessibilityHint={`Double tap to select three stars out of five.`}
                    >
                        <FontAwesome5 name='star' size={22} color={starColors[2]} solid/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { handleRatingChange(4) }}
                        accessibilityLabel={`4 stars`}
                        accessibilityRole="button"
                        accessibilityHint={`Double tap to select four stars out of five.`}
                    >
                        <FontAwesome5 name='star' size={22} color={starColors[3]} solid/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { handleRatingChange(5) }}
                        accessibilityLabel={`5 star`}
                        accessibilityRole="button"
                        accessibilityHint={`Double tap to select five stars out of five.`}
                    >
                        <FontAwesome5 name='star' size={22} color={starColors[4]} solid/>
                    </TouchableOpacity>
                </View>
                {
                    currentRating > 0 &&
                    <Pressable
                        style={styles.submitBtn}
                        onPress={handleRatingSubmit}
                        accessibilityRole="button"
                        accessibilityHint={`Double tap to submit your rating for this audio description as ${currentRating} stars out of five.`}
                    >
                        <Text style={styles.submitBtnText}>Submit</Text>
                    </Pressable>
                }
                {
                    currentRating === 0 &&
                    <Pressable
                        style={[styles.submitBtn, {opacity: 0.5}]}
                        disabled={true}
                        accessibilityRole="button"
                        accessibilityHint="Please select a rating in order to submit."
                    >
                        <Text style={styles.submitBtnText}>Submit</Text>
                    </Pressable>
                }
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
        display: 'flex',
        margin: 10,
        backgroundColor: 'black',
        borderRadius: 20,
        paddingBottom: 15,
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
        height: '30%',
        width: '90%'
    },
    modalHeading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative',
        paddingVertical: 15,
        backgroundColor: '#384488',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalHeadingText: {
        color: 'white',
        fontSize: 18,
        width: '100%',
        textAlign: 'center'
    },
    stars: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%'
    },
    modalText: {
        color: 'white',
        fontSize: 14,
        width: '90%'
    },
    submitBtn: {
        width: 160,
        height: 36,
        backgroundColor: '#384488',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    submitBtnText: {
        color: 'white',
        fontWeight: '700'
    },
    closeBtn: {
        position: 'absolute',
        top: 5,
        right: 10
    }
});