import axios from 'axios';

export const apiClient = axios.create({
    // baseURL: 'http://localhost:8080/v1'
    baseURL: 'https://test-api.youdescribe.org/v1'
});

export const audioClipsUploadsPath = 'https://dev-api.youdescribe.org/audio-descriptions-files';