const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = 3000;

var app = express(); // Make a new express app

hbs.registerPartials(__dirname + '/views/partials'); // Add support for partials
app.set('view engine', 'hbs'); // Configure express to use the handlebar view engine

// Middleware is a tool that allows you to add on to the existing funcionality
// that express has. So if express doesn't do something that you would like to
// do you can add some middelware and teach it how to do that thing
// The way to register a midleware is to use app.use([the function you want])
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log');
    }
  });

  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   // next is never called so the next functions of app are never executed
// });

// Add middleware to tweak express to work as we want to serve a static directory
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>'); // Send html
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    message: 'Hello world!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  }); // Let you render any of the templates you have set up with your current view engine
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'You tried to access the /bad path',
    errorMessage: 'Unable to fulfill the request'
  });
});

// app.listen(port); // Bind the application to a port on our machine

// you can pass a second argument to the listen method which is going to be
// executed once the server is up
app.listen(port, () => {
  console.log('Server is up on port', port);
});
