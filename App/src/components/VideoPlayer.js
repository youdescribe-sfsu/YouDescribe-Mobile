import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default function VideoPlayer(props) {
    const deviceWidth = useWindowDimensions().width;
    return(
        <View style={styles.container}>
            <YoutubePlayer
                height={deviceWidth * 9 / 16} // Setting the height to 9/16th of the device's width as the video player's aspect ratio is 16:9
                play={false}
                videoId={props.video.videoId}
            />
            <ScrollView
                style={styles.sliderContainer}
                scrollEnabled={false}
            >
                <View style={styles.sliderContainerView}>
                    <Text style={{color: '#fff', fontSize: 16}}>Description Volume</Text>
                    <MultiSlider
                        sliderLength={180}
                        min={0}
                        max={100}
                        values={[50]}
                        selectedStyle={{backgroundColor: 'gold'}}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex'
    },
    sliderContainer: {
        backgroundColor: '#000',
        paddingHorizontal: 20
    },
    sliderContainerView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});