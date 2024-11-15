const mongoose = require("mongoose");
const {
  db: { name, userName, password, cluster },
} = require("../configs/config.mongodb");
const { countConnect } = require("../helpers/check.connect");

const connectString = `mongodb+srv://${userName}:${password}@${cluster}/${name}?retryWrites=true&w=majority&appName=Cluster0`;
console.log(connectString);
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    switch (type) {
      case "mongodb":
        mongoose
          .connect(connectString)
          .then((_) => console.log("Connected to MongoDB:", countConnect()))
          .catch((err) => console.log(err));
        break;

      default:
        break;
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
