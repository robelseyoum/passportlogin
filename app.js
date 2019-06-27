const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

//port
const port = 3000;

//init app
const app = express();

// View Engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//routing
const index = require("./routes/index");

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Express messages
app.use(flash());
app.use((req, res, next) => {
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
next();
});

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use("/", index);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
