require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const ytdl = require("@distube/ytdl-core");
const { detectUrlSource } = require("./shared/utils");
const { newMessageReceived } = require("./modules/bot/services");

const axios = require('axios'); // Для скачивания файлов
const fs = require('fs'); // Для сохранения файлов
const ffmpeg = require('fluent-ffmpeg');


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((error) => {
  console.error(error, "INDEX.JS");
});

bot.start(async (ctx) => {
  await ctx.reply("🔗 Отправь ссылку на видео");
});

// bot.on("text", async (ctx) => {
//   const handleMessage = async () => {
//     if ("text" in ctx.message) {
//       const link = ctx.message.text;
//       const isMusicLink = link.includes("music.youtube.com");
//       const targetSource = detectUrlSource(link);
//       console.log(targetSource);

//       if (targetSource && !isMusicLink) {
//         await newMessageReceived({
//           link,
//           linkSource: targetSource,
//           ctx,
//         });
//         return;
//       }
      
//       await ctx.reply("🚫 Пожалуйста, отправьте корректную ссылку.");
//     }
//   };
//   handleMessage();
// });

bot.on('audio', async (ctx) => {
  try {
    const audioFile = ctx.message.audio;
    const fileId = audioFile.file_id;

    // Получение ссылки на файл
    const fileLink = await ctx.telegram.getFileLink(fileId);
    console.log('Ссылка на аудиофайл:', fileLink);

    // Скачивание файла
    const response = await axios.get(fileLink.href, { responseType: 'stream' });
    const fileName = `audio_${Date.now()}.opus`;

    // Сохранение файла
    const writeStream = fs.createWriteStream(fileName);
    response.data.pipe(writeStream);

    writeStream.on('finish', async () => {
      console.log('Файл сохранён:', fileName);

      // Отправка файла как голосовое сообщение
      await ctx.replyWithVoice({ source: fileName });
      console.log('Голосовое сообщение отправлено.');

      // Удаление файла после отправки (необязательно)
      fs.unlinkSync(fileName);
      console.log('Временный файл удалён.');
    });
    

    writeStream.on('error', (err) => {
      console.error('Ошибка сохранения файла:', err);
      ctx.reply('Произошла ошибка при сохранении аудиофайла.');
    });

  } catch (error) {
    console.error('Ошибка обработки аудиофайла:', error);
    await ctx.reply('Произошла ошибка при обработке аудиофайла.');
  }
});


bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
