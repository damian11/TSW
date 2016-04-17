/*jshint jquery: true, devel: true */

var serverSize;
var serverDim;
var serverMax;

$(function () {
    var pg = $( "#playground" );
    var message = $( "#message" );
    
    var startGameButton = $("#startGameButton");
    startGameButton.click(function() {
        var size =  $( "#size" ).val();
        var dim =  $( "#dim" ).val();
        var max =  $( "#max" ).val();
        
        var url = "play/size/"+size+"/dim/"+dim+"/max/"+max+"/";

        $.ajax({
            url: url,
            context: document.body
        }).done(function(resp) {
            if (resp.retMsg == "Success") {
                message.text("Mastermind - gra rozpoczęta");
//                pg.text("Gra rozpoczęta. rozmiar planszy: " + resp.size + "; liczba kolorów: " + resp.dim + "; max liczba ruchów: " + resp.max);
                
                serverSize = resp.size;
                serverDim = resp.dim;
                serverMax = resp.max;
                
                var colorForm = $("#colorsForm");
                colorForm.append("<label>Twoje kolory: </label>");
                for (i=0; i<resp.size; i++) {
                    colorForm.append("<input type=\"text\" id=\"color"+(i+1)+"\"  />");
                }
                colorForm.append("<input type=\"button\" id=\"sentButton\" value=\"Wykonaj ruch\"/>");
    
                var sentButton = $("#sentButton");
                sentButton.click(function() {
                   userMove(); 
                });
            }
            else {
                alert("Błąd!");
            }
        });
    });
    
    console.log(pg);
});

function userMove() {
    var pg = $( "#playground" );
    var message = $( "#message" );
    
    var url = "mark/";
    for (i=0; i<serverSize; i++) {
        var color = $("#color" + (i+1)).val();
        url += color + "/";
    }
    
    $.ajax({
        url: url,
        context: document.body
    }).done(function(resp) {
        message.text("Mastermind - " + resp.retMsg);
        
        var answer = resp.retVal;
        pg.append("<p>");
     
        console.log(answer[0]);
        for (i=0; i<answer.length; i++) {
            if (answer[i] == 'c') {
                pg.append("Czarny ");
            }
            if (answer[i] == 'b') {
                pg.append("Biały ");
            }
        }
        pg.append("</p>");
    });
}