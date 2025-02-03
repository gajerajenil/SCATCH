const express = require('express');
const app = express();
require('dotenv').config();

const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const sessionSecret = process.env.EXPRESS_SESSION_SECRET || 'default_secret_key';

const indexRouter = require('./routes/index');
const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');

const db= require("./config/mongoose-connection");


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Session middleware setup
app.use(session({
    secret: sessionSecret, // Change this to a more secure secret for production   "secret"
    resave: true,
    saveUninitialized: false
}));
// Flash messages middleware setup
app.use(flash());

app.use("/", indexRouter);
app.use("/owners", ownersRouter)
app.use("/users", usersRouter);
app.use("/products", productsRouter)

app.listen(3000);