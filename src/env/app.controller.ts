import { Controller, Get } from "@nestjs/common"
import { InjectConfig, TypedConfig } from "@neoma/config"

/**
 * Controller that provides an endpoint to retrieve application configuration values
 * based upon a default ConfigService setup.
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   *
   * @param config - The injected configuration service providing access to environment variables.
   */
  public constructor(
    @InjectConfig()
    private readonly config: TypedConfig<{
      port: string
      databaseConnection: string
      databaseUrl: string
      appBuild: string
      appName: string
    }>,
  ) {}

  /**
   * Handles GET requests to the /config endpoint.
   *
   * Returns the application configuration values.
   *
   * @returns A configuration object containing port, databaseConnection, databaseUrl, appBuild, and appName.
   */
  @Get("config")
  public configuration(): {
    port: string
    databaseConnection: string
    databaseUrl: string
    appBuild: string
    appName: string
  } {
    const { port, databaseConnection, databaseUrl, appBuild, appName } =
      this.config
    return { port, databaseConnection, databaseUrl, appBuild, appName }
  }
}
