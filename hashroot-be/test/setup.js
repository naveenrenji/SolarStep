import { closeConnection, dbConnection } from "../config/mongoConnection";

let _db;

beforeAll(async () => {
  _db = await dbConnection();
});

afterAll(async () => {
  await _db.dropDatabase();
  await closeConnection();
});
