/**
 * Oggetto che descrive un template
 */
 class Template {
    /**
     * crea un nuovo template 
     * @param {*} id codice univoco del template 
     * @param {*} image_path stringa che descruve il percorso dell'immagine  
     * @param {*} num_field numero di campi testuali che possono essere inseriti sull'immagine 
     * @param {*} position_text1 nome della classe CSS che determina la prosizione del primo testo 
     * @param {*} position_text2 nome della classe CSS che determina la prosizione del secondo testo (se presente)
     * @param {*} position_text3 nome della classe CSS che determina la prosizione del terzo testo (se presente)
     */

    constructor(id, image_path, num_field, position_text1, position_text2, position_text3) {
      this.id = id; 
      this.image_path=image_path
      this.num_field = num_field; 
      this.position_text1=position_text1;
      this.position_text2 = position_text2;
      this.position_text3 = position_text3;
    }
  
    static from(json) {
      return new Template(json.id, json.image_path, json.num_field, json.position_text1, json.position_text2, json.position_text3);
    }
  
  }
  
  export default Template;