GameVoting
=========
[![Build Status](https://travis-ci.org/Afsoon/GameVoting.svg?branch=master)](https://travis-ci.org/Afsoon/GameVoting)


H4ckademy project out of the Creepy Coconuts edition.

Made by Said and Jose.

# What the heck is this?

GameVoting is an oper source web app made for the use case of a break in a tennis match. People in the court watching the match logs into the app and choose a side: one side will represent the player who draws the ball and the other side will be the one that receives. Players must choose the side that the ball will be thrown / received by swiping an area on the device. Then they will shake the device to send the vote!

To run the application, just run node app.js and access the different html files:

      · index.html: device controller for teams
      
      · score/index.html: the scoreboard that can be showed up in a big, big screen!

      · control/index.html: a simple control panel to reset the scoreboard and then start again.

# Scaffolding

/server - this is where the WebSocketsImplementation.js is located and must be runned on your server to play the app

/public
      
      /js           - javascripts files to control the views (html files)
      
      /stylesheets  - css files to give the views some good style
      
      /images       - autodescriptive.
  
      /sounds       - used by the app (we're insane, right?)
  
/modules - this is where are locate all modules about game logic. 


