import { View, useWindowDimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function VideoPlayer(props) {
    const deviceWidth = useWindowDimensions().width;
    return(
        <View>
            <YoutubePlayer
                height={deviceWidth * 9 / 16} // Setting the height to 9/16th of the device's width as the video player's aspect ratio is 16:9
                play={false}
                videoId={props.video.videoId}
            />
        </View>
    );
}