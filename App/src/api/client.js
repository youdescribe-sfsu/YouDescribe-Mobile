import axios from 'axios';

export const apiClient = axios.create({
    // baseURL: 'http://localhost:8080/v1'
    baseURL: 'https://api.youdescribe.org/v1'
});

export const youTubeApiClient = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3'
});

export const youTubeApiKey = "AIzaSyDV8QMir3NE8S2jA1GyXvLXyTuSq72FPyE";
export const audioClipsUploadsPath = "https://dev-api.youdescribe.org/audio-descriptions-files";