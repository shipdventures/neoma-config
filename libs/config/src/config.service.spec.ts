import { faker } from "@faker-js/faker/."
import { Test, TestingModule } from "@nestjs/testing"
import { ConfigModule, ConfigService, TypedConfig } from "@neoma/config"
import "fixtures/env"

// Test data for basic functionality (property access)
const value = faker.lorem.word()
const screamingSnake = faker.lorem.word()
const screamingSnakeCase = faker.lorem.word()
const dbUrl = faker.internet.url()

// Test data for env loading
const environment = faker.lorem.word()
process.env.NODE_ENV = environment
const originalEnv = { ...process.env }

const port = "3000" // From process.env.PORT - Highest precedence
const databaseConnection = "postgres-node_env-local" // From .env.{environment}.local
const databaseUrl = "postgres://user:password@host:5432/local" // From .env.local
const appBuild = "build-node_env" // From .env.{environment}
const appName = "config-env" // From .env

const modules = [
  { title: "ConfigModule", module: ConfigModule },
  { title: "ConfigModule.forRoot()", module: ConfigModule.forRoot() },
  {
    title:
      "ConfigModule.forRoot({ loadEnv: false, strict: false, coerce: false })",
    module: ConfigModule.forRoot({
      loadEnv: false,
      strict: false,
      // coerce: false,
    }),
  },
]

describe("ConfigService", () => {
  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  describe("property access", () => {
    modules.forEach(({ title, module }) => {
      describe(title, () => {
        let config: TypedConfig<{ [key: string]: string }>

        beforeEach(async () => {
          process.env.VARIABLE = value
          process.env.SCREAMING_SNAKE = screamingSnake
          process.env.SCREAMING_SNAKE_CASE = screamingSnakeCase
          process.env.DATABASE_URL = dbUrl

          const app: TestingModule = await Test.createTestingModule({
            imports: [module],
          }).compile()

          config = app.get(ConfigService)
        })

        describe("property access", () => {
          it(`'variable' should return ${value} from process.env.VARIABLE`, () => {
            expect(config.variable).toBe(value)
          })

          it(`Checking for the existence of 'variable' should return true when process.env.VARIABLE is  set`, () => {
            expect("variable" in config).toBeTrue()
          })

          it(`'screamingSnake' should return ${screamingSnake} from process.env.SCREAMING_SNAKE`, () => {
            expect(config.screamingSnake).toBe(screamingSnake)
          })

          it(`'screamingSnakeCase' should return ${screamingSnakeCase} from process.env.SCREAMING_SNAKE_CASE`, () => {
            expect(config.screamingSnakeCase).toBe(screamingSnakeCase)
          })

          it(`'databaseUrl' should return ${dbUrl} from process.env.DATABASE_URL`, () => {
            expect(config.databaseUrl).toBe(dbUrl)
          })

          it(`'databaseURL' should return ${dbUrl} from process.env.DATABASE_URL`, () => {
            expect(config.databaseURL).toBe(dbUrl)
          })

          it(`'database_url' should return ${dbUrl} from process.env.DATABASE_URL`, () => {
            expect(config.database_url).toBe(dbUrl)
          })

          it("'notDefined' should return undefined when process.env.NOT_DEFINED is not set", () => {
            expect(config.notDefined).toBeUndefined()
          })
        })
      })
    })
  })

  describe("ConfigModule.forRoot({ strict: true })", () => {
    const definedKey = faker.lorem.word()
    const definedValue = faker.lorem.word()
    const notDefinedKey = faker.lorem.word()

    describe("property access", () => {
      let config: TypedConfig<{ [key: string]: string }>

      beforeEach(async () => {
        process.env[definedKey.toUpperCase()] = definedValue

        const app: TestingModule = await Test.createTestingModule({
          imports: [ConfigModule.forRoot({ strict: true })],
        }).compile()

        config = app.get(ConfigService)
      })

      it(`'${definedKey}' should return ${definedValue} when process.env.${definedKey.toUpperCase()} is set`, () => {
        expect(config[definedKey]).toBe(definedValue)
      })

      it(`'${notDefinedKey}' should throw an error when process.env.${notDefinedKey.toUpperCase()} is not set`, () => {
        expect(() => config[notDefinedKey]).toThrow(
          `Strict mode error when accessing configuration property '${notDefinedKey}'. ${notDefinedKey.toUpperCase()} is not defined on process.env`,
        )
      })

      it(`Checking for the existence of'${notDefinedKey}' should return false when process.env.${notDefinedKey.toUpperCase()} is not set`, () => {
        expect(notDefinedKey in config).toBeFalse()
      })
    })
  })

  describe("env file loading", () => {
    describe(`Given process.env.NODE_ENV=${environment}`, () => {
      let config: TypedConfig<{ [key: string]: string }>

      beforeEach(async () => {
        process.env.PORT = port

        const app: TestingModule = await Test.createTestingModule({
          imports: [ConfigModule.forRoot({ loadEnv: true })],
        }).compile()

        config = app.get(ConfigService)
      })

      it(`should automatically load configuration including env files in precedence order: process.env, .env.${environment}.local, .env.local, .env.${environment}, and .env`, () => {
        expect(config.port).toBe(port)
        expect(config.databaseConnection).toBe(databaseConnection)
        expect(config.databaseUrl).toBe(databaseUrl)
        expect(config.appBuild).toBe(appBuild)
        expect(config.appName).toBe(appName)
      })
    })
  })
})
