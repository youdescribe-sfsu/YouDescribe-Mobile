import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/v1'
});

export const audioClipsUploadsPath = 'http://localhost:8080/audio-descriptions-files';