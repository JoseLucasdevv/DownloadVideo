const { downloadVideo } = require("./utils.js");
const path = require("path");
const os = require("os");

console.log("Iniciando download do vídeo...");

const downloadDir = path.join(os.homedir(), "DownloadVideos");

downloadVideo({
  url: "https://www.youtube.com/watch?v=lmYGctPLYtA",
  output: `${downloadDir}/%(title)s.mp4`,
  onProgress: (progress) => {
    console.log(`O progresso atual é: ${progress}%`);
  },
}).then(() => {
  console.log("Download concluído!");
});
