import { Form, Button, Container, Col, Alert, Row } from 'react-bootstrap';
import { React, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { MemeComponent } from './MemeComponent'

function MemeForm(props) {
    const loc = useLocation();
    const [title, setTitle] = useState(loc.state ? loc.state.meme.title : '');
    const [image, setImage] = useState(loc.state ? loc.state.meme.template : 1);
    const [protect, setProtect] = useState(loc.state ? loc.state.meme.protect : 0);
    const [font, setFont] = useState(loc.state ? loc.state.meme.font : 'impact');
    const [color, setColor] = useState(loc.state ? loc.state.meme.color : 'black');
    const [text1, setText1] = useState(loc.state ? loc.state.meme.text1 : '');
    const [text2, setText2] = useState(loc.state ? loc.state.meme.text2 : '');
    const [text3, setText3] = useState(loc.state ? loc.state.meme.text3 : '');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const findTemplate = () => {
        let t = props.templates.find(function (template) {
            if (template.id === image) {
                return true;
            }
            return false;
        });
        return t;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() === '') {
            setErrorMessage('Please add a title to your meme!');
        }
        else if (text1.trim() === "" && text2.trim() === "" && text3.trim() === "") {
            setErrorMessage('Please complete at least one text field!');
        }
        else {
            const meme_submitted = { title: title, protect: protect, text1: text1, text2: text2, text3: text3, color: color, font: font, template: image };
            props.addMeme(meme_submitted);
            setSubmitted(true);
        }
    };

    return (
        <>
            {submitted ? <Redirect to="/" /> :
                <Container fluid className="vh-100 w-100 mt-2">
                    <Row className="d-flex justify-content-center align-item">
                        <Col md="auto" className="d-flex justify-content-start memeform">
                            <Form >
                                <Form.Group controlId="chooseTitle" className="d-inline-flex">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" className="mx-3" value={title} placeholder="Enter a title" onChange={ev => setTitle(ev.target.value)} maxLength="70" />
                                </Form.Group>

                                {/* posso scegliere l'immagine del mio meme solo quando non sono in modalità copia*/}
                                {loc.state ? '' :
                                    <>
                                        <Form.Group controlId="chooseMeme1" className="d-flex align-items-start flex-wrap">
                                            <Form.Check className="ml-3" block="true" label={<img alt="meme_cartello" src={props.templates[0].image_path} className="meme" width="150px" />} name="group1" type="radio" id="meme-1" onChange={() => setImage(1)} checked={image === 1} />
                                            <Form.Check className="ml-3" block="true" label={<img alt="meme_panik" src={props.templates[1].image_path} className="meme" width="150px" />} name="group1" type="radio" id="meme-2" onChange={() => setImage(2)} checked={image === 2} />
                                            <Form.Check className="ml-3" block="true" label={<img alt="meme_bike" src={props.templates[2].image_path} className="meme" width="150px" />} name="group1" type="radio" id="meme-3" onChange={() => setImage(3)} checked={image === 3} />
                                        </Form.Group>
                                        <Form.Group controlId="chooseMeme2" className="d-flex align-items-start flex-wrap">
                                            <Form.Check className="ml-3" block="true" label={<img alt="meme_cat" src={props.templates[3].image_path} className="meme" width="150px" />} name="group1" type="radio" id="meme-4" onChange={() => setImage(4)} checked={image === 4} />
                                            <Form.Check className="ml-3" block="true" label={<img alt="meme_drake" src={props.templates[4].image_path} className="meme" width="150px" />} name="group1" type="radio" id="meme-5" onChange={() => setImage(5)} checked={image === 5} />
                                            <Form.Check className="ml-3" block="true" label={<img alt="meme_change" src={props.templates[5].image_path} className="meme" width="150px" />} name="group1" type="radio" id="meme-6" onChange={() => setImage(6)} checked={image === 6} />
                                        </Form.Group>
                                    </>}

                                <Form.Group>
                                    <div className="d-flex align-items-start">
                                        <Form.Label className="mr-3">Text #1</Form.Label>
                                        <Form.Control type="text" value={text1} placeholder="Enter a text" onChange={ev => setText1(ev.target.value)} maxLength="70" />
                                    </div>
                                    {findTemplate().num_field > 1 ?
                                        <div className="d-flex align-items-start">
                                            <Form.Label className="mr-3">Text #2</Form.Label>
                                            <Form.Control type="text" value={text2} placeholder="Enter a text" onChange={ev => setText2(ev.target.value)} maxLength="70" />
                                        </div> : ''}
                                    {findTemplate().num_field > 2 ?
                                        <div className="d-flex align-items-start">
                                            <Form.Label className="mr-3">Text #3</Form.Label>
                                            <Form.Control type="text" value={text3} placeholder="Enter a text" onChange={ev => setText3(ev.target.value)} maxLength="70" />
                                        </div> : ''}

                                </Form.Group>

                                <Form.Group controlId="chooseFont" className="d-flex align-items-start">
                                    <Form.Label className="mr-3">Text font</Form.Label>
                                    <Form.Check inline label="Impact" className="impact" name="group2" type="radio" id="font-1" onChange={() => setFont('impact')} checked={font === 'impact'}></Form.Check>
                                    <Form.Check inline label="Comic Sans" className="comic" name="group2" type="radio" id="font-2" onChange={() => setFont('comic')} checked={font === 'comic'}></Form.Check>
                                </Form.Group>

                                <Form.Group controlId="chooseColor" className="d-flex align-items-start">
                                    <Form.Label className="mr-3">Text color</Form.Label>
                                    <Form.Check inline label="Black" name="group3" type="radio" id="color-1" onChange={() => setColor('black')} checked={color === 'black'} value={color === 'black'}></Form.Check>
                                    <Form.Check inline label="White" name="group3" type="radio" id="color-2" onChange={() => setColor('white')} checked={color === 'white'} value={color === 'white'}></Form.Check>
                                    <Form.Check inline label="Red" name="group3" type="radio" id="color-3" onChange={() => setColor('red')} checked={color === 'red'} value={color === 'red'}></Form.Check>
                                    <Form.Check inline label="Blue" name="group3" type="radio" id="color-4" onChange={() => setColor('blue')} checked={color === 'blue'} value={color === 'blue'}></Form.Check>
                                </Form.Group>

                                {/* se sono in modalità copia, se non sono il proprietario del meme da cui sto copiando e la visibilità 
                                è 'protected' allora non posso modificarla, in tutti gli altri casi posso*/}
                                {loc.state && loc.state.meme.creator !== props.user && loc.state.meme.protect ? '' :
                                    <Form.Group controlId="choseVisibility" className="d-flex align-items-start">
                                        <Form.Label className="mr-3">Visibility</Form.Label>
                                        <Form.Check checked={protect === 1 ? false : true} value={protect === 1} onChange={(ev) => setProtect(protect === 0 ? 1 : 0)} type="switch" id="custom-switch" label={protect === 0 ? 'Public' : 'Protected'} />
                                    </Form.Group>}

                                {errorMessage ? <Alert className="mx-3 my-2 w-100 error" onClose={() => setErrorMessage('')} dismissible>{errorMessage}</Alert> : false}
                                
                                <Button className="yellowgreen-opposite" onClick={handleSubmit}>Submit</Button>

                            </Form>
                        </Col>
                        <Col md="auto" className="mx-5">
                            {image ? <MemeComponent meme={{ title: title, protect: protect, text1: text1, text2: text2, text3: text3, color: color, font: font, template: image, creator: props.user }} templates={props.templates} /> : ''}
                        </Col>
                    </Row>
                </Container>
            }
        </>
    )
}

export default MemeForm;