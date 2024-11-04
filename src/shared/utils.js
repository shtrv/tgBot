/**
 * @typedef {'Twitter' | 'Instagram' | 'Tiktok' | 'Youtube'} SOURCE
 */

const sourcesMap = {
    Twitter: ['twitter.com', 'x.com'],
    Instagram: ['instagram.com'],
    Tiktok: ['tiktok.com'],
    Youtube: ['youtube.com', 'youtu.be'],
};

/**
 * Определяет источник URL на основе заданного списка доменов.
 * @param {string} url - URL для анализа.
 * @returns {SOURCE | null} - Имя источника (например, 'Twitter') или null, если не найдено.
 */
const detectUrlSource = (url) => {
    const res = Object.entries(sourcesMap).find(([_source, hosts]) => {
        return hosts.some((host) => url.includes(host));
    });

    return res ? res[0] : null;
};

module.exports = { detectUrlSource };
