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
db.run("CREATE TABLE projects (pid INTEGER PRIMARY KEY AUTOINCREMENT, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => { 
  if (error) {
  // tests error: display error 
  console.log("ERROR: ", error) 
  } else {
  // tests error: no error, the table has been created 
  console.log("---> Table projects created!") 


  const projects=[
  { "id":"1", "name":"Cv with html", "type":" School project", "desc": "The purpose of this project was to try out html for the first time", "year": 2023, "url":"/img/img1.png" }, 
  { "id":"2", "name":"Cv with html and css", "type":" School project", "desc": " The purpose of this project was to try out html in combination with css for the first time", "year": 2023, "url":"/img/img2.png" }, 
  { "id":"3", "name":"Cv with multiple pages", "type":"School project", "desc": " The purpose of this project was to try out html and css and to create a webpage with multiple pages for the first time", "year": 2023, "url":"/img/img3.png" }, 
  { "id":"4", "name": "Photo editing project with filters", "type": "Personal project", "desc": "Editing in photoshop using only filters", "year": 2013, "url": "/img/img4.png" },
  { "id":"5", "name": " Photo editing project with filters and removing objects", "type": " Personal project", "desc": "Editing in photoshop using filters and tools to remove unwanted objects", "year": 2013, "url": "/img/img5.png" }

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
{"id":"5", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript."}, 
{"id":"6", "name": "Adobe-Programs", "type": "Photo editing programs", "desc": "Using all adobe programs to edit photos"},
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



// creates education at startup
db.run("CREATE TABLE education (eid INTEGER PRIMARY KEY, ename TEXT NOT NULL, ehp TEXT NOT NULL, edesc TEXT NOT NULL)", (error) => { if (error) { 
  // tests error: display error
  console.log("ERROR: ", error)
} else {
// tests error: no error, the table has been created 
console.log("---> Table education created!") 
const education=[
{"id":"1", "name": "Discrete mathematics", "hp": "7.5", "desc": "Mathematics"},
{"id":"2", "name": "Computer technology introductory course", "hp": "7.5", "desc": "Introduction to basics of computer technology"},
{"id":"3", "name": "Linear algebra", "hp": "6", "desc": "Mathematics"},
{"id":"4", "name": "Introduction to programming", "hp": "9", "desc": "Introcuction to c++"},
{"id":"5", "name": "Databases", "hp": "6", "desc": "Learning databases basics and working with MSSQL"},
{"id":"6", "name": "Data structures and algorithms", "hp": "6", "desc": "Learning how algorithms work in c++"},
{"id":"7", "name": "Envariabelanalys", "hp": "9", "desc": "Mathematics"},
{"id":"8", "name": "Object oriented programming", "hp": "7.5", "desc": " Learning object oriented programming in c++"},
{"id":"9", "name": "Object oriented software development with design patterns", "hp": "7.5", "desc": "Learning more object oriented programming and java"},
{"id":"10", "name": "Web development fundamentals", "hp": "7.5", "desc": "Learning html, css, javascript and using express"},
] 
  // inserts education
education.forEach( (oneEducation) => {
db.run("INSERT INTO education (eid, ename, ehp, edesc) VALUES (?, ?, ?, ?)", [oneEducation.id, oneEducation.name, oneEducation.hp, oneEducation.desc], (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
console.log("Line added into the education table!") } 
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


// renders the /projects route view
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






app.get('/projects/:id', function(request, response) {
  const projectId = request.params.id;
  console.log('Project ID:', projectId);

  db.get("SELECT * FROM projects WHERE pid = ?", [projectId], function(error, project) {
    if (error) {
      console.log('Error:', error);
      // Handle the error
    } else {
      console.log('Project Data:', project);
      response.render("project.handlebars", { project: project });
    }
  });
});







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
  db.all("SELECT * FROM skills", function (error, skills){
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        skills: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      
      // Renders the page with the model
      response.render("skills.handlebars", model);
    }
    else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        skills: skills,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      
      // Renders the page with the model
      response.render("skills.handlebars", model);
    }
  });
});


app.get('/education', function(request, response){
  db.all("SELECT * FROM education", function (error, education){
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        education: [], 
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      
      // Renders the page with the model
      response.render("education.handlebars", model);
    }
    else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        education: education, 
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      
      // Renders the page with the model
      response.render("education.handlebars", model);
    }
  });
});



app.get('/contact', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('contact.handlebars', model)
})

app.get('/logout', (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    response.redirect('/login'); // Redirect to the login page after logout.
  });
});


// deletes a project
app.get('/projects/Delete/:id', (request, response) => {
  const id = request.params.id
  if (request.session.isLoggedIn==true && request.session.isAdmin==true){
    db.run("DELETE FROM projects WHERE pid=?", [id], function (error, theProject) {
      if (error) {
        const model = {dbError: true, theError: error,
        isLoggedIn: request.session.isLoggedIn,
        name:request.session.name,
        isAdmin: request.session.isAdmin,
        }
        response.render("home.handlebars", model) //renders the page with the model
      } else {
        const model = { dbError: false, theError: "",
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        }
        response.render("home.handlebars", model) //renders the page with the model
      }
    })
  } else {
    response.redirect('/login')
  }
})

// sends the form for a new project
app.get('/projects/new', (req, res) => {
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render('newproject.handlebars', model)
  } else {
    res.redirect('login')
  }
});

app.post('/projects/new', (req, res) => {
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg,
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("INSERT INTO projects (pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the projects table!")
      }
      res.redirect('/projects')
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/projects/update/:id', (req, res) => {
  const id = req.params.id
  //console.log("UPDATE: ", id)
  db.get("SELECT * FROM projects WHERE pid=?", [id], function (error, theProject) {
    if (error) {
      console.log("ERROR: ", error)
      const model = {dbError: true, theError: error,
      project: {},
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
      }
      //renders the page with the model
      res.render("modifyproject.handlebars", model)
    }
    else {
      //console.log("MODIFY: ", JSON.stringify(theProject))
      //console.log("MODIFY: ", theProject)
      const model = { dbError: false, theError: "",
      project: theProject,
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name, 
      isAdmin: req.session.isAdmin,
      helpers: {
        theTypeR(value) { return value == "Research"; },
        theTypeS(value) { return value == "School project"; },
        theTypeO(value) { return value == "Other"; }
      }  
    }
    // renders the page with the model
    res.render("modifyproject.handlebars", model)

    }
  })
});

//modify existing project
app.post('/projects/update/:id', (req, res) => {
  const id= req.params.id
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg, id
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptype=?, pimgURL=? WHERE pid=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Project updated!")
      }
      res.redirect('/projects')
    })
  } else {
    res.redirect('/login')
  }
})


// defines the final default route 404 NOT FOUND
app.use(function(request,response){
  response.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
})

