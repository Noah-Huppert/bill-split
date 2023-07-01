export interface Config {
  /**
   * Port on which to listen for HTTP traffic and serve API.
   */
  port: number;

  /**
   * MongoDB connection URI.
   */
  mongoURI: string;
}

/**
 * Creates a Config from environment variables.
 * Environment variables:
 * - API_PORT (default: 8000)
 * @returns Config
 * @throws Key error if env vars not found.
 */
export function configFromEnv(): Config {
  return {
    port: parseInt(process.env?.API_PORT || "8000"),
    mongoURI:
      process.env?.API_MONGO_URI ||
      "mongodb://bill-split:bill-split@mongo/bill-split",
  };
}
