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
                <Text style={styles.channelName}>{props.video.channel}</Text>
                <Text>Published on {month}-{date}-{year}</Text>
            </View>
            <Text></Text>
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c3b6b6'
    },
    channelName: {
        fontWeight: '500'
    }
});