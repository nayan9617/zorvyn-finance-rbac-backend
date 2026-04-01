const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

const startServer = async () => {
  try {
    await connectDb(env.mongodbUri);

    app.listen(env.port, () => {
      console.log(`Server started on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
