export const convertISO8601ToSeconds = (input) => {
    const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let totalseconds;
    if (reptms.test(input)) {
      const matches = reptms.exec(input);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      totalseconds = (hours * 3600) + (minutes * 60) + seconds;
    }
    return (totalseconds);
}

export const convertSecondsToCardFormat = (timeInSeconds) => {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds);
    // let milliseconds = Math.floor((timeInSeconds - Math.floortimeInSeconds) * 100);
    if (hours >= 24) hours = Math.floor(hours % 24);
    // if (hours < 10) hours = '0' + hours;
    if (minutes >= 60) minutes = Math.floor(minutes % 60);
    if (minutes < 10 && timeInSeconds >= 3600) minutes = `0${minutes}`;
    if (seconds >= 60) seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    // if (milliseconds < 10) milliseconds = `0${milliseconds}`;
  
    return timeInSeconds < 3600 ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

export const convertISO8601ToDate = (input) => {
    let d = new Date(input);
    d = String(d).split(' ').slice(1, 4);
    d[1] += ',';
    return d.join(' ');
}

export const convertViewsToCardFormat = (views) => {
    if (views >= 1000000000) views = `${(views / 1000000000).toFixed(1)}B views`;
    else if (views >= 1000000) views = `${(views / 1000000).toFixed(1)}M views`;
    else if (views >= 1000) views = `${(views / 1000).toFixed(0)}K views`;
    else if (views === 1) views = `${views} view`;
    else views = `${views} views`;
  
    return views;
}
  
export const convertLikesToCardFormat = (likes) => {
    if (likes >= 1000000000) likes = `${(likes / 1000000000).toFixed(1)}B`;
    else if (likes >= 1000000) likes = `${(likes / 1000000).toFixed(1)}M`;
    else if (likes >= 1000) likes = `${(likes / 1000).toFixed(0)}K`;
    else if (likes === 1) likes = `${likes}`;
    else likes = `${likes}`;

    return likes;
}

// Function to generate a comma-separated string of youtubeIds of all the given videos.
export const generateYoutubeIdsString = (videos) => {
    let youtubeIds = [];
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if(video){
            youtubeIds.push(video.youtube_id);
        }
    }
    return youtubeIds.join(',');
}