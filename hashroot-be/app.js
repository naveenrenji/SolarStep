import express from "express";
import cors from "cors";
import configureRoutes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configureRoutes(app);

app.listen(3001, () => {
  console.log("Connected");
});
