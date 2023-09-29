const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const port = 8080 // defines the port
const app = express() // creates the Express application

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

// define static directory "public" to access css/ and img/
app.use(express.static('public'))

// MODEL (DATA)
const humans = [
    {"id": "0", "name": "Jerome"}, 
    {"id": "1", "name": "Mira"},
    {"id": "2", "name": "Linus"}, 
    {"id": "3", "name": "Susanne"}, 
    {"id": "4", "name": "Jasmin"}, 
]

// CONTROLLER (THE BOSS)
// defines route "/"
app.get('/', function(request, response){
  response.render('home.handlebars')
})

// defines route "/humans"
app.get('/humans', function(request, response){
  const model = { listHumans: humans } // defines the model
  // in the next line, you should send the abovedefined 
  // model to the page and not an empty object {}...
  response.render('humans.handlebars', model)
})

app.get('/humans/:id', function(request, response){
  const id = request.params.id; // Get the id from the dynamic route

  // Find the person with the specified ID
  const person = humans.find(person => person.id === id);

  if (person) {
    response.render('human.handlebars', person); // Pass the data of the found person
  } else {
    response.status(404).render('404.handlebars'); // Handle 404 if person not found
  }
});


// defines the final default route 404 NOT FOUND
app.use(function(req,res){
  res.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
})

