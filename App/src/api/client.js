import axios from 'axios';
import {
    YOUDESCRIBE_API,
    YOUTUBE_API,
    YOUTUBE_API_KEY,
    AUDIO_CLIPS_UPLOADS_PATH,
    EXPO_CLIENT_ID,
    IOS_CLIENT_ID,
    ANDROID_CLIENT_ID
} from '@env';

export const apiClient = axios.create({
    baseURL: YOUDESCRIBE_API
});

export const youTubeApiClient = axios.create({
    baseURL: YOUTUBE_API
});

export const youDescribeApi = YOUDESCRIBE_API;
export const youTubeApiKey = YOUTUBE_API_KEY;
export const audioClipsUploadsPath = AUDIO_CLIPS_UPLOADS_PATH;
export const expoClientId = EXPO_CLIENT_ID;
export const iosClientId = IOS_CLIENT_ID;
export const androidClientId = ANDROID_CLIENT_ID;