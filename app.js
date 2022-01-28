const express = require("express");
const userRouter  = require("./routes/userRoutes.js")
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use('/api/v1/users',userRouter)

app.get('/', (req, res) => {
  console.log('call from client')
  res.send({express: 'Backend Connected!!'});
})

module.exports = app;
