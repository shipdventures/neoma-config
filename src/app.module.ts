import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      entities: ["src/**/*.entity.ts"],
      synchronize: true,
    }),
    // Add your package module here for E2E testing
    // Example: YourPackageModule.forRoot(),
  ],
  controllers: [],
})
export class AppModule {}
