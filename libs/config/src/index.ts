import { Inject, InjectionToken } from "@nestjs/common"
import { ConfigService } from "./config.service"

export * from "./config.module"
export * from "./config.service"

export const InjectConfig = (): PropertyDecorator & ParameterDecorator =>
  Inject(ConfigService as unknown as InjectionToken)

// Additional exports as you build your package:
// export * from "./decorators/your-decorator.decorator"
// export * from "./guards/your-guard.guard"
// export * from "./interfaces/your-interface.interface"
