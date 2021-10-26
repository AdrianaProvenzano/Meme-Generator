import { React } from 'react';
import { Container } from 'react-bootstrap';

function MemeComponent(props) {
    let t = props.templates.find(function (template) {
        if (template.id === props.meme.template) {
            return true;
        }
        return false;
    });

    return (
        <Container className={`meme-container ${props.meme.font} text-${props.meme.color}`} width="400px">
            <img alt="meme_picture" src={t.image_path} className="meme w-100" />
            <div className={`meme-finish ${t.position_text1}`}>{props.meme.text1}</div>
            {t.num_field > 1 ? <div className={`meme-finish ${t.position_text2}`}>{props.meme.text2}</div> : ''}
            {t.num_field > 2 ? <div className={`meme-finish ${t.position_text3}`}>{props.meme.text3}</div> : ''}
        </Container>
    )
}
export { MemeComponent };