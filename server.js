require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const ytdl = require("@distube/ytdl-core");


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  if (urlPattern.test(ctx.text)) {
    const videoUrl = ctx.text;
    /*     ytdl(videoUrl, { quality: "highestvideo" })
      .pipe(fs.createWriteStream(fileName))
      .on("finish", () => {
        ctx.reply("Видео успешно скачано! Отправляю вам файл...");

        // Отправка файла пользователю
        ctx
          .sendVideo({ source: fileName })
          .then(() => {
            // Удаляем файл после отправки
            fs.unlinkSync(fileName);
          })
          .catch((error) => {
            console.error(error);
            ctx.reply("Произошла ошибка при отправке файла.");
          });
      })
      .on("error", (error) => {
        console.error(error);
        ctx.reply(
          "Произошла ошибка при скачивании видео. Пожалуйста, попробуйте еще раз."
        );
      }); */

    const info = await ytdl.getInfo(videoUrl);
    const formats = info.formats;
    // let format = ytdl.chooseFormat(info.formats, { quality: '134' });
    const downloadLinks = formats
      .filter(format => format.mimeType?.includes('video'))
      .map((format) => ({
        url: format.url,
        itag: format.itag,
        mimeType: format.mimeType,
        qualityLabel: format.qualityLabel,
        quality: format.quality,
        videoCodec: format.videoCodec,
      }));
    console.log(downloadLinks);

    //ctx.reply(JSON.stringify(downloadLinks));
    //ctx.reply("забебал");
    const keyboard = downloadLinks.map(link => {
        return [Markup.button.url(`Качество: ${link.qualityLabel} + Кодек: ${link.videoCodec}`, link.url)];
    });

    ctx.reply("Выберите формат для скачивания:", Markup.inlineKeyboard(keyboard));
  } else {
    ctx.reply('Эээ заебал да, не пиши эту хуйню')
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
