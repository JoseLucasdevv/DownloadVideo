const { exec } = require("child_process");
const path = require("path");

async function downloadVideo(options = {}) {
  const mainPath = path.join(
    __dirname,
    "ytdl-source/ytdl-nightly-2024.07.11/youtube_dl/__main__.py"
  );
  const format = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4";
  const command = `python3 '${mainPath}' '${options.url}' -f '${format}' -o '${options.output}'`;

  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });

    if (!options.onProgress) return;

    process.stdout.on("data", (data) => {
      console.log(data);
      const regex = /\[download\] +(.+?)%/;
      const match = data.match(regex);

      if (!match) return;

      const progress = match[1];
      options.onProgress(progress);
    });
  });
}

module.exports = {
  downloadVideo,
};
