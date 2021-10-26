import Template from './models/Template';
import Meme from './models/Meme';

const BASEURL = '/api';

// USER API

// permette ad un utente (già registrato) di effettuare il login
// ritorna l'utente (id, username, name) corrispondente a username/password inseriti
async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch (err) {
      throw err;
    }
  }
}

// permette ad un utente di effettuare il logout
async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

// restituisce informazioni relative all'utente loggato (id, username, name)
async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // un oggetto che contiene l'errore proveniente dal server 
  }
}

// aggiunge un nuovo meme al db attraverso la chiamata a POST /api/memes
function addMeme(meme) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/memes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          title: meme.title, protect: meme.protect, text1: meme.text1, text2: meme.text2,
          text3: meme.text3, color: meme.color, font: meme.font, template: meme.template
        }
      ),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analizziamo la causa dell'errpre
        response.json()
          .then((message) => { reject(message); }) // messaggio di errore nel body della risposta 
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // qualcos'altro 
      }
    }).catch(() => {
      reject({ error: "Cannot communicate with the server." })
    }); // errore di connessione 
  });
}

// restituisce la lista di tutti i meme presenti nel database, quest'API viene chiamata solo nel 
// caso in cui l'utente sia loggato. Chiama la GET /api/memes
async function getAllMemes() {
  const response = await fetch(BASEURL + '/memes');
  const memeJson = await response.json();
  if (response.ok) {
    return memeJson.map((m) => Meme.from(m));
  } else {
    throw memeJson;  // un oggetto che contiene l'errore proveniente dal server 
  }
}

// restituisce la lista di tutti i meme presenti nel database che sono pubblici (ossia non protetti), 
// quest'API viene chiamata nel caso in cui l'utente non sia loggato. Chiama la GET /api/public/memes
async function getPublicMemes() {
  const response = await fetch(BASEURL + '/public/memes');
  const memeJson = await response.json();
  if (response.ok) {
    return memeJson.map((m) => Meme.from(m));
  } else {
    throw memeJson;  // un oggetto che contiene l'errore proveniente dal server 
  }
}

// restituisce la lista di tutti i template dei meme presenti nel database, quest'API viene chiamata 
// sia in caso di utente loggato che non. Chiama la GET /api/templates
async function getAllTemplates() {
  const response = await fetch(BASEURL + '/templates');
  const templateJson = await response.json();
  if (response.ok) {
    return templateJson.map((t) => Template.from(t));
  } else {
    throw templateJson;  // un oggetto che contiene l'errore proveniente dal server 
  }
}

// ricevuto un id, restituisce il nome dell'utente corrispondente, viene usata per visualizzare chi ha 
// pubblicato quel determinato meme. Chiama la GET /api/users/:id
async function getNameById(id) {
  const response = await fetch(BASEURL + '/users/' + id);
  const user = await response.json();
  if (response.ok) {
    return user.name;
  } else {
    throw user.name;  // un oggetto che contiene l'errore proveniente dal server 
  }
}

// permette di rimuovere uno dei meme tra quelli propri. Chiama DELETE /api/memes/:id
function deleteMeme(id) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/memes/' + id, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analizziamo la causa dell'errore
        response.json()
          .then((obj) => { reject(obj); }) // messaggio di errore nel body della risposta 
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // qualcos'altro 
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // errori di connessione 
  });
}

const API = { logIn, logOut, getUserInfo, addMeme, getAllTemplates, getAllMemes, getPublicMemes, getNameById, deleteMeme };
export default API;

