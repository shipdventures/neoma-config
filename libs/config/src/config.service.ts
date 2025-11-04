import { Injectable } from "@nestjs/common"

/**
 * Options for configuring the ConfigModule.
 *
 * @property loadEnv If true, loads environment variables from a .env file into process.env.
 * @property strict If true, throws an error when accessing an undefined environment variable.
 * @property coerce If true, attempts to coerce environment variable values that look like numbers
 * or booleans to the expected types.
 */
export type ConfigOptions = {
  loadEnv: boolean
  strict: boolean
  coerce: boolean
}

/**
 * Injection token for providing ConfigOptions to the ConfigModule.
 */
export const CONFIG_OPTIONS = Symbol("CONFIG_OPTIONS")

/**
 * Service that provides type-safe access to environment variables through dependency injection.
 * Automatically converts property names from camelCase to SCREAMING_SNAKE_CASE when accessing environment variables.
 *
 * @example
 * // Basic usage
 * constructor(
 *   @InjectConfig()
 *   private config: TypedConfig<{ apiKey: string }>
 * ) {
 *   console.log(this.config.apiKey) // Reads from process.env.API_KEY
 * }
 *
 * @example
 * // Supports multiple naming conventions
 * this.config.databaseUrl  // DATABASE_URL (camelCase)
 * this.config.databaseURL  // DATABASE_URL (mixed case)
 * this.config.awsS3Bucket  // AWS_S3_BUCKET (acronyms)
 *
 * @example
 * // With TypeScript interfaces for full type safety
 * interface AppConfig {
 *   port: string
 *   databaseUrl: string
 *   redisHost?: string // Optional
 * }
 *
 * constructor(
 *   @InjectConfig()
 *   private config: TypedConfig<AppConfig>
 * ) {
 *   // Full IntelliSense and type checking
 *   const port = this.config.port
 *   const redis = this.config.redisHost || 'localhost'
 * }
 *
 * @remarks
 * Returns undefined if the environment variable is not set.
 * Supports destructuring: const { apiKey, apiUrl } = this.config
 */
@Injectable()
export class ConfigService<T extends Record<string, any>> {
  public constructor() {
    return new Proxy(this as unknown as T, {
      get: (_target, prop: string): string | undefined => {
        const envKey = prop
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1_$2")
          .toUpperCase()

        return process.env[envKey]
      },
    })
  }
}

/**
 * Type helper that combines ConfigService with your configuration interface for full type safety.
 * Makes all properties readonly to prevent accidental modification.
 *
 * @example
 * type Config = TypedConfig<{ apiKey: string; debugMode?: string }>
 * // Results in a type where apiKey is required and debugMode is optional
 */
export type TypedConfig<T extends Record<string, any>> = ConfigService<T> &
  Readonly<T>
