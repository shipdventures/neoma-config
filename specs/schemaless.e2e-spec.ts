import { HttpStatus } from "@nestjs/common"
import { managedAppInstance } from "@neoma/managed-app"
import * as request from "supertest"
import { faker } from "@faker-js/faker"

const { database, internet } = faker

const databaseEngine = database.engine()
const port = internet.port()

describe("Schemaless Config", () => {
  beforeEach(() => {
    process.env.DATABASE_ENGINE = databaseEngine
    process.env.PORT = port.toString()
  })

  it("It should automatically load the configuration.", async () => {
    const app = await managedAppInstance()
    return request(app.getHttpServer())
      .get("/config")
      .expect(HttpStatus.OK)
      .expect({ databaseEngine, port: port.toString() })
  })
})
