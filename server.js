var express = require('express');
var ejs = require('ejs');

var app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        title: "Home", 
        user: "Participants"
    });
});

app.get('/mentors', (req, res) => {
    res.render('mentor');                           // UTKARSH
});

app.get('/students', (req, res) => {
    res.render('student');                          // SHIVAM 
})

app.listen(3000, () => {
    console.log("Port up and running");
})
