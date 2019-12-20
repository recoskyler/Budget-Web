const fs = require('fs');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

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

class User {
    constructor(username, name, surname, email, password, admin, userData) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.admin = admin;
        this.userData = userData;
    }

    // FULL NAME

    getFullName() {
        return this.name + ' ' + this.surname;
    }

    // FIRST NAME

    getName() {
        return this.name;
    }

    setName(x) {
        this.name = x;
    }

    // SURNAME

    getSurname() {
        return this.surname;
    }

    setSurname(x) {
        this.surname = x;
    }

    // EMAIL

    getEmail() {
        return this.name;
    }

    setEmail(x) {
        this.email = x;
    }

    // PASSWORD

    getPassword() {
        return this.password;
    }

    setPassword(x) {
        this.password = x;
    }

    // DATA

    getData() {
        return this.data;
    }

    setData(x) {
        this.data = x;
    }

    // ADMIN

    isAdmin() {
        return this.admin;
    }
}

////////////////////////////////////////////////////////////////////////////////////////

// Check users.js file

console.log('[TEST]  CHECKING USERS FILE ...');

if (!fs.existsSync('./users.json')) {
    console.warn('[WARN] USERS FILE NOT FOUND');
    console.log('[INFO]  CREATING USERS FILE ...');

    if (saveJSON('./users.json', {})) {
        console.log('[INFO]  CREATED USERS FILE');
    } else {
        console.error('[ERROR] COULD NOT SAVE USERS FILE');
    }
} else {
    console.log('[INFO]  FOUND USERS FILE ...');
}

console.log('[INFO]  LOADING USERS FILE ...');

var obj = readJSON('./users.json');

console.log('[INFO]  LOADED USERS FILE');
console.log('[TEST]  USERS = ' + obj + ' ...');
console.log('[TEST]  ALMIGHTY RECOSKYLER = ' + obj['recoskyler'] + ' ...');

if (obj['recoskyler'] === undefined) {
    console.warn('[WARN]  ALMIGHTY USER RECOSKYLER NOT FOUND');
    console.log('[INFO]  CREATING ALMIGHTY RECOSKYLER USER ...');

    var admin = new User('recoskyler', 'Adil Atalay', 'Hamamcioglu', 'recoskyler224@gmail.com', 'Yetibidik224!', true, '{} ');

    obj['recoskyler'] = admin;

    console.log('[INFO]  CREATED ALMIGHTY RECOSKYLER USER');

    if (saveJSON('./users.json', obj)) {
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

app.listen(process.env.PORT || 3001);