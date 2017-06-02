
var saveLocally = false; //default false, if browser has functionality will change to true


var game = {  //all game logic wrapped in game object

  players: {

    x: {
      name: '',    //this will be assigned upon the on.click of the avatar image
      score: 0,    //incremented upon a win condition - see checkWinner();
      image: ''    //this will be a file path to images folder, assigned upon on.click of avatar img
    },

    o: {
      name: '',
      score: 0,
      image: ''
    }

  },
  user: 'x',   // default, first player starts as X
  turns: 0,    // this counter will be incremented after ever click of <td> in my table (max: 9 turns)
  win: false,  // default false, re-assigned true when checkWinner() returns true (see line 157)
  userImagesSelected: 0,  //incremented after each click of an avatar - ensuring both players set.
  gamesPlayed: 0,  //increments per win, determines switch of level background images (Lines 62 & 177)
  playersSet: false, //used to skip the userImagesSelected counter after initial round (see line 139)
  levelBackgrounds:['images/moragstructure.jpg','images/novaprimebackground.jpg','images/kylnbackground.jpg','images/jailpic.jpeg','images/sanctuary.png','images/Knowhere.png','images/knowhereinside.jpg','images/finalbattle.jpg','images/darkastorcrash.png'],
  // levelBackgrounds being looped through: [url('../images/moragplanet.jpg')],

  board: [null, null, null, null, null, null, null, null, null],
  //default gameboard state - null : cell index

  resetGame: function(){ //executed upon click of "Next Round" button and if you refresh browser
    this.board = [null, null, null, null, null, null, null, null, null]
    this.turns = 0;
    this.win = false;
    this.userImagesSelected = 2; // sets so that players do not have to reselect avatar images
  },
  checkWinner: function(movesArray){
    // passing current board after each move & looking through all winning scenarios
    var board = this.board;
    if(board[0] === board[1] && board[0] === board[2] && board[0] !== null){return true;}
    if(board[3] === board[4] && board[3] === board[5] && board[3] !== null){return true;}
    if(board[6] === board[7] && board[6] === board[8] && board[6] !== null){return true;}
    if(board[0] === board[3] && board[0] === board[6] && board[0] !== null){return true;}
    if(board[1] === board[4] && board[1] === board[7] && board[1] !== null){return true;}
    if(board[2] === board[5] && board[2] === board[8] && board[2] !== null){return true;}
    if(board[0] === board[4] && board[0] === board[8] && board[0] !== null){return true;}
    if(board[2] === board[4] && board[2] === board[6] && board[2] !== null){return true;}

      return false;
  }, //checkWinner function, return true if X or O has returned for any of the winning scenarios

  updateUI: function(){
    if (this.win) {
      // if win var = true, handle some UI related updates to tell users what is happening
      $('#resultbanner').fadeIn(1500);
      $('#resultbanner').text(game.players[game.user].name + ' wins!');
      $('#clearHistory').hide(); //hides option to clear last game history assuming win means continue
      game.players[game.user].score +=1; //add to winner another score counting towards max of 6 wins.
      game.gamesPlayed += 1; // kicks off level background change
      $('#' + game.user + ' img:hidden:first').show(); //show another of the 6 hidden gem img's

      //localStorage of player object (scores, images, name) if functionality availalbe in browser
      if( saveLocally ){
        localStorage.setItem('gameState', JSON.stringify(game.players));
      }

      if(game.players[game.user].score === 6){ //if this winning player has won 6 rounds, execute:
        $('body').css('background-image','url(images/finale.jpg)').fadeIn(4000);
        $('#resultbanner').css({'background-color': 'rgba(0,0,0, 0.75)','height': '150px'});
        $('#resultbanner').text(game.players[game.user].name + " is a Guardian of the Galaxy ").fadeIn(6000);
        $('#nextLevel').hide();
        $('.fade').fadeOut(1500);
        if (saveLocally){
          localStorage.removeItem('gameState');
          // if all 6 rounds completed, game is done, clear last game history out of browser's storage
        }
      }

    } else {
        // if var win !== true, then by default game is a draw.
      console.log('game is a draw');
      $('#resultbanner').fadeIn(1500);
      $('#resultbanner').text('Draw');
    }
  }
};

