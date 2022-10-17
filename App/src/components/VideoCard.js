import { View, Text, StyleSheet, Image } from 'react-native';
import UpVoteButton from './UpVoteButton';
import DescribeButton from './DescribeButton';
import EditButton from './EditButton';

export default function VideoCard(props) {
    let buttons;

    if(props.buttons === 'upvote-describe') {
        buttons = (
            <>
                <UpVoteButton></UpVoteButton>
                <DescribeButton></DescribeButton>
            </>
        );
    }

    if(props.buttons === 'edit') {
        buttons = (
            <>
                <EditButton></EditButton>
            </>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.thumbnail}>
                <Image
                    style={styles.thumbnailImage}
                    resizeMode='cover'
                    source={{
                        uri: `${props.video.thumbnail}`
                    }}
                />
                <View style={styles.thumbnailDuration}>
                    <Text style={{color: '#fff', fontSize: 12}}>{props.video.duration}</Text>
                </View>
            </View>
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{props.video.title}</Text>
                <Text>{props.video.channel}</Text>
            </View>
            <View style={styles.videoButtons}>
                {buttons}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
      width: '100%',
      height: 90,
      borderRadius: '10px',
      marginBottom: 5,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: '#edebeb',
      borderBottomWidth: '2px'
    },
    thumbnail: {
        height: '90%',
        width: '35%',
        borderRadius: '10px',
        backgroundColor: '#000',
        overflow: 'hidden',
        marginTop: 2,
        position: 'relative'
    },
    thumbnailImage: {
        height: '100%',
        width: undefined
    },
    thumbnailDuration: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: 2,
        borderRadius: '3px'
    },
    videoInfo: {
        display: 'flex',
        width: '35%',
        height: '90%',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 5
    },
    videoButtons: {
        display: 'flex',
        width: '20%',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: '90%',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    videoTitle: {
        fontWeight: 'bold',
        flex: 1,
        flexShrink: 1
    }
});