import express from "express";
import cors from "cors";
import configureRoutes from "./routes/index.js";
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.json());


//middlewares
app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    //temporary username and userID
    username: 'Hashroot',
    _id: '63fd81169001bbe5077a1ac6'
    //cookie: {maxAge: 60000}
  })
);


configureRoutes(app);

app.listen(3001, () => {
  console.log("Connected");
});
