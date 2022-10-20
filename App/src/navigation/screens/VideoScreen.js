import { View } from "react-native";

import VideoPlayer from '../../components/VideoPlayer';

export default function VideoScreen({ route }) {
    return (
        <View>
            <VideoPlayer video={route.params.video}/>
        </View>
    );
}