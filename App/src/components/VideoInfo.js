import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function VideoInfo(props) {

    return(
        <View style={styles.container}>
            <Text style={styles.videoTitle}>{props.video.title}</Text>
            <View style={styles.channelDate}>
                <Text style={styles.channelName}>{props.video.channel}</Text>
                <Text>Published on {props.video.publishedAt}</Text>
            </View>
            <View style={styles.viewsLikes}>
                <Text><FontAwesome5 name = 'eye' size = {14} /> {props.video.views}</Text>
                <Text><FontAwesome5 name = 'thumbs-up' size = {14} /> {props.video.likes}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    videoTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 6
    },
    channelDate: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c3b6b6'
    },
    channelName: {
        fontWeight: '600'
    },
    viewsLikes: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    }
});