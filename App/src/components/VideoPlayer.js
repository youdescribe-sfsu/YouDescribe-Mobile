import { View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function VideoPlayer(props) {
    return(
        <View>
            <YoutubePlayer 
                height={300}
                play={false}
                videoId={props.video.videoId}
            />
        </View>
    );
}