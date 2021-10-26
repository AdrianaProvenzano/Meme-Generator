import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyNavBar(props) {
    return (
        <Navbar bg="dark" variant="dark" className="w-100" expand="sm" fixed="top" sticky="top" >
            <Navbar.Brand href="/" className="title">
                <img alt="application_logo" src="logo_meme.png" className="px-2" />
                MemeGenerator
            </Navbar.Brand>
            {/* se sono loggato posso creare un nuovo meme clickando il bottone CREATE */}
            {props.loggedIn ?
                <Link to="/create"><Button variant="outline-light">CREATE</Button></Link> : ''}
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                {/* se sono loggato vedo il mio nome sulla navbar, se clicko su LOGOUT faccio logout. 
                Se non sono loggato posso clickare sul bottone LOGIN per fare il login (verrò reinderizzato a /login)*/}
                {props.loggedIn ?
                    <>
                        <Navbar.Text className="font-italic mr-4">Welcome {props.user}!</Navbar.Text>
                        <Link to="/">
                            <Button variant="outline-light" className="yellowgreen mr-2" type="submit" onClick={props.logout}>LOG OUT</Button></Link>
                    </>
                    :
                    <Link to="/login">
                        <Button variant="outline-light" className="yellowgreen mr-2" type="submit">LOG IN</Button></Link>
                }
            </Navbar.Collapse>
        </Navbar >
    )
}

export { MyNavBar };
