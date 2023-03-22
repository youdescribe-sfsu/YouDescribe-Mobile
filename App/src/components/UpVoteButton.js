import { TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser } from "../contexts/UserContext";
import wishlistApi from "../api/wishlistApi";

export default function UpVoteButton({youtubeId}) {

    const [iconName, setIconName] = useState("heart-outline");
    const user = getUser();
    const upvote = () => {
        if(!user){
            Alert.alert(
                'Sign In Required',
                'You have to be logged in in order to vote'
            );
        } else {
            console.log("User: ", user);
            setIconName("heart");
            wishlistApi.upvoteVideo(youtubeId, user.google_user_id, user.token);
        }
    }

    return (
        <TouchableOpacity onPress={upvote}>
            <Ionicons name={iconName} size="25px" color="#384488" ></Ionicons>
        </TouchableOpacity>
    );
}