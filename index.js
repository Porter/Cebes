const requireOptional = require("require-optional");
requireOptional("./env");

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const expressHelper = require("./helpers/express_helper");
const User = require("./models/user");
const usersRouter = require("./routers/users_router");
const Document = require("./models/document");
const documentsRouter = require("./routers/documents_router");


const PORT = process.env.PORT || 8080;

console.log(process.env.NODE_ENV);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'fjsalfjwelijfalsdfj' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
	expressHelper.sendFile(req, res, "index.ejs");
});

app.use('/users', usersRouter);
app.use('/documents', documentsRouter);

const inits = [
	User.init(),
	Document.init()
]

Promise.all(inits).then(result => {
	app.listen(PORT, () => {
	  console.log("listening on port", PORT);
	});
}).catch(e => {
	console.log(e);
})
