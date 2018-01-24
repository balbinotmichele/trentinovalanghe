let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let xhr = new XMLHttpRequest();

const TelegramBot = require('botgram');

const telegram = new TelegramBot("495646013:AAFvtLE7gJqby_HHAYaScSjv_UYEBjYE4m8");

let page = "";
xhr.open('GET', 'http://content.meteotrentino.it/m/albinafe/getJson.aspx', false);
xhr.send(null);
page = JSON.parse(xhr.responseText);




function testo(page) {
	let msg = page.oggetto.toUpperCase() + ' (dal ' + page.dataPubblicazione.slice(0, 10) +' al ' + page.valido_per + ')' + '\n\n';
	return msg;
}


try {
    telegram.command("start", (message, reply, next) => {
        let hello = 'Ciao '+ message.chat.firstname + '! Questo bot serve a ricevere il bollettino valanghe di MeteoTrentino. \n\nPer ogni informazione scrivi a @michele_balbi \n\nFonte: Provincia Autonoma di Trento - Meteotrentino';
    
        xhr.open('GET', 'http://content.meteotrentino.it/m/albinafe/getJson.aspx', false);
        xhr.send(null);
        page = JSON.parse(xhr.responseText);
    
        var keyboard1 = [
        [ { text: "Bollettino" } ]
        ];
    
        reply.keyboard(keyboard1, true).text(hello);
    });
    
    telegram.text(true, (msg, reply, next) => {
        if(msg.text == 'Bollettino' || msg.text == '/bollettino') {
            tastieraZone(page, reply);
        }
        for(var i=0; i<page.aree.length; i++) {
          if(msg.text.split('-')[0] == page.aree[i]['microzone:'].split('-')[0]) {
            reply.photo(page.aree[i].mappaAreaGiorno,  page.aree[i].pericoloValangheAreaBreve);
            reply.text(page.aree[i].pericoloValangheAreaEsteso);
          }
        }
    });
    
    function tastieraZone(page, reply) {
        var keyboardZone = [];
        keyboardZone[0] = [];
        for(var i=0; i<page.aree.length; i++) {
        keyboardZone[0][i] = {text: page.aree[i]['microzone:']}
        }
        reply.keyboard(keyboardZone, true).photo(page.mappaGeneraleGiorno, testo(page));
        reply.text(page.statoNeveInBreve);
        reply.text(page.statoNeveEsteso);
        reply.text("Scegli la zona");
    }
    

} catch (error) {
    telegram.reply(18620751).text = "Problema con utente";
    reply = null;
}