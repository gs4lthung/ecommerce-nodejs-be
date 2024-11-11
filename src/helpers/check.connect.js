const { default: mongoose } = require("mongoose");
const os = require("os");

const _SECONDS = 5000;

const countConnect = () => {
  const numConnections = mongoose.connections.length;
  return numConnections;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = (process.memoryUsage().rss / 1024 / 1024);

    console.log(`Number of connections:`, numConnections);
    console.log(`Memory usage:`, memoryUsage, "MB");
    const maxConnections = numCores * 5;
    if (numConnections > maxConnections) {
      console.log("Connection overload!!!");
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverload };
