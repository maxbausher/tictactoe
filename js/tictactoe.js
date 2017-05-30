



//
// players.x.score += 1;
//
// players['x'].score += 1;
//
// players[ user ].score += 1;

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
  win: true,

  board: [null, null, null, null, null, null, null, null, null],

  resetGame: function(){
    this.board = [null, null, null, null, null, null, null, null, null]
    this.turns = 0;
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
  }, //checkWinner function

  updateUI: function(){
    if (this.win) {
      // debugger;
      console.log(game.players[game.user].name + " won");
      $('h2').text(game.players[game.user].name + ' wins!');
      $('#' + game.user).text(game.players[game.user].score += 1 ); // increment score for current winner
    } else {
      console.log('game is a draw');
      $('h2').text('Draw');
    }
  }
}; // var game



$( document ).ready(function() {

    $( "td" ).on('click', function() {

      if ( $(this).text().length > 0 ){ // if cell has a length, then it is occupied
      // if ( cell === 'x' || cell === 'o'){
        alert("Occupied try again!");
        return;
      }

      game.board[ this.id ] = game.user; //find
      $("#" + this.id).css('background-image', "url(" + game.players[game.user].image + ")");
      game.turns += 1;
      if(game.checkWinner(game.board)){
        win = true;
        game.updateUI();
        game.resetGame();
        return;
      }
      if (game.turns === 9){
        game.win = false;
        game.updateUI();
        game.resetGame();
        return ;
      }
      if( game.user === 'x' ){
        game.user = 'o'
      } else {
        game.user = 'x'
      };
    }) //on-click function

    $('#reset').on('click', function(){
        game.resetGame();
        $('td').text('');
        $('h2').text('');
    });

    $('img').on('click', function() {
        game.players[game.user].name = this.id
        game.players[game.user].image = this.src
        $('#' + this.id).hide();
        if( game.user === 'x' ){
          $('#title1').text(this.id);
          game.user = 'o'
        } else {
          $('#title2').text(this.id);
          game.user = 'x'
        };
    })
}); //doc.ready
