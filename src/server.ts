// HTTP server entrypoint: loads config and starts Express app
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

// Resolve port from environment with a sane default
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Start the web server with basic error handling
async function start() {
  try {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
