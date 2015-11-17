/**
 * Created by saidatrahouchecharrouti on 11/11/15.
 */

var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));

function reward_user( event ) {
    if ( event ) {
        alert( 'Tweeted' );
        console.log( event );
    }
}

twttr.ready(function (twttr) {
    twttr.events.bind('tweet', reward_user);
});