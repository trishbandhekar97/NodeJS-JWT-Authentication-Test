const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const {expressjwt: exJwt}  = require('express-jwt');


const PORT = 3000;
const secretKey = "SuperSecretKey";
const jwtMiddleWare = exJwt({
    secret: secretKey,
    algorithms: ['HS256']
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})


let users = [
    {
        id:1,
        username: 'trish',
        password: '123'
    },
    {
        id:2,
        username: 'john',
        password: '345'
    }
]





app.post('/api/login', (req,res) => {

    const {username, password} = req.body;

    for(let user of users) {
        if(username == user.username && password == user.password) {
            let token = jwt.sign({id: user.id, username: user.username}, secretKey, {expiresIn: '3m'});

            res.json({
                success: true,
                err:null,
                token
            });
            break;
        } else {
            res.status(401).json({
                success:false,
                token: null,
                err: "Username or password is incorrect"
            })
        }
    }
})


app.get('/api/dashboard', jwtMiddleWare, (req,res) => {
    res.json({
        success:true,
        content: "Secret content accessed"
    })
})

app.get('/api/prices', jwtMiddleWare, (req,res) => {
    res.json({
        success: true,
        content: 'Price: $499.99'
    })
})

app.get('/api/settings', jwtMiddleWare, (req, res) => {
    res.json({
        success: true,
        content: 'Settings content that only logged in people can access.'
    });
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.use((err,req,res,next) => {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            error: err,
            err: "Username or password not correct"
        });
    } else {
        next(err);
    }
})


app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
})

