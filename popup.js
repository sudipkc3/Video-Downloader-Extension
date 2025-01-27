document.addEventListener("DOMContentLoaded", async () => {
    const inputField = document.getElementById("videoUrl");
    
    // Get clipboard content
    navigator.clipboard.readText().then((text) => {
      if (text.includes("youtube.com/watch")) {
        inputField.value = text;
      } else {
        inputField.value = "No valid YouTube link found.";
      }
    });
  
    document.getElementById("downloadMp3").addEventListener("click", () => {
      if (inputField.value.includes("youtube.com")) {
        window.open(`https://ytmp3.cc/en13/?url=${inputField.value}`, "_blank");
      }
    });
  
    document.getElementById("downloadMp4").addEventListener("click", () => {
      if (inputField.value.includes("youtube.com")) {
        window.open(`https://yt1s.com/en?q=${inputField.value}`, "_blank");
      }
    });
  });
  