import axios from 'axios';

export const apiClient = axios.create({
    baseURL: process.env.YOUDESCRIBE_API
});

export const youTubeApiClient = axios.create({
    baseURL: process.env.YOUTUBE_API
});

export const youDescribeApi = process.env.YOUDESCRIBE_API;
export const youTubeApiKey = process.env.YOUTUBE_API_KEY;
export const audioClipsUploadsPath = process.env.AUDIO_CLIPS_UPLOADS_PATH;
export const expoClientId = process.env.EXPO_CLIENT_ID;
export const iosClientId = process.env.IOS_CLIENT_ID;
export const androidClientId = process.env.ANDROID_CLIENT_ID;