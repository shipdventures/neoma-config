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
      databaseEngine: string
      port: string
    }>,
  ) {}

  /**
   * Handles GET requests to the /config endpoint.
   *
   * Should successfully return the current database engine
   * and port configuration from process.env.
   *
   * @returns An object containing the database engine and port.
   */
  @Get("config")
  public configuration(): { databaseEngine: string; port: string } {
    const { databaseEngine, port } = this.config
    return { databaseEngine, port }
  }
}
