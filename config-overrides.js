module.exports = function override(config, env) {
  if (config.devServer) {
    if (!config.devServer.client) {
      config.devServer.client = {}; // Ensure the `client` object exists
    }
    config.devServer.client.overlay = false; // Disable the error overlay
  }
  return config;
};