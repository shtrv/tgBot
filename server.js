require("dotenv").config();
const { Telegraf } = require("telegraf");
const ytdl = require("ytdl-core");
const fs = require("fs");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  const url = ctx.text;
  ytdl
    .downloadFromInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ")
    .pipe(fs.createWriteStream("video.mp4"));
  ctx.reply("забебал");
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
