//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model("user", userSchema);


/**************Routes**********************/
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: md5(req.body.password)
    });
    user.save((err) => {
        if(!err) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({ username: username}, (err, foundUser) => {
        if(!err && foundUser && foundUser.password === password) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    })
});



app.listen(3000, () => {
    console.log('Server started on port :: 3000');
})