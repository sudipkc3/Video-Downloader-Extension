// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Downloader Extension Installed");
});

// Listener for when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  try {
    let [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    let videoUrl = currentTab.url;

    // Check if the current tab is a YouTube video page
    if (
      videoUrl.includes("youtube.com/watch") ||
      videoUrl.includes("youtu.be/")
    ) {
      await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: () => {
          const link = window.location.href;
          navigator.clipboard
            .writeText(link)
            .then(() => alert("Video URL copied!"))
            .catch((err) => console.error("Failed to copy:", err));
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

// Listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Function to load download history
  function loadDownloadHistory() {
    chrome.storage.local.get(["downloadHistory"], (result) => {
      const historyList = document.getElementById("history-list").querySelector("tbody");
      historyList.innerHTML = "";
      const data = result.downloadHistory || [];
      data.forEach((video) => {
        const videoElement = document.createElement("tr");
        videoElement.innerHTML = `
          <td>${video.url}</td>
          <td>${video.format}</td>
          <td>${new Date(video.date).toLocaleString()}</td>
        `;
        historyList.appendChild(videoElement);
      });
    });
  }

  // Function to store download data
  function storeDownloadData(video) {
    chrome.storage.local.get(["downloadHistory"], (result) => {
      const data = result.downloadHistory || [];
      data.push(video);
      chrome.storage.local.set({ downloadHistory: data }, () => {
        console.log("Download data stored successfully");
      });
    });
  }

  // Function to handle download button clicks
  async function handleDownloadButtonClick(format) {
    let [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    let videoUrl = currentTab.url;

    // Check if the current tab is a YouTube video page
    if (
      videoUrl.includes("youtube.com/watch") ||
      videoUrl.includes("youtu.be/")
    ) {
      const video = {
        url: videoUrl,
        format: format,
        name: document.title,
        thumbnail: document.querySelector('link[rel="image_src"]').href,
        date: new Date().toISOString(),
      };
      storeDownloadData(video);
    } else {
      alert("Please open a YouTube video page.");
    }
  }
  
  // Ensure elements exist before adding event listeners
  const downloadMp4Button = document.getElementById("download-mp4");
  const downloadMp3Button = document.getElementById("download-mp3");
  const showDownloaderButton = document.getElementById("showDownloader");
  const showHistoryButton = document.getElementById("showHistory");

  if (downloadMp4Button) {
    downloadMp4Button.addEventListener("click", () => handleDownloadButtonClick("mp4"));
  }

  if (downloadMp3Button) {
    downloadMp3Button.addEventListener("click", () => handleDownloadButtonClick("mp3"));
  }

  if (showDownloaderButton) {
    showDownloaderButton.addEventListener("click", () => {
      document.getElementById("downloader-section").style.display = "block";
      document.getElementById("history-section").style.display = "none";
    });
  }

  if (showHistoryButton) {
    showHistoryButton.addEventListener("click", () => {
      document.getElementById("downloader-section").style.display = "none";
      document.getElementById("history-section").style.display = "block";
    });
  }

  // Function to redownload a video
  window.redownloadVideo = function (url) {
    // Implement the logic to redownload the video using the URL

    console.log(`Redownloading video from URL: ${url}`);
  };

  // Load the download history on page load
  loadDownloadHistory();
});
