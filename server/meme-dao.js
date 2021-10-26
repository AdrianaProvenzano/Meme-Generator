'use strict';
const db = require('./db');

// restituisce un array con tutti i template presenti nel db, viene invocata sia 
// in caso di utente loggato che non. 
exports.listTemplates = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM templates';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const templates = rows.map((t) => ({
        id: t.id,
        image_path: t.image_path,
        num_field: t.num_field,
        position_text1: t.position_text1,
        position_text2: t.position_text2,
        position_text3: t.position_text3
      }));
      resolve(templates);
    });
  });
};

// dato un id restituisce il template corrispondente
exports.getTemplateById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM templates WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Template not found.'});
      } else {
        const template = { id: row.id, num_field: row.num_field, image_path: row.image_path, position_text1: row.position_text1, 
          position_text2:row.position_text2, position_text3:row.position_text3};
        resolve(template);
      }
    });
  });
};

// restituisce un array con tutti i meme presenti nel db, viene invocata solo se l'utente è loggato
exports.listAllMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM memes';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((m) => ({
        id: m.id,
        title: m.title,
        protect: m.protect,
        text1: m.text1,
        text2: m.text2,
        text3: m.text3,
        color: m.color,
        font: m.font,
        template: m.template,
        creator: m.creator
      }));
      resolve(memes);
    });
  });
};

// restituisce un array con tutti i meme presenti nel db, viene invocata solo se l'utente non è loggato
exports.listPublicMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM memes WHERE protect=0';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((m) => ({
        id: m.id,
        title: m.title,
        protect: m.protect,
        text1: m.text1,
        text2: m.text2,
        text3: m.text3,
        color: m.color,
        font: m.font,
        template: m.template,
        creator: m.creator
      }));
      resolve(memes);
    });
  });
};

// restituisce il meme con l'id ricevuto come parametro 
exports.getMemeById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM memes WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Meme not found.' });
      } else {
        const meme = {
          id: row.id,
          title: row.title,
          protect: row.protect,
          text1: row.text1,
          text2: row.text2,
          text3: row.text3,
          color: row.color,
          font: row.font,
          template: row.template,
          creator: row.creator
        };
        resolve(meme);
      }
    });
  });
};

// aggiunge un nuovo meme nel db, è possibile invocare questa funzione solo se l'utente è loggato
exports.createMeme = (meme) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO memes(title, protect, text1, text2, text3, color, font, template, creator) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [meme.title, meme.protect, meme.text1, meme.text2, meme.text3, meme.color, meme.font, meme.template, meme.creator], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// elimina uno dei meme esistenti dell'utente loggato 
exports.deleteMeme = (id, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM memes WHERE id = ? and creator=?';
    db.run(sql, [id, userId], (err) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(null);
      }
    });
  });
}