'use strict';
/* Data Access Object (DAO) module for accessing users */

const db = require('./db');
const bcrypt = require('bcrypt');

// dato un id restituisce l'utente corrispondente 
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT username, id, name FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          const user = {id: row.id, username: row.username, name:row.name};
          resolve(user);
        }
    });
  });
};

// dato username e password inseriti in fase di login controlla se esiste uno user conq uelle credenziali, 
// per farlo si appoggia a bcrypt
exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined) {
          resolve(false);
        }
        else {
          const user = {id: row.id, username: row.username, name:row.name};
    
          bcrypt.compare(password, row.hash).then(result => {
            if(result)
              resolve(user);
            else
              resolve(false);
          });
        }
    });
  });
};