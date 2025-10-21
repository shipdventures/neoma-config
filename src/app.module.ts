import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"

@Module({})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public configure(_consumer: MiddlewareConsumer): any {}
}
