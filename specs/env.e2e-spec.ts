import { HttpStatus } from "@nestjs/common"
import { managedAppInstance } from "@neoma/managed-app"
import * as request from "supertest"
import { faker } from "@faker-js/faker/."
import "fixtures/env"

const environment = faker.lorem.word()
process.env.NODE_ENV = environment
const port = "3000" // From process.env.PORT - Highest precedence
const databaseConnection = "postgres-node_env-local" // From .env.${environment}.local - Second highest precedence
const databaseUrl = "postgres://user:password@host:5432/local" // From .env.local - Third highest precedence
const appBuild = "build-node_env" // From .env.${environment} - Fourth highest precedence
const appName = "config-env" // From .env - Lowest highest precedence

describe("Environment based configuration", () => {
  beforeAll(() => {
    process.env.PORT = port
    process.env.NEOMA_MANAGED_APP_MODULE_PATH =
      "src/env/app.module.ts#AppModule"
  })

  describe(`Given process.NODE_ENV=${environment}`, () => {
    it(`It should automatically load the configuration including the env files in order of precedent process, .env.${environment}.local, .env.local, .env.${environment}, and .env.`, async () => {
      const app = await managedAppInstance()
      const { body } = await request(app.getHttpServer())
        .get("/config")
        .expect(HttpStatus.OK)

      expect(body).toEqual({
        port,
        databaseConnection,
        databaseUrl,
        appBuild,
        appName,
      })
    })
  })
})
