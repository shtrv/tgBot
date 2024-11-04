require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const ytdl = require("@distube/ytdl-core");
const { detectUrlSource } = require("./shared/utils");
const { newMessageReceived } = require("./modules/bot/services");


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((error) => {
  console.error(error, "INDEX.JS");
});

bot.start(async (ctx) => {
  await ctx.reply("🔗 Отправь ссылку на видео");
});

bot.on("text", async (ctx) => {
  const handleMessage = async () => {
    if ("text" in ctx.message) {
      const link = ctx.message.text;
      const isMusicLink = link.includes("music.youtube.com");
      const targetSource = detectUrlSource(link);
      console.log(targetSource);

      if (targetSource && !isMusicLink) {
        await newMessageReceived({
          link,
          linkSource: targetSource,
          ctx,
        });
        return;
      }
      
      await ctx.reply("🚫 Пожалуйста, отправьте корректную ссылку.");
    }
  };
  handleMessage();
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
