const { Markup } = require("telegraf");
const ytdl = require("@distube/ytdl-core");

async function sendLinks(ctx, link) {
    try {
        let info = await ytdl.getInfo(link);
        const videoFormats = ytdl.filterFormats(info.formats, "videoonly")
            .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))
            .slice(0, 3);

        const audioFormats = ytdl.filterFormats(info.formats, "audioonly")
            .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))
            .slice(0, 2);

        const keyboard = [];
        videoFormats.forEach((video) => {
            keyboard.push([
                Markup.button.url(
                    `🎥 ${video.qualityLabel} | ${video.videoCodec}`,
                    video.url
                ),
            ]);
        });
        audioFormats.forEach((audio) => {
            keyboard.push([
                Markup.button.url(`🎵 ${audio.audioCodec}`, audio.url),
            ]);
        });

        await ctx.reply("🔗 Ссылки для скачивания:", Markup.inlineKeyboard(keyboard));
    } catch (error) {
        console.error("Ошибка при получении информации о видео:", error);
        await ctx.reply("🚫 Ошибка при обработке ссылки.");
    }
}

module.exports = { sendLinks };
