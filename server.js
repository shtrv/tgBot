require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const ytdl = require("@distube/ytdl-core");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  if (urlPattern.test(ctx.text)) {
    const videoUrl = ctx.text;
    const keyboard = [];

    // Получаем информацию о видео
    let info = await ytdl.getInfo(videoUrl);

    // Фильтруем форматы видео, чтобы получить видео с максимальным качеством
    const videoFormats = ytdl.filterFormats(info.formats, "videoonly");
    const bestVideoFormats = videoFormats
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0)) // Сортируем по битрейту
      .slice(0, 3); // Получаем три лучших видео формата

    // Фильтруем форматы аудио, чтобы получить только аудио с максимальным качеством
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    const bestAudioFormats = audioFormats
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0)) // Сортируем по битрейту
      .slice(0, 2); // Получаем два лучших аудио формата

    bestVideoFormats.forEach((video) => {
      keyboard.push([
        Markup.button.url(
          `🎥 Качество: ${video.qualityLabel} | Кодек: ${video.videoCodec} | Битрейт: ${video.bitrate}`,
          video.url
        ),
      ]);
    });

    bestAudioFormats.forEach((audio) => {
      keyboard.push([
        Markup.button.url(`🎵 Кодек: ${audio.audioCodec}`, audio.url),
      ]);
    });

    ctx.reply("Ссылки для скачивания:", Markup.inlineKeyboard(keyboard));
  } else {
    ctx.reply("Эээ заебал да, не пиши эту хуйню");
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
