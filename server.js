const chalk = require("chalk");
const app = require("./src/app");
const getLogger = require("./src/utils/logger");
const logger = getLogger("SERVER");

const PORT = process.env.PORT || 8386;

const server = app.listen(PORT, () => {
  logger.info(
    `Server is running at ${chalk.bgBlue("http://localhost:" + PORT + "/")}`
  );
});

process.on("SIGINT", () => {
  server.close(() => {
    logger.info(chalk.bgYellowBright("Server closed"));
    process.exit(0);
  });
});
