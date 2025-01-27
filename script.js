chrome.runtime.onInstalled.addListener(() => {
    console.log("YouTube Downloader Extension Installed");
  });

chrome.action.onClicked.addListener(async (tab) => {
  try {
    let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let videoUrl = currentTab.url;

    if (videoUrl.includes("youtube.com/watch") || videoUrl.includes("youtu.be/")) {
      await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: () => {
          const link = window.location.href;
          navigator.clipboard.writeText(link)
            .then(() => alert("Video URL copied!"))
            .catch(err => console.error("Failed to copy:", err));
        },
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: () => alert("Please open a YouTube video page."),
      });
    }

  } catch (error) {
    console.error("Error:", error);
  }
});

document.addEventListener('DOMContentLoaded', function() {

    // Function to load download history
    function loadDownloadHistory() {
        fetch(chrome.runtime.getURL('downloadHistory.json'))
            .then(response => response.json())
            .then(data => {
                const historyList = document.getElementById('history-list');
                historyList.innerHTML = '';
                data.forEach(video => {
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('video-item');
                    videoElement.innerHTML = `
                        <img src="${video.thumbnail}" alt="Thumbnail">
                        <p>${video.name}</p>
                        <button onclick="redownloadVideo('${video.url}')">Redownload</button>
                    `;
                    historyList.appendChild(videoElement);
                });
            })
            .catch(err => console.error('Failed to load download history:', err));
    }

    // Function to store download data
    function storeDownloadData(video) {
        fetch(chrome.runtime.getURL('downloadHistory.json'))
            .then(response => response.json())
            .then(data => {
                data.push(video);
                return fetch(chrome.runtime.getURL('downloadHistory.json'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(() => console.log('Download data stored successfully'))
            .catch(err => console.error('Failed to store download data:', err));
    }

    // Function to handle download button clicks
    async function handleDownloadButtonClick(format) {
        let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        let videoUrl = currentTab.url;

        if (videoUrl.includes("youtube.com/watch") || videoUrl.includes("youtu.be/")) {
            const video = {
                url: videoUrl,
                format: format,
                name: document.title,
                thumbnail: document.querySelector('link[rel="image_src"]').href
            };
            storeDownloadData(video);
        } else {
            alert("Please open a YouTube video page.");
        }
    }

    // Add event listeners to download buttons
    document.getElementById('download-mp4').addEventListener('click', () => handleDownloadButtonClick('mp4'));
    document.getElementById('download-mp3').addEventListener('click', () => handleDownloadButtonClick('mp3'));

    // Function to redownload a video
    window.redownloadVideo = function(url) {
        // Implement the logic to redownload the video using the URL
        console.log(`Redownloading video from URL: ${url}`);
    };

    // Load the download history on page load
    loadDownloadHistory();
});
