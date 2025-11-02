import { Injectable } from "@nestjs/common"

@Injectable()
export class ConfigService<T extends Record<string, any>> {
  public constructor() {
    return new Proxy(this as unknown as T, {
      get: (_target, prop: string): string | undefined => {
        const envKey = prop
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1_$2")
          .toUpperCase()

        return process.env[envKey]
      },
    })
  }
}

export type TypedConfig<T extends Record<string, any>> = ConfigService<T> &
  Readonly<T>
