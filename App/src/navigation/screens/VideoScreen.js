import { View, StyleSheet } from "react-native";

import VideoPlayer from '../../components/VideoPlayer';
import VideoInfo from "../../components/VideoInfo";

export default function VideoScreen({ route }) {
    return (
        <View style={styles.container}>
            <VideoPlayer video={route.params.video}/>
            <VideoInfo video={route.params.video}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    }
});