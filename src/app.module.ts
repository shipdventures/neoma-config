import { Module } from "@nestjs/common"
import { ConfigModule } from "@neoma/config"
import { AppController } from "./app.controller"

/**
 * Application module for testing the configuration setup that loads
 * env files.
 *
 * Imports the ConfigModule to provide type-safe access to environment
 * variables and registers the AppController to handle incoming requests
 * which provides an endpoint at /config to retrieve configuration values.
 */
@Module({
  imports: [ConfigModule.forRoot({ loadEnv: true })],
  controllers: [AppController],
})
export class AppModule {}
