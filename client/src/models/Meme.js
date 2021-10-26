/**
 * Informazioni relative ad un meme pubblicato 
 */
class Meme {
    /**
     * costruisce un nuovo oggetto Meme
     * @param {*} id codice univodo del meme 
     * @param {*} title titolo del meme
     * @param {*} protect 0 se non è protetto (e visibile a utenti non loggati) 1 se è protetto 
     * @param {*} text1 stringa inserita dall'utente nel primo campo testuale
     * @param {*} text2 stringa inserita dall'utente nel secondo campo testuale (se il template lo permette)
     * @param {*} text3 stringa inserita dall'utente nel terzo campo testuale (se il template lo permette)
     * @param {*} color stringa per il colore ('black', 'white', 'red', 'blue')
     * @param {*} font stringa per il font ('impact', 'comic')
     * @param {*} template id del template usato 
     * @param {*} creator id del creatore del meme 
     */
    constructor(id, title, protect, text1, text2, text3, color, font, template, creator) {
        this.id = id;
        this.title = title;
        this.protect = protect;
        this.text1 = text1; 
        this.text2 = text2; 
        this.text3 = text3; 
        this.color = color; 
        this.font = font; 
        this.template = template;
        this.creator = creator;
    }

    static from(json) {
        return new Meme(json.id, json.title, json.protect, json.text1, json.text2, json.text3, json.color, json.font, json.template, json.creator);
    }
}

export default Meme;