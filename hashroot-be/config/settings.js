export const mongoConfig = {
  serverUrl: "mongodb://127.0.0.1:27017/",
  database: process.env.NODE_ENV === "test" ? "solar_step_test" : "solar_step",
  fileBucket:
    process.env.NODE_ENV === "test"
      ? "solar_step_files_test"
      : "solar_step_files",
};
