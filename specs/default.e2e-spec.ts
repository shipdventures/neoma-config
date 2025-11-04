import { HttpStatus } from "@nestjs/common"
import { managedAppInstance } from "@neoma/managed-app"
import * as request from "supertest"
import { faker } from "@faker-js/faker"

const { database, internet } = faker

const databaseEngine = database.engine()
const port = internet.port()

describe("Default Config", () => {
  describe(`Given process.env.DATABASE_ENGINE='${databaseEngine}' and process.env.PORT='${port}'`, () => {
    beforeEach(() => {
      process.env.DATABASE_ENGINE = databaseEngine
      process.env.PORT = port.toString()
    })

    afterEach(() => {
      delete process.env.DATABASE_ENGINE
      delete process.env.PORT
    })

    it(`should return config with databaseEngine='${databaseEngine}' and port='${port.toString()}'`, async () => {
      const app = await managedAppInstance()
      return request(app.getHttpServer())
        .get("/config")
        .expect(HttpStatus.OK)
        .expect({ databaseEngine, port: port.toString() })
    })
  })
})
