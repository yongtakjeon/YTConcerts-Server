const express = require('express');
const path = require("path");
const clientSessions = require("client-sessions");
const userService = require("./user-service.js");

const app = express();



//middelware
app.use(express.urlencoded({extended: true}));

app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "bieonDFBdiNIdsS", // this should be a long un-guessable string.
    duration: 5 * 60 * 1000, // duration of the session in milliseconds (5 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));



const HTTP_PORT = process.env.PORT || 8080;






app.get('/', (req, res) => {
    res.send("Hello. This is YT concert's server.");
});

app.get('/user/login', (req, res) =>{
    res.sendFile(path.join(__dirname, 'loginForm.html'));
});

app.get('/user/register', (req, res) =>{
    res.sendFile(path.join(__dirname, 'registerForm.html'));
});


app.post('/user/register', (req, res) => {

    userService.registerUser(req.body)
    .then((msg) => {
        res.send(msg);
    })
    .catch((err) => {
        res.send("There was an error creating the user account:" + err);
    })

});


app.post('/user/login', (req, res) => {

    userService.checkUser(req.body)
    .then((user) => {

        // Add the user on the session
        req.session.user = {
            userID: user.userID
        }

        res.send("Login Successful.")
    })
    .catch((err) => {
        res.send("Login Failed: " + err);
    });

});

app.get('/user/logout', (res, req)=> {
    req.session.reset();
    res.redirect("/user/login");
})





userService.initialize()
.then(() => {
    app.listen(HTTP_PORT, ()=> {
        console.log("Server on: " + HTTP_PORT);
    });
})
.catch((err) => {
    console.log("Failed to start " + err);
});