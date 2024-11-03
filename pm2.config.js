module.exports = {
    apps: [
      {
        name: 'tgVideoBot',            // Название вашего приложения
        script: './server.js',         // Основной файл запуска
        instances: 1,               // Количество инстансов (1 для одного процесса, 'max' для всех ядер)
        autorestart: true,          // Автоматический перезапуск при сбоях
        watch: false,               // Следить за изменениями (или true для автообновления)
        max_memory_restart: '200M', // Перезапуск при превышении 200 MB
        env: {
          NODE_ENV: 'production',   // Переменная среды
        },
      },
    ],
  };
  