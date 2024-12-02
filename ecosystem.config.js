module.exports = {
  apps: [
    {
      name: "pm2-manager",
      script: "./src/index.js",
      instances: 1,
      autorestart: true,
      watch: true,
      time: true,
    },
  ],
};
