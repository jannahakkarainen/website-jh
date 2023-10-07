const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const port = 2020 // defines the port
const app = express() // creates the Express application


// MODEL (DATA)
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('projects-jh.db')

// creates table projects at startup 
db.run("CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => { 
  if (error) {
  // tests error: display error console.log("ERROR: ", error) 
  } else {
  // tests error: no error, the table has been created console.log("---> Table projects created!") 


  const projects=[
  { "id":"1", "name":"Cv with html", "type":" school project", "desc": "The purpose of this project was to try out html for the first time", "year": 2023, "dev":"Python and OpenCV (Computer vision) library", "url":"/img/img1.png" }, 
  { "id":"2", "name":"Cv with html and css", "type":" school project", "desc": " The purpose of this project was to try out html in combination with css for the first time", "year": 2023, "url":"/img/img2.png" }, 
  { "id":"3", "name":"Cv with multiple pages", "type":"school project", "desc": " The purpose of this project was to try out html and css and to create a webpage with multiple pages for the first time", "year": 2023, "url":"/img/img3.png" } 
  ]


  // inserts projects 
  projects.forEach( (oneProject) => {
  db.run("INSERT INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)", [oneProject.id, oneProject.name, 
  oneProject.year, oneProject.desc, oneProject.type, oneProject.url], (error) => { if (error) { 
  console.log("ERROR: ", error) } else { 
  console.log("Line added into the projects table!") } 
  }) }) 
  }
  }) 
  



// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

// define static directory "public" to access css/ and img/
app.use(express.static('public'))





// CONTROLLER (THE BOSS)
// defines route "/"
app.get('/', function(request, response){
  response.render('home.handlebars')
})

app.get('/about', function(request, response){
  response.render('about.handlebars')
})

app.get('/projects', function(request, response){
  response.render('projects.handlebars')
})

app.get('/skills', function(request, response){
  response.render('skills.handlebars')
})

app.get('/contact', function(request, response){
  response.render('contact.handlebars')
})


// defines the final default route 404 NOT FOUND
app.use(function(req,res){
  res.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
})

