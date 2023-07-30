import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function VideoInfo(props) {

    return(
        <View style={styles.container} accessible={true}>
            <Text style={styles.videoTitle}>{props.video.title}</Text>
            <View style={styles.channelDate}>
                <Text style={styles.channelName} accessibilityLabel={`By: ${props.video.channel}`}>{props.video.channel}</Text>
                <Text accessibilityLabel={`Published on ${props.video.publishedAt}`}>{props.video.publishedAt}</Text>
            </View>
            <View style={styles.viewsLikes}>
                {
                    props.video.views !== 'undefined' &&
                    <Text><FontAwesome5 name = 'eye' size = {14} />{props.video.views}</Text>
                }
                {
                    props.video.likes !== 'undefined' &&
                    <Text accessibilityLabel={`${props.video.likes} likes`} ><FontAwesome5 name = 'thumbs-up' size = {14} /> {props.video.likes}</Text>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
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