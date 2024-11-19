const { default: mongoose } = require("mongoose");
const os = require("os");
const getLogger = require("../utils/logger");
const chalk = require("chalk");

const logger = getLogger("CHECK_CONNECTION");
const _SECONDS = 5000;

const countConnect = () => {
  const numConnections = mongoose.connections.length;
  return numConnections;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;

    logger.info(`Number of connections: ${chalk.yellow(numConnections)}`);
    logger.info(`Memory usage: ${chalk.yellow(memoryUsage.toFixed(2))} MB`);
    const maxConnections = numCores * 5;
    if (numConnections > maxConnections) {
      logger.warn(
        `Overload, number of connections is exceed ${chalk.red(maxConnections)}`
      );
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverload };
