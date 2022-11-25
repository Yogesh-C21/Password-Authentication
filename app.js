//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
const saltRounds = 10;

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
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if(!err) {
            bcrypt.hash(req.body.password, salt, function(error, hash) {
                if(!error) {
                    const user = new User({
                        username: req.body.username,
                        password: hash
                    });
                    user.save((err) => {
                        if(!err) {
                            res.render('secrets');
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log(err);
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username}, (err, foundUser) => {
        if(!err) {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, (error, result) => {
                    if(!error) {
                        if(result) {
                            res.render('secrets');
                        } else {
                            res.send("Password Doesn't Match");
                        }
                    } else {
                        console.log(error);
                    }
                });
            } else {
                res.send("User Do not Exist");
            }
        } else {
            console.log(err);
        }
    })
});



app.listen(3000, () => {
    console.log('Server started on port :: 3000');
});
