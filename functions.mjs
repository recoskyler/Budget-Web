const fs = require('fs');

export function readJSON(path) {
    var res = fs.readFileSync(path);
    
    return JSON.parse(res);
}

export function saveJSON(path, data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data));
    } catch (err) {
        return false;
    }

    return true;
}