const requireOptional = require("require-optional");
requireOptional("./env");

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const expressHelper = require("./helpers/express_helper");
const usersHelperRouter = require("./routers/users_helper_router");
const usersRouter = require("./routers/users_router");
const documentsRouter = require("./routers/documents_router");
const DB = require("./helpers/db");


const PORT = process.env.PORT || 8080;

console.log(process.env.NODE_ENV);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'fjsalfjwelijfalsdfj' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	expressHelper.sendFile(req, res, "index.ejs");
});

app.use('/users', usersHelperRouter);
app.use('/', usersRouter);
app.use('/documents', documentsRouter);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
