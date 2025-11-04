import { Inject, Injectable, Optional } from "@nestjs/common"

/**
 * Options for configuring the ConfigModule.
 *
 * @property loadEnv - If true, loads environment variables from .env files into process.env
 * @property strict - If true, throws an error when accessing undefined environment variables
 */
export type ConfigOptions = {
  loadEnv: boolean
  strict: boolean
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
 * Supports destructuring: const { apiKey, apiUrl } = this.config
 *
 * @throws {Error} When strict mode is enabled and accessing an undefined environment variable
 */
@Injectable()
export class ConfigService<T extends Record<string, any>> {
  public constructor(
    @Optional()
    @Inject(CONFIG_OPTIONS)
    options: Partial<ConfigOptions> = {},
  ) {
    return new Proxy(this as unknown as T, {
      get: (_target, prop: string): string | undefined => {
        // Handle special properties that shouldn't trigger strict mode
        if (typeof prop === "symbol" || prop === "then" || prop === "toJSON") {
          return undefined
        }

        const envKey = prop
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1_$2")
          .toUpperCase()

        const value = process.env[envKey]

        if (value === undefined && options.strict) {
          throw new Error(
            `Strict mode error when accessing configuration property '${prop}'. ${envKey} is not defined on process.env`,
          )
        }

        return value
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
