import {
  ConfigModule,
  ConfigService,
  InjectConfig,
  TypedConfig,
} from "@neoma/config"
import { Controller } from "@nestjs/common"
import { Test } from "@nestjs/testing"

describe("ConfigModule", () => {
  describe("@InjectConfig decorator", () => {
    it("should inject ConfigService into controller constructor", async () => {
      @Controller()
      class TestController {
        public constructor(
          @InjectConfig()
          public config: TypedConfig<{ testVar: string }>,
        ) {}
      }

      const module = await Test.createTestingModule({
        imports: [ConfigModule],
        controllers: [TestController],
      }).compile()

      const controller = module.get(TestController)
      const configService = module.get(ConfigService)

      expect(controller.config).toBe(configService)
      expect(controller.config).toBeInstanceOf(ConfigService)
    })
  })
})
