import { Controller, Get } from "@nestjs/common"
import { InjectConfig, TypedConfig } from "@neoma/config"

@Controller()
export class AppController {
  public constructor(
    @InjectConfig()
    private readonly config: TypedConfig<{
      databaseEngine: string
      port: string
    }>,
  ) {}

  @Get("config")
  public configuration(): { databaseEngine: string; port: string } {
    return {
      databaseEngine: this.config.databaseEngine,
      port: this.config.port,
    }
  }
}
