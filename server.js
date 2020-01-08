const fs = require('fs');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

////////////////////////////////////////////////////////////////////////////////////////

const usersDB = './users.json';
const userDataDB = './user_data';

////////////////////////////////////////////////////////////////////////////////////////

function readJSON(path) {
    var res = fs.readFileSync(path);
    
    return JSON.parse(res);
}

function saveJSON(path, data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data));
    } catch (err) {
        return false;
    }

    return true;
}

////////////////////////////////////////////////////////////////////////////////////////

// Check users.js file

console.log('[TEST]  CHECKING USERS FILE ...');


if (!fs.existsSync(usersDB)) {
    console.warn('[WARN] USERS FILE NOT FOUND');
    console.log('[INFO]  CREATING USERS FILE ...');

    if (saveJSON(usersDB, [])) {
        console.log('[INFO]  CREATED USERS FILE');
    } else {
        console.error('[ERROR] COULD NOT SAVE USERS FILE');
    }
} else {
    console.log('[INFO]  FOUND USERS FILE ...');
}


console.log('[INFO]  LOADING USERS FILE ...');


let users = readJSON(usersDB);
let adminPass = bcrypt.hashSync('atalay2000', 10);
let admin = {
    name: 'Adil Atalay Hamamcioglu',
    username: 'recoskyler',
    email: 'recoskyler224@gmail.com',
    password: adminPass,
    admin: true,
    userData: userDataDB + '/recoskyler.json',
    devices: [],
    lastSync: ''
};


console.log('[INFO]  LOADED USERS FILE');
console.log('[TEST]  USERS = ' + users + ' ...');
console.log('[TEST]  ALMIGHTY RECOSKYLER = ' + users.find(user => user.username === 'recoskyler'));


if (users.find(user => user.username === 'recoskyler') == null) {
    console.log('[WARN]  ALMIGHTY USER RECOSKYLER NOT FOUND');
    console.log('[INFO]  CREATING ALMIGHTY RECOSKYLER USER ...');

    users[users.length] = admin;

    if (!fs.existsSync(userDataDB + '/recoskyler.json')) {
        fs.writeFileSync(userDataDB + '/recoskyler.json', JSON.stringify({}));
    }

    console.log('[INFO]  CREATED ALMIGHTY RECOSKYLER USER');

    if (saveJSON(usersDB, users)) {
        console.log('[INFO]  SAVED USERS FILE');
    } else {
        console.error('[ERROR] COULD NOT SAVE USERS FILE');
    }
} else {
    console.log('[INFO]  FOUND ALMIGHTY RECOSKYLER');
}

////////////////////////////////////////////////////////////////////////////////////////

console.log('[INFO]  STARTED SERVER');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');


app.use(expressLayouts);
app.use(express.static('public'));
app.use('/', indexRouter);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


app.post('/register', async (req, res) => {
    try {
        console.log('[INFO]  Creating new user ...');

        console.log('[TEST]  Checking if user exists ...');

        if (users.find(user => user.username === req.body.username) != null || users.find(user => user.email === req.body.email) != null) {
            console.log('[ERROR] User already exists ...');

            return res.send('Already exists');
        }

        console.log('[INFO]  Name : ' + JSON.stringify(req.body.name));
        console.log('[INFO]  Username : ' + JSON.stringify(req.body.username));
        console.log('[INFO]  Email : ' + JSON.stringify(req.body.email));

        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(req.body.password, salt); // hash password
        const usrDir = userDataDB + '/' + req.body.username + '.json';

        console.log('[INFO]  Creating new user data file : ' + usrDir + '  ...');

        fs.writeFileSync(usrDir, JSON.stringify({}));

        console.log('[INFO]  Created new user data file');

        let newUser = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashed,
            admin: false,
            userData: usrDir,
            devices: [],
            lastSync: ''
        };

        console.log('[INFO]  New user created : ' + JSON.stringify(newUser));

        users[users.length] = newUser;

        saveJSON(usersDB, users);

        console.log('[INFO]  Saved new user');

        res.send('Account created');
    } catch (error) {
        console.error('[ERROR] Failed to create and save new user : ' + error);

        res.send('An error occurred');
    }
});

app.post('/login', async (req, res) => {
    let user;

    if (req.body.username.includes('@')) {
        user = users.find(user => user.email === req.body.username);
    } else {
        user = users.find(user => user.username === req.body.username);
    }

    console.log('[INFO]  Checking user ...');

    if (user == null) {
        console.error('[ERROR] User not found');
        return res.status(400).send('No user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log('[INFO]  Checking user ...');

            res.send('Logged in');
        } else {
            console.error('[ERROR]  Wrong password');

            res.send('Wrong password');
        }
    } catch (error) {
        console.error('[ERROR] User not loaded : ' + error);

        res.status(500).send();
    }
});


app.listen(process.env.PORT || 3001);