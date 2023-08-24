import {View, Text, Image, StyleSheet} from 'react-native';

export default function MemberCard({ member }) {
    return(
        <View
            style={styles.memberCard}
            accessible={true}
            accessibilityLabel={`Name: ${member.name}. Designation: ${member.designation}. Tenure: ${member.tenure}. Image: ${member.description}`}
        >
            <Image
                style={styles.memberImage}
                resizeMode='cover'
                source={member.img}
            />
            <View style={styles.memberDetails}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberDesignation}>{member.designation}</Text>
                <Text style={styles.memberTenure}>{member.tenure}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    memberCard: {
        display: 'flex',
        flexDirection: 'row',
        margin: 8
    },
    memberImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    memberDetails: {
        margin: 20
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    memberDesignation: {
        fontSize: 12,
        color: 'grey'
    },
    memberTenure: {
        fontSize: 12,
        color: 'grey'
    }
});