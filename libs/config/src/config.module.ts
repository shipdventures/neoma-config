import { CONFIG_OPTIONS, ConfigOptions, ConfigService } from "./config.service"
import { DynamicModule, Module } from "@nestjs/common"
import * as dotenv from "dotenv"

/**
 * Module that provides type-safe access to environment variables through dependency injection.
 * Automatically converts between camelCase properties and SCREAMING_SNAKE_CASE environment variables.
 *
 * @example
 * // Import in your module
 * imports: [ConfigModule]
 *
 * // Or with options
 * imports: [ConfigModule.forRoot({ loadEnv: true, strict: true })]
 *
 * @example
 * // With strict mode - throws on undefined env vars
 * imports: [ConfigModule.forRoot({ strict: true })]
 *
 * @example
 * // With coerce enabled - automatic type conversion
 * imports: [ConfigModule.forRoot({ coerce: true })]
 * // Now "3000" becomes 3000, "true" becomes true, etc.
 *
 * @example
 * // Inject in your service
 * constructor(
 *   @InjectConfig()
 *   private config: TypedConfig<{ databaseUrl: string }>
 * ) {}
 *
 * // Access environment variables with type safety
 * const url = this.config.databaseUrl // reads from DATABASE_URL
 */
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  public static forRoot({
    loadEnv = false,
    strict = false,
    coerce = false,
  }: Partial<ConfigOptions> = {}): DynamicModule {
    if (loadEnv) {
      dotenv.config({
        path: [
          `.env.${process.env.NODE_ENV}.local`,
          ".env.local",
          `.env.${process.env.NODE_ENV}`,
          ".env",
        ],
        quiet: true,
      })
    }

    return {
      module: ConfigModule,
      providers: [
        ConfigService,
        { provide: CONFIG_OPTIONS, useValue: { loadEnv, strict, coerce } },
      ],
      exports: [ConfigService],
    }
  }
}
