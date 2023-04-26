import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import UpVoteButton from './UpVoteButton';
import DescribeButton from './DescribeButton';
import EditButton from './EditButton';

export default function VideoCard(props) {
    let timeParts = props.video.duration.split(':');
    let hours, minutes, seconds;
    if(timeParts.length === 2){
        hours = 0;
        minutes = parseInt(timeParts[0],10);
        seconds = parseInt(timeParts[1],10);
    } else {
        hours = parseInt(timeParts[0],10);
        minutes = parseInt(timeParts[1],10);
        seconds = parseInt(timeParts[2],10);
    }
    let buttons;

    if(props.buttons === 'upvote-describe') {
        buttons = (
            <>
                <UpVoteButton youtubeId={props.video.videoId}></UpVoteButton>
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

    const openVideo = () => {
        props.navigation.navigate('Video', {
            video: props.video
        });
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={openVideo}
                accessibilityLabel={`${props.video.title} by ${props.video.channel}. Duration: ${minutes} minutes and ${seconds} seconds`}
                style={styles.video}
            >
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
            </TouchableOpacity>
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
    video: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '78%',
        height: '90%'
    },
    thumbnail: {
        height: '100%',
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
        width: '63%',
        height: '100%',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 5
    },
    videoButtons: {
        display: 'flex',
        width: '18%',
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