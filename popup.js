// Listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("videoUrl");

  // Event listener for the MP3 download button
  document.getElementById("downloadMp3").addEventListener("click", () => {
    if (
      inputField.value.includes("youtube.com") ||
      inputField.value.includes("youtu.be")
    ) {
      window.open(
        `https://yt1s.com/en?q=${inputField.value}&format=mp3`,
        "_blank"
      );
    }
  });

  // Event listener for the MP4 download button
  document.getElementById("downloadMp4").addEventListener("click", () => {
    if (
      inputField.value.includes("youtube.com") ||
      inputField.value.includes("youtu.be")
    ) {
      window.open(
        `https://yt1s.com/en?q=${inputField.value}&format=mp4`,
        "_blank"
      );
    }
  });
});
