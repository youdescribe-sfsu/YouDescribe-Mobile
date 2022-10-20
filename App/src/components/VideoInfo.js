import { View, Text, StyleSheet } from 'react-native';

export default function VideoInfo(props) {

    const publishedAt = new Date(props.video.publishedAt);
    const date = publishedAt.getDate();
    const month = publishedAt.getMonth();
    const year = publishedAt.getFullYear();

    return(
        <View style={styles.container}>
            <Text style={styles.videoTitle}>{props.video.title}</Text>
            <View style={styles.channelDate}>
                <Text>{props.video.channel}</Text>
                <Text>Published on {month}-{date}-{year}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    videoTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },
    channelDate: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    }
});