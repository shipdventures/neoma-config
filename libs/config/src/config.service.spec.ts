import { faker } from "@faker-js/faker/."
import { Test, TestingModule } from "@nestjs/testing"
import { ConfigService, TypedConfig } from "./config.service"
import { ConfigModule } from "./config.module"

const value = faker.lorem.word()
const screamingSnake = faker.lorem.word()
const screamingSnakeCase = faker.lorem.word()
const dbUrl = faker.internet.url()

describe("Config Service", () => {
  let config: TypedConfig<{ [key: string]: string }>

  beforeAll(async () => {
    process.env.VARIABLE = value
    process.env.SCREAMING_SNAKE = screamingSnake
    process.env.SCREAMING_SNAKE_CASE = screamingSnakeCase
    process.env.DATABASE_URL = dbUrl

    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile()

    config = app.get(ConfigService)
  })

  describe("variable", () => {
    describe(`Given process.env.VARIABLE is ${value}`, () => {
      it(`It should return ${value}`, async () => {
        expect(config.variable).toBe(value)
      })
    })
  })

  describe("screamingSnake", () => {
    describe(`Given process.env.SCREAMING_SNAKE is ${screamingSnake}`, () => {
      it(`It should return ${screamingSnake}`, async () => {
        expect(config.screamingSnake).toBe(screamingSnake)
      })
    })
  })

  describe("screamingSnakeCase", () => {
    describe(`Given process.env.SCREAMING_SNAKE_CASE is ${screamingSnakeCase}`, () => {
      it(`It should return ${screamingSnakeCase}`, async () => {
        expect(config.screamingSnakeCase).toBe(screamingSnakeCase)
      })
    })
  })

  describe("databaseUrl", () => {
    describe(`Given process.env.DATABASE_URL is ${dbUrl}`, () => {
      it(`It should return ${dbUrl}`, async () => {
        expect(config.databaseUrl).toBe(dbUrl)
      })
    })
  })

  describe("databaseURL", () => {
    describe(`Given process.env.DATABASE_URL is ${dbUrl}`, () => {
      it(`It should return ${dbUrl}`, async () => {
        expect(config.databaseURL).toBe(dbUrl)
      })
    })
  })
})
