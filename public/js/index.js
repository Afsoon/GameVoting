/**
 * Created by saidatrahouchecharrouti on 25/11/15.
 */
setTimeout(function(){
    $("#textGame").toggleClass('none');
}, 5000);

setTimeout(function(){
    $("#textIns").toggleClass('none');
}, 2000);

setTimeout(function () {
    $("#article").addClass('goGame');
    $("#juego").addClass('middle');
}, 7000);
/**
 setTimeout(function () {
	$("#text1").addClass('while');
	$("#text2").addClass('while');
}, 12000);**/
/**
 setTimeout(function () {
	$("#juego").append("<section id=\"initIns\" class=\"up\"> <div id=\"text1\" class=\"content\"></div></section><section id=\"initIns\" class=\"down\"><div id=\"text1\" class=\"content\"><h2 id=\"arrowLeft\"> > </h2></div></section>");
}, 9000);**/

setTimeout(function () {
    $("#instr").append("<h2 id=\"textInfo\">Desliza el dedo sobre la pantalla</h2>");
    $("#option").append("<h3 id=\"arrowLeft\"> > </h3>");
}, 9000);
/**
 setTimeout(function () {
	$("#article").removeClass('init');
	$("#article").addClass('middle');
	$("#article")
		.append("<section id=\"initIns\" class=\"while\"> <h2 id=\"textInfo\" class=\"add\">Desliza el dedo sobre la pantalla</h2></section>");
}, 10000);

 setTimeout(function () {
	$("#article")
		.append("<section id=\"initIns\" class=\"arrow\"> <div class=\"content\"> <h2 id=\"arrowLeft\" class=\"addLeft\"> < > </h2></div></section>");
}, 11000);**/