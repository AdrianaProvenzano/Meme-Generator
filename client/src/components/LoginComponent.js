import { Form, Button, Container, Alert, Row } from 'react-bootstrap';
import { React, useState } from 'react';

function LoginForm(props) {
    const [username, setUsername] = useState('adriana97');
    const [password, setPassword] = useState('adriana97');
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        // validazione dei campi inseriti 
        let valid = true;
        if (username === '' || password.length < 6) {
            valid = false;
            setErrorMessage('Email cannot be empty and password must be at least six character long.');
            setShow(true);
        }
        if (valid) {
            const credentials = { username, password };
            props.login(credentials)
                .catch((err) => { setErrorMessage(err); setShow(true); })
        }
    };

    return (
        <Container fluid className="vh-100 w-100 px-5 pt-2 sfondo" >
            <Row className="mt-4 justify-content-md-center" >
                <div className="loginform">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="mb-3">Username</Form.Label>
                            <div className="d-flex justify-content-center">
                                <Form.Control type="text" className="w-70" placeholder="Enter username" value={username} onChange={ev => setUsername(ev.target.value)} />
                            </div>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="mb-3">Password</Form.Label>
                            <div className="d-flex justify-content-center">
                                <Form.Control type="password" className="w-70" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                            </div>
                        </Form.Group>
                        <br />
                        {show ? <Alert className="w-100 error" dismissible onClose={() => setShow(false)}>{errorMessage}</Alert> : ''}

                        <Button variant="outline-light" className="yellowgreen" onClick={handleSubmit}>Submit</Button>
                    </Form>
                </div>
            </Row>
        </Container>
    )
}

export default LoginForm;