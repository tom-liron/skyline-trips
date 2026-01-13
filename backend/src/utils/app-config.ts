import dotenv from "dotenv";

/**
 * Loads and exposes application configuration from environment variables.
 * Uses dotenv to load variables from a .env file at startup.
 * Provides readonly properties for environment, database, JWT, and image settings.
 * Import and use the exported `appConfig` singleton throughout the backend.
 */

// Load .env file into process.env object.
dotenv.config({ quiet: true });

class AppConfig {
  public readonly isDevelopment = process.env.ENVIRONMENT === "development";
  public readonly isProduction = process.env.ENVIRONMENT === "production";
  public readonly port = Number(process.env.PORT) || 4001;
  public readonly mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING!;
  public readonly jwtSecretKey = process.env.JWT_SECRET_KEY!;
  public readonly hashSaltKey = process.env.HASH_SALT_KEY!;
}

export const appConfig = new AppConfig();
