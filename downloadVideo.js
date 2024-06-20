const fs = require("node:fs");
const path = require("node:path");
const os = require("os");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

const downloadDir = path.join(os.homedir(), "DownloadVideos");
const url = "https://www.youtube.com/watch?v=W0DM5lcj6mw&ab_channel=7clouds";
const fullPathVideo = path.join(downloadDir, "video.mp4");
const fullPathAudio = path.join(downloadDir, "audio.mp4");

function verifyUrl(url) {
  const validate = ytdl.validateURL(url);

  return validate;
}

async function getInfoVideo() {
  const info = await ytdl.getBasicInfo(url);
  const { videoDetails } = info;
  return {
    videoDetails,
  };
}

async function createStream(path) {
  return fs.createWriteStream(path).on("finish", () => {
    console.log("streamCreated");
  });
}

async function DownloadVideo() {
  if (!verifyUrl(url)) {
    throw new Error("Url invalid").message;
  }
  try {
    const audioStream = await createStream(fullPathAudio);
    const videoStream = await createStream(fullPathVideo);
    await new Promise((resolve) => {
      ytdl(url, { quality: "highestvideo" })
        .pipe(videoStream)
        .on("finish", () => {
          resolve("video was finished");
        });
    });
    await new Promise((resolve) => {
      ytdl(url, { quality: "highestaudio" })
        .pipe(audioStream)
        .on("finish", () => {
          resolve("audio was finished");
        });
    });

    mergeVideo();
  } catch (e) {
    console.error(e);
  }
}
async function mergeVideo() {
  const { videoDetails } = await getInfoVideo();
  const finalPath = path.join(
    downloadDir,
    "FinalVideo",
    `${videoDetails.title}.mp4`
  );
  ffmpeg()
    .input(fullPathVideo)
    .input(fullPathAudio)
    .outputOptions("-c copy")
    .save(finalPath)
    .on("end", () => {
      console.log(
        `Audio Title: ${videoDetails.title} was Published at ${videoDetails.publishDate}`
      );
      fs.unlinkSync(fullPathVideo);
      fs.unlinkSync(fullPathAudio);
    })
    .on("error", (err) => {
      throw new Error("impossible Merge", err).message;
    });
}

try {
  DownloadVideo();
} catch (e) {
  console.error(e);
}
