import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { MyNavBar } from './components/MyNavBar';
import { MyMemeList } from './components/MyMemeList';
import { iconClock } from './icons'
import LoginForm from './components/LoginComponent';
import MemeForm from './components/MemeForm';
import API from './API';
import { React, useState, useEffect } from 'react';
import { Row, Container, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Main></Main>
    </Router>
  );
}

const Main = () => {
  const [memes, setMemes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect #1 - ogni volta che viene fatto il mounting dell'applicazione
  // e ogni volta che passiamo da utente loggato a utente non loggato (o vicevera)
  // andiamo a vedere se siamo loggati o meno 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await API.getUserInfo();    // ritorna utente (id, username, name)
        setLoggedIn(true);
        setName(u.name)
        setUser(u.id)
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, [loggedIn]);

  // useEffect #2 - ogni volta che viene fatto il mounting dell'applicazione vengono 
  // scaricati i template dei meme presenti nel db attraverso l'API getAllTemplates()
  useEffect(() => {
    const getTemplates = async () => {
      const templates = await API.getAllTemplates();
      setTemplates(templates);
      setDirty(true);
    };
    getTemplates()
      .catch(err => {
        setMessage({ msg: "Impossible to load your templates! Please, try again later...", type: 'danger' });
        console.error(err);
      });
  }, []);

  // useEffect #3 - ogni volta che l'utente passa da essere loggato a non esserlo, o viceversa, oppure 
  // in seguito ad aggiornamenti dlel db che ancora non sono stati catturati dal server, e solo dopo 
  // il caricamento dei template, vengono scaricati i meme da visualizzare nella pagina principale. 
  // Tutti i meme nel caso di utenti loggati, solo quelli non protetti nel caso di utenti non loggati. 
  useEffect(() => {
    if (loggedIn) {
      const getMemes = async () => {
        const memes = await API.getAllMemes();
        setMemes(memes);
      };
      if (templates.length && dirty) {
        getMemes().then(() => {
          setDirty(false);
          setLoading(false)
        }).catch(err => {
          setMessage({ msg: 'Impossible to load your memes! Please, try again later...', type: 'danger' });
          console.error(err);
        });
      }
    } else {
      const getPublicMemes = async () => {
        const memes = await API.getPublicMemes();
        setMemes(memes);
      }
      if (templates.length > 0 && dirty) {
        getPublicMemes().then(() => {
          setDirty(false);
          setLoading(false);
        }).catch(err => {
          setMessage({ msg: 'Impossible to load your memes! Please, try again later...', type: 'danger' });
          console.error(err);
        });
      }
    }
  }, [templates.length, dirty, loggedIn]);

  // riceve come parametro un errore da salvare nello stato message, che poi verrà visualizzato 
  const handleErrors = (err) => {
    if (err.errors)
      setMessage({ msg: err.errors[0].msg + ': ' + err.errors[0].param, type: 'danger' });
    else
      setMessage({ msg: err.error, type: 'danger' });
    setDirty(true);
  }

  // funzione passata a MyMemeList, permette di eliminare un meme tra quelli propri, il meme eliminato viene 
  // visualizzato in rosso per pochi secondi 
  const deleteMeme = (id) => {
    setMemes(oldMemes => {
      return oldMemes.map(meme => {
        if (meme.id === id)
          return { ...meme, status: 'deleted' };
        else
          return meme;
      });
    });
    API.deleteMeme(id)
      .then(() => {
        setDirty(true)
      })
      .catch(e => handleErrors(e))
  }

  // funzione passata a MemeForm, permette di aggiungere un nuovo meme 
  const addMeme = (meme) => {
    meme.status = 'added';
    setMemes(oldMemes => [...oldMemes, meme]);
    API.addMeme(meme)
      .then(() => {
        setDirty(true);
      }).catch(err => handleErrors(err));
  }

  // funzione passata a MyMemeList per visualizzare il nome dell'utente che ha pubblicato quel particolare meme; 
  // il nome è calcolato a partire dall'attributo author (id utente) salvato nel meme 
  const getNameById = async (id) => {
    try {
      const name = await API.getNameById(id);
      return name;
    }
    catch (err) {
      handleErrors(err)
      throw err;
    }
  }

  // login utente, si appoggia sull'apposita API che restituisce l'id dell'utente loggato 
  // le variabili di stato dirty e message vengono "pulite"
  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setLoading(true);
      setDirty(true);
      setMessage('')
    }
    catch (err) {
      handleErrors(err)
      throw err;
    }
  }
  // logout utente, si puliscono tutte le variabili di stato ad eccezione dei template 
  // e dei meme (che vengono successivamente ricalcolati a seguito della useEffect #3)
  const doLogOut = async () => {
    await API.logOut();
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    setName(null);
    setDirty(true)
    setLoading(true);
    setMessage('')
  }

  return (
    <Router>
      <Container fluid className="App">
        <Row>
          <MyNavBar loggedIn={loggedIn} logout={doLogOut} user={name} />
        </Row>
        <Row>
          <Switch>

            <Route exact path="/">
              <div className="vh-100 w-100 sfondo">
                {message ? <Alert className="mx-2 my-2" variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert> : ''}
                {loading && !message ? <h3 className="loading">{iconClock}Loading...</h3> :
                  <MyMemeList templates={templates} memes={memes} user={user} loggedIn={loggedIn} getNameById={getNameById} deleteMeme={deleteMeme} />}
              </div>
            </Route>

            <Route exact path="/login">
              {loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}
            </Route>

            <Route exact path="/create">
              {templates.length>0 ? <MemeForm addMeme={addMeme} user={user} templates={templates} /> : ''}
            </Route>

            <Route path="/">
              <Redirect to="/" />
            </Route>

          </Switch>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
