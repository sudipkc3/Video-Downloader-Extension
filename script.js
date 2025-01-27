document.getElementById('download-btn').addEventListener('click', function() {
    const videoUrl = prompt('Enter the YouTube video URL:');
    if (videoUrl) {
        alert('Downloading video from: ' + videoUrl);
    } else {
        alert('Please enter a valid URL.');
    }
});

document.getElementById('downloadMp3').addEventListener('click', function() {
    const videoUrl = document.getElementById('videoUrl').value;
    if (videoUrl) {
        alert('Downloading MP3 from: ' + videoUrl);
    } else {
        alert('Please enter a valid URL.');
    }
});

document.getElementById('downloadMp4').addEventListener('click', function() {
    const videoUrl = document.getElementById('videoUrl').value;
    if (videoUrl) {
        alert('Downloading MP4 from: ' + videoUrl);
    } else {
        alert('Please enter a valid URL.');
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getYouTubeURL
    });
});

function getYouTubeURL() {
    const videoUrl = window.location.href;
    if (videoUrl.includes("youtube.com/watch")) {
      navigator.clipboard.writeText(videoUrl).then(() => {
        alert("YouTube link copied! Open extension to download.");
      });
    } else {
      alert("Please visit a YouTube video page.");
    }
}
