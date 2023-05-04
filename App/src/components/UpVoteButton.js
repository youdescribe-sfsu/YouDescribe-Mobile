import { TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser } from "../contexts/UserContext";
import wishlistApi from "../api/wishlistApi";

export default function UpVoteButton({youtubeId}) {

    const [iconName, setIconName] = useState("heart-outline");
    const user = getUser();
    const upvote = async () => {
        if(!user){
            Alert.alert(
                `Sign In Required`,
                `You have to be logged in in order to vote`
            );
        } else {
            setIconName("heart");
            const response = await wishlistApi.upvoteVideo(youtubeId, user._id, user.token);
            if(response){
                if(response.status === 200){
                    Alert.alert(
                        `Upvote Successful`,
                        `Thanks for voting ${user.given_name}. This video now has ${response.result.votes} votes.`
                    );
                } else if(response.status === 403){
                    Alert.alert(
                        `Upvote Failed`,
                        `You have already voted for this video. You can't vote for it again.`
                    );
                }
            } else {
                Alert.alert(
                    `Upvote Failed`,
                    `There was a problem while adding your vote. Try to logout and login again.`
                );
            }
        }
    }

    return (
        <TouchableOpacity onPress={upvote}>
            <Ionicons name={iconName} size="25px" color="#384488" ></Ionicons>
        </TouchableOpacity>
    );
}