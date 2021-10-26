'use strict'; 
const sqlite = require('sqlite3'); 

// apriamo il database 
const db = new sqlite.Database('meme.sqlite', (err)=>{
    if(err) throw err; 
}); 
module.exports = db; 