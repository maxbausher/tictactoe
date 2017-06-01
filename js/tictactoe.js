
var saveLocally = false;


var game = {

  players: {

    x: {
      name: '',
      score: 0,
      image: ''
    },

    o: {
      name: '',
      score: 0,
      image: ''
    }

  },
  user: 'x',
  turns: 0,
  win: false,
  userImagesSelected: 0,
  gamesPlayed: 0,
  playersSet: false,
  levelBackgrounds:['images/moragstructure.jpg','images/novaprimebackground.jpg','images/kylnbackground.jpg','images/kylndetainees.jpeg','images/sanctuary.png','images/Knowhere.png','images/knowhereinside.jpg','images/finalbattle.jpg','images/darkastorcrash.png'],
  // levelBackgrounds: [url('../images/moragplanet.jpg')],

  board: [null, null, null, null, null, null, null, null, null],

  resetGame: function(){
    this.board = [null, null, null, null, null, null, null, null, null]
    this.turns = 0;
    this.win = false;
    this.userImagesSelected = 2;
  },

  checkWinner: function(movesArray){
    // debugger;
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
  }, //checkWinner function

  updateUI: function(){
    if (this.win) {
      // debugger;
      console.log(game.players[game.user].name + " won");
      $('#resultbanner').fadeIn(1500);
      $('#resultbanner').text(game.players[game.user].name + ' wins!');
      $('#clearHistory').hide();
      game.players[game.user].score +=1;
      game.gamesPlayed += 1;
      $('#' + game.user + ' img:hidden:first').show();

      //localStorage save of score
      if( saveLocally ){
        localStorage.setItem('gameState', JSON.stringify(game.players));
      }

      if(game.players[game.user].score === 6){
        $('body').css('background-image','url(images/finale.jpg)').fadeIn(4000);
        $('#resultbanner').css({'background-color': 'rgba(0,0,0, 0.75)','height': '150px'});
        $('#resultbanner').text(game.players[game.user].name + " is a Guardian of the Galaxy ").fadeIn(6000);
        $('#nextLevel').hide();
        $('.fade').fadeOut(1500);
        if (saveLocally){
          localStorage.removeItem('gameState');
        }
      }

      // $('.playerRecord img:hidden:first')
    } else {
      console.log('game is a draw');
      $('#resultbanner').fadeIn(1500);
      $('#resultbanner').text('Draw');
    }
  }
}; // var game

var restoreGameUI = function () {

  // $( "#x img:hidden" ).each(function() {
    var i =1;
    console.log(game.players.x.score);
    while(i <= game.players.x.score){
    //   $('#x img:nth-child(' + i + ')').show();
      $('#x').children().eq(i).show();
      i++;
    }
  // });

  $( "#o img:hidden" ).each(function() {
    var i = 1;
    while(i <= game.players.o.score){
      $('#o').children().eq(i).show();
      i++;
    }
  });

  game.userImagesSelected = 2;
  game.win = false;
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

  $( "td" ).on('click', function() {

    if(game.userImagesSelected === 0){
      alert("Player 1 needs to select a character, followed by Player 2");
      return;
    } else if(game.userImagesSelected === 1){
        alert("Player 2 still needs to select a character");
        return;
    } else {
     game.playersSet = true;
     $('.characterSelector *').hide();
    }
    var boardIndex = this.id;

    if( game.win ){
      return;
    }
    // console.log($("#" + boardIndex).css('background-image') );


    console.log( game.board[ boardIndex ] );
    if ( game.board[ boardIndex ] ){ // if cell has a length, then it is occupied
    // if ( cell === 'x' || cell === 'o'){
      $('#resultbanner').text("Occupied try again!");
      return;
    }

    game.board[ boardIndex ] = game.user; //find
    $("#" + boardIndex).css('background-image', "url(" + game.players[game.user].image + ")");
    game.turns += 1;

    game.win = game.checkWinner(game.board);
    if(game.win || game.turns === 9) {
      game.updateUI();
      return;  // avoid switching player token after win
    }

    if( game.user === 'x' ){
      game.user = 'o'
    } else {
      game.user = 'x'
    };

  }); //on-click function


  $('#nextLevel').on('click', function(){
      game.resetGame();
      // $('body').css('background-image', "url(" + game.levelBackgrounds + ")");
      $('td').css('background-image', '');
      $('#resultbanner').hide();
      $('#resultbanner').text('');
      if(game.gamesPlayed > 0){
          $('body').css('background-image', "url(" + game.levelBackgrounds[game.gamesPlayed - 1] + ")");
      };
      // $('img').css
  });

  $('#clearHistory').on('click', function(){

      localStorage.removeItem('gameState');
      game.resetGame();
      game.userImagesSelected = 0;
      game.players.x.score = 0;
      game.players.o.score = 0;
      $('#playerXbackground').css('background-image', '');
      $('#playerObackground').css('background-image', '');
      $('#x img').hide();
      $('#o img').hide();
      $('#clearHistory').hide();


  });


  $('img').on('click', function() {
      game.userImagesSelected += 1;
      game.players[game.user].name = this.id
      game.players[game.user].image = this.src
      $('#' + this.id).hide();
      if( game.user === 'x' ){
        $('#title1').text(this.id);
        $('#playerXbackground').css({'background-image': 'url(' + game.players.x.image + ')', 'background-size': 'cover'});
        game.user = 'o'
      } else {
        $('#title2').text(this.id);
        $('#playerObackground').css({'background-image': 'url(' + game.players.o.image + ')', 'background-size': 'cover'});
        game.user = 'x'
      };
  })

  $('#cheat').on('click', function () {
    game.players.x.score = 5;
    $('#0,#3,#1,#4,#2,#5,#8').click();
  })

}); //doc.ready