var restoreGameUI = function () {
    //loops back through hidden gem images, and unhides 1 for each restored score unit of player
    var i =1;
    console.log(game.players.x.score);
    while(i <= game.players.x.score){ //for user x/player 1

      $('#x').children().eq(i).show();
      i++;
    }

  $( "#o img:hidden" ).each(function() {
    var i = 1;
    while(i <= game.players.o.score){ //for user o/player 2
      $('#o').children().eq(i).show();
      i++;
    }
  });

  game.userImagesSelected = 2;  //in restore need to reset var to 2 to pass check on avatar selection.
  game.win = false;  //reset to false so restored players can commence new round
  $('#title1').text(this.id);
  $('#playerXbackground').css({'background-image': 'url(' + game.players.x.image + ')', 'background-size': 'cover'});
  $('#title2').text(this.id);
  $('#playerObackground').css({'background-image': 'url(' + game.players.o.image + ')', 'background-size': 'cover'});
  // show a gem for each point scored by each player

};

$( document ).ready(function() {

  // Load saved game state if available
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    saveLocally = true;
    var state = JSON.parse(localStorage.getItem('gameState'));
    if( state !== null){
      game.players = state;
      restoreGameUI();
      $('#clearHistory').show();
    }
  }

  $( "td" ).on('click', function() {  //fires each time a player clicks a cell in tictactoe

    if(game.userImagesSelected === 0){
      alert("Player 1 needs to select a character, followed by Player 2");
      return;
    } else if (game.userImagesSelected === 1){
      alert("Player 2 still needs to select a character");
      return;
    } else {
     game.playersSet = true;
     $('.characterSelector *').hide(); //hide other avatar images after selections are made
    }
    var boardIndex = this.id; // save id of td (which is same as it's index in game.board)

    if( game.win ){  //ensures if round is one that players cannot continue interacting with the board
      return;
    }

    if ( game.board[ boardIndex ] ){ // if cell has a length, then it is occupied
      $('#resultbanner').text("Occupied try again!");
      return;
    }

    game.board[ boardIndex ] = game.user;
    //natural else if location in board is null, fill it with "X" or "O"
    $("#" + boardIndex).css('background-image', "url(" + game.players[game.user].image + ")");
    // sets background of resepctive cell to image of player's avatar
    game.turns += 1;  // increments turn counter by one so we can keep track of 9 moves.

    game.win = game.checkWinner(game.board); // sets win var to true if winning scenario matched.
    if(game.win || game.turns === 9) {
    //either 'true' (aka win) || or draw as all 9 turns taken w/ no win
      game.updateUI(); //call update UI function with corresponding result
      return;  // avoid switching player token after win
    }
    //below if/else is toggling from original default of 'x' to 'o', and back to 'x' per turn/on.click of td
    if( game.user === 'x' ) {
      game.user = 'o'
    } else {
      game.user = 'x'
    }
  }); //on-click function


  $('#nextLevel').on('click', function(){
      //clears backend game logic (see line 34)
      game.resetGame();
      // below jquery resets the front-end display: clears cells of images/hides h2 result banner
      $('td').css('background-image', '');
      $('#resultbanner').hide();
      $('#resultbanner').text('');
      if(game.gamesPlayed > 0){
          $('body').css('background-image', "url(" + game.levelBackgrounds[game.gamesPlayed - 1] + ")");
      }

  });

  $('#clearHistory').on('click', function(){
      // clear history button only appears if localStorage has been used:
      localStorage.removeItem('gameState'); // clears localStorage as per user request
      game.resetGame(); // resets game logic on back end
      game.userImagesSelected = 0; //resets checks on avatar selection in on.click('td')
      game.players.x.score = 0; //resets scores from prior game to 0
      game.players.o.score = 0;
      $('#playerXbackground, #playerObackground').css('background-image', '');  // resets player divs
      $('#x img, #o img, #clearHistory').hide(); // resets player divs


  });


  $('.characterSelector > img').on('click', function() { //selection of avatar on.click of image
      game.userImagesSelected += 1; //increment each time to ensure we track selection & correct alert
      game.players[game.user].name = this.id //sets player objects 'x' & 'o' properties
      game.players[game.user].image = this.src
      $('#' + this.id).hide(); // hides selected image from avatar div once picked
      if( game.user === 'x' ){
        $('#title1').text(this.id); //changes player 1 text to ID name on image selected
        $('#playerXbackground').css({'background-image': 'url(' + game.players.x.image + ')', 'background-size': 'cover'}); //changes background of div to avatar image and sets to cover;
        game.user = 'o' // switches user to 'o' so next img selection sets up in player.o.name/img/etc
      } else {
        $('#title2').text(this.id);
        $('#playerObackground').css({'background-image': 'url(' + game.players.o.image + ')', 'background-size': 'cover'});
        game.user = 'x' //sets back to 'x', ensuring 1st click on table/td is associated to "x"'s move
      }
  });

}); //doc.ready
