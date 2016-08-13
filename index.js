const requireOptional = require("require-optional");
requireOptional("./env");

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const expressHelper = require("./helpers/express_helper");
const usersHelperRouter = require("./routers/users_helper");
const usersRouter = require("./routers/users");
const DB = require("./helpers/db");


const PORT = process.env.PORT || 8080;

console.log(process.env.NODE_ENV);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	expressHelper.sendFile(res, "index.ejs", {root: __dirname });
});

app.use('/users', usersHelperRouter);
app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});