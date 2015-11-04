
var myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 1000 // optional, determines the frequency of event generation
});

myShakeEvent.start;

window.addEventListener('shake', shakeEventDidOccur, false);

//function to call when shake occurs
function shakeEventDidOccur () {

    alert('shake!');
}

window.removeEventListener('shake', shakeEventDidOccur, false);

myShakeEvent.stop();

$(function() {      
      //Enable swiping...
      $("#swipeArea").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          $(this).text("You swiped " + direction );  
        },
        threshold: 0       
      });
    });