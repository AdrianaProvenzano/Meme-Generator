import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, React } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, ListGroup, Container, Modal } from 'react-bootstrap';
import { MemeComponent } from './MemeComponent'
import { iconDelete, iconCopy, iconProtected } from '../icons';

function MyMemeList(props) {
  return (
    <Container fluid className="vh-100 pt-3 pb-3" >
      <Col>
        <ListGroup >
          {props.memes.map((m, index) =>
            <MemeRow key={index}
              meme={m}
              templates={props.templates}
              loggedIn={props.loggedIn}
              user={props.user}
              getnamebyid={props.getNameById}
              deleteMeme={props.deleteMeme}
            />
          )}
        </ListGroup>
      </Col>
    </Container>);
}

function MemeRow(props) {
  return (
    <ListGroup.Item className={`list-item`}>
      <MemeData meme={props.meme} templates={props.templates} getnamebyid={props.getnamebyid} />
      <MemeControl meme={props.meme} loggedIn={props.loggedIn} user={props.user} deleteMeme={props.deleteMeme} />
    </ListGroup.Item>
  )
}

function MemeData(props) {
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);
  let status = 'null';
  const handleClose = () => setShow(false);
  const handleShow = () => {
    props.getnamebyid(props.meme.creator)
      .then(function (res) {
        setName(res);
      })
    setShow(true);
  };

  switch (props.meme.status) {
    case 'added':
      status = 'added';
      break;
    case 'deleted':
      status = 'deleted';
      break;
    default:
      break;
  }

  return (
    <div className="d-flex justify-content-start">
      {/* clickando sul titolo del meme si apre il modale con i dettagli */}
      <Button className={`list-item-button ${status}`} onClick={handleShow}>{props.meme.title}</Button>
      {props.meme.protect ? <span className="d-flex align-self-center mx-3">{iconProtected}</span> : ''}

      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{props.meme.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col md="auto">
                <MemeComponent meme={props.meme} templates={props.templates} />
              </Col>
              <Col  md="auto" className="creator my-4">
                Posted by {name}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button className="list-item-button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

function MemeControl(props) {
  return (
    <div className="d-flex justify-content-end ">
      {/* se sono loggato e sono il creatore di questo meme allora posso cancellarlo*/}
      {props.loggedIn && props.user === props.meme.creator ? <Button className="control-button" onClick={() => { props.deleteMeme(props.meme.id) }}>{iconDelete}</Button> : ''}
       {/* se sono loggato posso copiare da questo meme*/}
      {props.loggedIn ?
        <Link to={{
          pathname: "/create",
          state: { meme: props.meme }
        }}><Button className="control-button">{iconCopy}</Button></Link> : ' '}
    </div>
  )
}
export { MyMemeList };