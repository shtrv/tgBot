// src/services/messageHandler.js

const sendYoutubeLinks = require('../youtube/send-youtube-links');
// Подключите другие модули по мере необходимости
// const tiktokModule = require('../modules/tiktok/send-tiktok-links');

/**
 * Обрабатывает получение нового сообщения и вызывает нужный модуль в зависимости от источника.
 * @param {Object} options - Опции для обработки сообщения.
 * @param {string} options.link - Ссылка, отправленная пользователем.
 * @param {string} options.linkSource - Источник ссылки (например, 'Youtube', 'Tiktok').
 * @param {Object} options.ctx - Контекст Telegraf (объект ctx).
 */
async function newMessageReceived({ link, linkSource, ctx }) {
    switch (linkSource) {
        case 'Youtube':
            await sendYoutubeLinks.sendLinks(ctx, link);
            break;
        // case 'Tiktok':
        //     await tiktokModule.sendLinks(ctx, link);
        //     break;
        // Добавьте другие источники и соответствующие модули по мере необходимости

        default:
            console.log(`Источник ${linkSource} не поддерживается.`);
            await ctx.reply("🚫 Ссылки с данного источника не поддерживаются.");
            break;
    }
}

module.exports = { newMessageReceived };
