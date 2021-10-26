'use strict';

const express = require('express');
const morgan = require('morgan'); // middleware di logging
const { check, param, validationResult, oneOf } = require('express-validator'); // middleware di validazione 
const passport = require('passport'); // middleware di autenticazione 
const LocalStrategy = require('passport-local').Strategy; // username e password per il login
const session = require('express-session'); // abilita le sessioni
const userDao = require('./user-dao.js'); // modulo per accedere agli utenti nel DB 
const memeDao = require('./meme-dao'); // modulo per accedere ai meme/template nel DB 

/*** impostiamo Passport ***/
// impostiamo la strategia di login "username e password"
// impostando una funzione che verifica username e password 
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
      return done(null, user);
    })
  }
));

// serializziamo e de-serializziamo l'utente (oggetto utente <-> sessione)
// serializziamo l'id dell'utente e lo salviamo nella sessione: la sessione in questo modo è molto piccola
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// partendo dai dati nella sessione, estraiamo l'utente corrente (loggato) 
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // questo sarà disponibile in req.user
    }).catch(err => {
      done(err, null);
    });
});

// inizializziamo express
const app = new express();
const port = 3001;

// impostiamo i middleware
app.use(morgan('dev'));
app.use(express.json());

// middleware creato da noi: controlla se una data richiesta proviene da un utente autenticato
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'not authenticated' });
}

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

// impostiamo la sessione
app.use(session({
  // di default, Passport usa una MemoryStore per tener traccia delle sessioni 
  secret: 'salagadula megicabula bibbidi-bobbidi-bu',
  resave: false,
  saveUninitialized: false
}));

// dopodichè, inizializziamo passport
app.use(passport.initialize());
app.use(passport.session());

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // mostriamo il messaggio di errore nel login 
      return res.status(401).json(info);
    }
    // in caso di successo facciamo il login 
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contiene l'utente autenticato, madiamo indetro tutte le informazioni 
      // relative a quell'utente provenienti da userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// controlla se l'utente è loggato o meno
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// GET /api/users/:id
// dato l'id restituisce l'utente relativo 
app.get('/api/users/:id', [param('id').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    try {
      const result = await userDao.getUserById(req.params.id)
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  });

/*** Templates/Meme APIs ***/

// GET /api/templates
// restituisce tutti i template
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await memeDao.listTemplates();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).end();
  }
})

// GET /api/templates/:id
// dato un id restituisce il template corrispondente
app.get('/api/templates/:id', [param('id').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    try {
      const result = await memeDao.getTemplateById(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  });

// GET /api/memes
// restituisce tutti i meme, sono nel caso di utente loggato 
app.get('/api/memes', isLoggedIn, async (req, res) => {
  try {
    const memes = await memeDao.listAllMemes();
    res.json(memes);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/memes
// restituisce tutti i meme pubblici
app.get('/api/public/memes', async (req, res) => {
  try {
    const memes = await memeDao.listPublicMemes();
    res.json(memes);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/memes/:id
// dato un id, restituisce il meme relativo 
app.get('/api/memes/:id', [param('id').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    try {
      const result = await memeDao.getMemeById(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else {
        if (result.protect === 0 || req.isAuthenticated()) // lo puoi vedere
          res.json(result);
        else    // non lo puoi vedere perchè è protetto e non sei loggato          
          res.status(401).json({ error: 'Unauthenticated user and meme protected!' });;
      }
    } catch (err) {
      res.status(500).end();
    }
  });

// POST /api/exams
// se l'utente è loggato può aggiungere un nuovo meme 
app.post('/api/memes', isLoggedIn, [
  check('title').isLength({ min: 1, max: 70 }),
  check('protect').isInt({ min: 0, max: 1 }),
  check('color').isIn(['black', 'white', 'red', 'blue']),
  check('font').isIn(['impact', 'comic']),
  check('template').isInt({ min: 1, max: 6 }),
  oneOf([
    check('text1').isLength({ min: 1 }),
    check('text2').isLength({ min: 1 }),
    check('text3').isLength({ min: 1 })
  ]),
  check('text1').isLength({ max: 70 }),
  check('text2').isLength({ max: 70 }),
  check('text3').isLength({ max: 70 })
], async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  // controllo che non ci siano più testi del dovuto
  const template = await memeDao.getTemplateById(req.body.template);
  if(template.num_field==1 && (req.body.text2!="" || req.body.text3!=""))
    return res.status(422).json({ error: `Text2 and Text3 must be empty strings` });
  if(template.num_field==2 && req.body.text3!="")
    return res.status(422).json({ error: `Text3 must be an empty string` });

    const meme = {
    title: req.body.title,
    protect: req.body.protect,
    text1: req.body.text1,
    text2: req.body.text2,
    text3: req.body.text3,
    color: req.body.color,
    font: req.body.font,
    template: req.body.template,
    creator: req.user.id    // importante!!
  };
  try {
    await memeDao.createMeme(meme);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of meme ${meme.id}.` });
  }
});

// DELETE /api/memes/:id
// cancella uno dei meme propri 
app.delete('/api/memes/:id', isLoggedIn, [param('id').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    try {
      await memeDao.deleteMeme(req.params.id, req.user.id);
      // passiamo req.user.id per evitare che si possa cancellare qualcosa di non nostro 
      res.status(200).json({});
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}` });
    }
  });

// attiviamo il server 
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});