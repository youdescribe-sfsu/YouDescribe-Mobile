import { View, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function VideoPlayer(props) {
    return(
        <View style={styles.container}>
            <YoutubePlayer 
                height={300}
                play={false}
                videoId={props.video.videoId}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 300
    }
});