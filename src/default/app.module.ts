import { Module } from "@nestjs/common"
import { ConfigModule } from "@neoma/config"
import { AppController } from "./app.controller"

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
})
export class AppModule {}
