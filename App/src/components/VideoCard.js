import { View, Text, StyleSheet, Image } from 'react-native';

export default function VideoCard(props) {
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
            </View>
            <View style={styles.videoInfo}>
                <Text>{props.video.title}</Text>
                <Text>{props.video.channel}</Text>
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
      borderBottomColor: '#edebeb',
      borderBottomWidth: '2px'
    },
    thumbnail: {
        height: '90%',
        width: '35%',
        borderRadius: '10px',
        backgroundColor: '#000',
        overflow: 'hidden',
        marginTop: 2
    },
    thumbnailImage: {
        height: '100%',
        width: undefined
    },
    videoInfo: {
        display: 'flex',
        width: '60%',
        justifyContent: 'space-between',
        paddingVertical: 10
    }
  });