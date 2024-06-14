import { youDescribeApi } from "./client";

// Function to add a rating to an audio description
const rateAudioDescription = async (rating, audioDescriptionId, userId, userToken) => {
    try {
        const response = await fetch(`${youDescribeApi}/audiodescriptionsrating/${audioDescriptionId}`, {
            method: 'POST',
            body: JSON.stringify({
                userId: userId,
                userToken: userToken,
                rating: rating
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        let result = await response.json();
        return result;
    } catch (error) {
        console.log('Error: ', error);
        return null;
    }
}

export default {
    rateAudioDescription
}