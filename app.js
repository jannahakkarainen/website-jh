const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const port = 2020 // defines the port
const app = express() // creates the Express application
const bodyParser = require('body-parser')
const session = require('express-session')
const connectSqlite3 = require('connect-sqlite3')
const cookieParser = require('cookie-parser')


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
  


// creates skills projects at startup
db.run("CREATE TABLE skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)", (error) => { if (error) { 
  // tests error: display error
  console.log("ERROR: ", error)
} else {
// tests error: no error, the table has been created 
console.log("---> Table skills created!") 
const skills=[
{"id":"1", "name": "C++", "type": "Programming language", "desc": "Programming with C++."},
{"id":"2", "name": "NoSQL", "type": "Programming language", "desc": "Working with databases in NoSQL."},
{"id":"3", "name": "html", "type": "Markup language", "desc": "Creating web pages with html."},
{"id":"4", "name": "css", "type": "Stylesheet language", "desc": "Designing web pages with css."},
{"id":"5", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript."}, {"id":"6", "name": "Adobe-Programs", "type": "Photo editing programs", "desc": "Using all adobe programs to edit photos"},
] 
  // inserts skills
skills.forEach( (oneSkill) => {
db.run("INSERT INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)", [oneSkill.id, oneSkill.name, oneSkill.desc, 
oneSkill.type], (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
console.log("Line added into the skills table!") } 
}) }) 
} }) 



//---------
// SESSION
//---------

// store sessions in the database
const SQLiteStore = connectSqlite3(session)

// define the session
app.use(session({
  store: new SQLiteStore({db: "session-db.db"}),
  "saveUninitialized": false,
  "resave": false,
  "secret": "s3cr3t@s3nt3nc3@123"
}));



// ----------
// POST Forms
// ----------

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//

//check the login and password of a user
app.post('/login', (request, response) => {
  const un = request.body.un
  const pw = request.body.pw

  if (un=="janna" & pw=="6789") {
    console.log("janna is logged in!")
    request.session.isAdmin = true
    request.session.isLoggedIn = true
    request.session.name = "Janna"
    response.redirect('/')
  } else {
    console.log('Bad user and/or bad password')
    request.session.isAdmin = false
    request.session.isLoggedIn = false
    request.session.name = ""
    response.redirect('/login')
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
    console.log("SESSION: ", request.session)
    const model={
      isLoggedIn: request.session.isLoggedIn,
      name: request.session.name,
      isAdmin: request.session.isAdmin
    }
  response.render('home.handlebars', model)
});

app.get('/about', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('about.handlebars', model)
});



app.get('/projects', function(request, response){
  db.all("SELECT * FROM projects", function (error, theProject){
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        projects: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      
      
      //renders the page with the model
      response.render("projects.handlebars", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        projects: theProject,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
         //renders the page with the model
         response.render("projects.handlebars", model)

    }
  })
})

//renders the login page
app.get('/login', (request, response) => {
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('login.handlebars', model);
});

app.get('/skills', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('skills.handlebars', model)
})

app.get('/contact', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('contact.handlebars', model)
})


// defines the final default route 404 NOT FOUND
app.use(function(request,response){
  response.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
})

